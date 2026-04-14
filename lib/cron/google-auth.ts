// Google Cloud auth via Vercel OIDC → Workload Identity Federation → service
// account impersonation. No service account keys on disk anywhere.
//
// Flow:
// 1. Fetch Vercel's OIDC token via @vercel/functions/oidc.
// 2. Exchange it at Google's STS endpoint for a federated access token.
// 3. Impersonate the target service account to get a scoped GCP access token.
// 4. Callers use that token for GA4 / GSC / etc.

import { getVercelOidcToken } from "@vercel/functions/oidc";

const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/webmasters.readonly",
];

const STS_URL = "https://sts.googleapis.com/v1/token";

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cache: CachedToken | null = null;

export async function getAccessToken(): Promise<string> {
  if (cache && Date.now() < cache.expiresAt - 60_000) {
    return cache.token;
  }

  const audience = process.env.GOOGLE_WORKLOAD_IDENTITY_AUDIENCE;
  const impersonationUrl = process.env.GOOGLE_SERVICE_ACCOUNT_IMPERSONATION_URL;

  const oidcToken = await getVercelOidcToken().catch(() => null);
  if (!oidcToken) {
    throw new Error(
      "Vercel OIDC token unavailable — enable OIDC federation on this project"
    );
  }
  if (!audience) {
    throw new Error("GOOGLE_WORKLOAD_IDENTITY_AUDIENCE not configured");
  }
  if (!impersonationUrl) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_IMPERSONATION_URL not configured"
    );
  }

  const federatedToken = await exchangeOidcForFederatedToken(
    oidcToken,
    audience
  );
  const accessToken = await impersonateServiceAccount(
    federatedToken,
    impersonationUrl
  );

  cache = {
    token: accessToken.token,
    expiresAt: accessToken.expiresAt,
  };

  return accessToken.token;
}

async function exchangeOidcForFederatedToken(
  oidcToken: string,
  audience: string
): Promise<string> {
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    audience,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
    subject_token: oidcToken,
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
  });

  const res = await fetch(STS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`STS token exchange failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("STS response missing access_token");
  }
  return data.access_token;
}

async function impersonateServiceAccount(
  federatedToken: string,
  impersonationUrl: string
): Promise<{ token: string; expiresAt: number }> {
  const res = await fetch(impersonationUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${federatedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: SCOPES,
      lifetime: "3600s",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Service account impersonation failed (${res.status}): ${text}`
    );
  }

  const data = (await res.json()) as {
    accessToken?: string;
    expireTime?: string;
  };

  if (!data.accessToken || !data.expireTime) {
    throw new Error("Impersonation response missing accessToken/expireTime");
  }

  return {
    token: data.accessToken,
    expiresAt: new Date(data.expireTime).getTime(),
  };
}
