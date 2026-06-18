const RESEND_BASE = "https://api.resend.com";

export interface ResendBroadcast {
  id: string;
  name: string;
  subject: string;
  status: string;
  created_at: string;
  sent_at: string | null;
  audience_id: string;
}

export interface ResendAudience {
  id: string;
  name: string;
  created_at: string;
}

export interface ResendContact {
  id: string;
  email: string;
  created_at: string;
  unsubscribed: boolean;
}

export interface EmailCampaignData {
  id: string;
  subject: string;
  status: string;
  sendDate: string | null;
  createdAt: string;
}

export interface EmailListHealthData {
  totalContacts: number;
  subscribedCount: number;
  unsubscribedCount: number;
}

async function resendFetch(
  apiKey: string,
  path: string
): Promise<Response> {
  return fetch(`${RESEND_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 300 },
  });
}

export async function fetchBroadcasts(
  apiKey: string
): Promise<EmailCampaignData[]> {
  const res = await resendFetch(apiKey, "/broadcasts");

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend broadcasts API error ${res.status}: ${text}`);
  }

  const data: { data: ResendBroadcast[] } = await res.json();

  return (data.data || []).map((b) => ({
    id: b.id,
    subject: b.subject || b.name || "Untitled",
    status: b.status || "unknown",
    sendDate: b.sent_at ? b.sent_at.split("T")[0] : null,
    createdAt: b.created_at,
  }));
}

export async function fetchAudiences(
  apiKey: string
): Promise<ResendAudience[]> {
  const res = await resendFetch(apiKey, "/audiences");

  if (!res.ok) return [];

  const data: { data: ResendAudience[] } = await res.json();
  return data.data || [];
}

export async function fetchAudienceContacts(
  apiKey: string,
  audienceId: string
): Promise<ResendContact[]> {
  const res = await resendFetch(
    apiKey,
    `/audiences/${audienceId}/contacts`
  );

  if (!res.ok) return [];

  const data: { data: ResendContact[] } = await res.json();
  return data.data || [];
}

// ---------------------------------------------------------------------------
// Write operations — broadcast creation and sending
// ---------------------------------------------------------------------------

export async function createAndSendBroadcast(
  apiKey: string,
  options: {
    audienceId: string;
    from: string;
    subject: string;
    html: string;
    previewText?: string;
    name?: string;
    replyTo?: string;
  }
): Promise<{ broadcastId: string }> {
  // Step 1: Create broadcast
  const createRes = await fetch(`${RESEND_BASE}/broadcasts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audience_id: options.audienceId,
      from: options.from,
      subject: options.subject,
      html: options.html,
      preview_text: options.previewText,
      name: options.name || options.subject,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
    }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Resend create broadcast error ${createRes.status}: ${text}`);
  }

  const createData = await createRes.json();
  const broadcastId = createData.id;

  // Step 2: Send the broadcast
  const sendRes = await fetch(`${RESEND_BASE}/broadcasts/${broadcastId}/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!sendRes.ok) {
    const text = await sendRes.text();
    throw new Error(`Resend send broadcast error ${sendRes.status}: ${text}`);
  }

  return { broadcastId };
}

/** Find an audience by exact name, or create it. Returns the audience id.
 *
 * Uses cache:"no-store" deliberately — the shared resendFetch helper caches GETs
 * for 300s, which made `send` read a stale audience list and create a SECOND
 * empty audience that seed had just populated (Resend 422 "no contacts"). If an
 * earlier run left duplicates of the same name, prefer the populated one. */
export async function ensureAudience(apiKey: string, name: string): Promise<string> {
  const listRes = await fetch(`${RESEND_BASE}/audiences`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });
  const all: ResendAudience[] = listRes.ok ? ((await listRes.json()).data ?? []) : [];
  const matches = all.filter((a) => a.name === name);

  if (matches.length === 1) return matches[0].id;
  if (matches.length > 1) {
    // Duplicate names from the earlier cache bug — pick the one with the most contacts.
    let bestId = matches[0].id;
    let bestCount = -1;
    for (const a of matches) {
      const cRes = await fetch(`${RESEND_BASE}/audiences/${a.id}/contacts`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      });
      const count = cRes.ok ? (((await cRes.json()).data ?? []) as unknown[]).length : 0;
      if (count > bestCount) {
        bestCount = count;
        bestId = a.id;
      }
    }
    return bestId;
  }

  const res = await fetch(`${RESEND_BASE}/audiences`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend create audience error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.id as string;
}

/** Send a single transactional email (used for test/preview sends, not broadcasts). */
export async function sendSingleEmail(
  apiKey: string,
  options: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    replyTo?: string;
    headers?: Record<string, string>;
  }
): Promise<{ id: string }> {
  const res = await fetch(`${RESEND_BASE}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.replyTo ? { reply_to: options.replyTo } : {}),
      ...(options.headers ? { headers: options.headers } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend send email error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return { id: data.id as string };
}

export async function addContactToAudience(
  apiKey: string,
  audienceId: string,
  email: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  const res = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name: firstName,
      last_name: lastName,
      unsubscribed: false,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    // Don't throw on 409 (already exists)
    if (res.status !== 409) {
      throw new Error(`Resend add contact error ${res.status}: ${text}`);
    }
  }
}

export async function fetchListHealth(
  apiKey: string
): Promise<EmailListHealthData> {
  const audiences = await fetchAudiences(apiKey);

  let totalContacts = 0;
  let subscribedCount = 0;
  let unsubscribedCount = 0;

  for (const audience of audiences) {
    const contacts = await fetchAudienceContacts(apiKey, audience.id);
    totalContacts += contacts.length;
    subscribedCount += contacts.filter((c) => !c.unsubscribed).length;
    unsubscribedCount += contacts.filter((c) => c.unsubscribed).length;
  }

  return { totalContacts, subscribedCount, unsubscribedCount };
}
