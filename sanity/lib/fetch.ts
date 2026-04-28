import { client } from "../client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityFetch<T = any>(
  query: string,
  // GROQ accepts strings, numbers, booleans, and arrays as params; widen to any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>
): Promise<T | null> {
  if (!client) return null;
  if (params) {
    return client.fetch<T>(query, params);
  }
  return client.fetch<T>(query);
}
