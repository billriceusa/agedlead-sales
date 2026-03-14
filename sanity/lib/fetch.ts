import { client } from "../client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityFetch<T = any>(
  query: string,
  params?: Record<string, string>
): Promise<T | null> {
  if (!client) return null;
  if (params) {
    return client.fetch<T>(query, params);
  }
  return client.fetch<T>(query);
}
