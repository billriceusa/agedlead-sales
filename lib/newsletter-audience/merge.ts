/**
 * Merge the two retiring newsletter audiences into the Work Aged Leads audience.
 *
 * Why this is a module with tests rather than a one-off script: the consolidation
 * runs at least twice. Once now, to seed the new audience, and again on cutover
 * day to sweep up everyone who subscribed on agedleadsales.com or
 * howtoworkleads.com in between. A one-shot import would either duplicate the
 * first run or silently skip the stragglers.
 *
 * The rule that matters is suppression. An unsubscribe is a legal instruction,
 * and it does not travel with a list unless someone carries it. Every path below
 * is written so that the ONLY state transition this code can ever make on a
 * person is subscribed -> unsubscribed. It can never do the reverse, from any
 * source, in any order. That asymmetry is what `planWrites` encodes and what the
 * tests exist to hold.
 */

/** A contact row as Resend's `GET /audiences/{id}/contacts` returns it. */
export interface ResendContactRow {
  id?: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  unsubscribed?: boolean;
}

export interface AudienceSource {
  /** The Resend audience name, used to label the plan output. */
  name: string;
  contacts: ResendContactRow[];
}

export interface MergedContact {
  /** Normalized — lowercased and trimmed. */
  email: string;
  firstName: string | null;
  lastName: string | null;
  unsubscribed: boolean;
  /** Every source audience this address appeared on, in input order. */
  sources: string[];
}

export interface SourceStats {
  name: string;
  rows: number;
  distinct: number;
  unsubscribed: number;
}

export interface MergeStats {
  perSource: SourceStats[];
  distinct: number;
  onMoreThanOneSource: number;
  suppressed: number;
  sendable: number;
  skipped: { email: string; reason: string }[];
}

export interface MergeResult {
  contacts: MergedContact[];
  stats: MergeStats;
}

export function normalizeEmail(raw: string | null | undefined): string {
  return (raw ?? "").trim().toLowerCase();
}

/** Deliberately permissive. Resend already validated these on the way in; this
 * only catches blank and obviously malformed rows so they surface in the plan
 * instead of failing one at a time against the API. */
export function isPlausibleEmail(email: string): boolean {
  if (!email || /\s/.test(email)) return false;
  const at = email.indexOf("@");
  if (at <= 0 || at !== email.lastIndexOf("@")) return false;
  const domain = email.slice(at + 1);
  return domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".");
}

function firstNonEmpty(...values: (string | null | undefined)[]): string | null {
  for (const v of values) {
    const trimmed = (v ?? "").trim();
    if (trimmed) return trimmed;
  }
  return null;
}

/**
 * Fold N source audiences into one deduped list.
 *
 * Dedupe key is the normalized email. Where an address appears more than once:
 * unsubscribed wins over subscribed regardless of which source it came from,
 * and the first non-empty name wins (so a source that captured a name beats one
 * that only captured an address, whatever order they are passed in).
 */
export function mergeAudiences(sources: AudienceSource[]): MergeResult {
  const byEmail = new Map<string, MergedContact>();
  const perSource: SourceStats[] = [];
  const skipped: { email: string; reason: string }[] = [];

  for (const source of sources) {
    const seenHere = new Set<string>();
    let unsubscribedHere = 0;

    for (const row of source.contacts) {
      const email = normalizeEmail(row.email);

      if (!isPlausibleEmail(email)) {
        skipped.push({
          email: row.email ?? "(blank)",
          reason: `unusable address on ${source.name}`,
        });
        continue;
      }

      seenHere.add(email);
      if (row.unsubscribed) unsubscribedHere++;

      const existing = byEmail.get(email);
      if (!existing) {
        byEmail.set(email, {
          email,
          firstName: firstNonEmpty(row.first_name),
          lastName: firstNonEmpty(row.last_name),
          unsubscribed: row.unsubscribed === true,
          sources: [source.name],
        });
        continue;
      }

      // Suppression is one-way: once any source says unsubscribed, it stays.
      existing.unsubscribed = existing.unsubscribed || row.unsubscribed === true;
      existing.firstName = firstNonEmpty(existing.firstName, row.first_name);
      existing.lastName = firstNonEmpty(existing.lastName, row.last_name);
      if (!existing.sources.includes(source.name)) {
        existing.sources.push(source.name);
      }
    }

    perSource.push({
      name: source.name,
      rows: source.contacts.length,
      distinct: seenHere.size,
      unsubscribed: unsubscribedHere,
    });
  }

  const contacts = [...byEmail.values()].sort((a, b) =>
    a.email.localeCompare(b.email),
  );
  const suppressed = contacts.filter((c) => c.unsubscribed).length;

  return {
    contacts,
    stats: {
      perSource,
      distinct: contacts.length,
      onMoreThanOneSource: contacts.filter((c) => c.sources.length > 1).length,
      suppressed,
      sendable: contacts.length - suppressed,
      skipped,
    },
  };
}

export type WriteAction =
  | { kind: "create"; contact: MergedContact }
  | { kind: "suppress"; contact: MergedContact; targetContactId: string }
  | { kind: "unchanged"; contact: MergedContact; reason: string };

/**
 * Diff the merged list against what is already in the target audience.
 *
 * Re-runnable by construction: an address already present and already in the
 * right state produces no write. The one case worth reading twice is a contact
 * the target has as unsubscribed while the merged list says subscribed — that
 * is someone who unsubscribed from the NEW list after the last run, and the
 * answer is to leave them alone. Re-adding them as subscribed is the one
 * mistake in this migration that cannot be walked back.
 */
export function planWrites(
  merged: MergedContact[],
  targetContacts: ResendContactRow[],
): WriteAction[] {
  const target = new Map<string, ResendContactRow>();
  for (const row of targetContacts) {
    const email = normalizeEmail(row.email);
    if (email) target.set(email, row);
  }

  return merged.map((contact): WriteAction => {
    const existing = target.get(contact.email);

    if (!existing) return { kind: "create", contact };

    if (existing.unsubscribed) {
      return {
        kind: "unchanged",
        contact,
        reason: "already unsubscribed on the target — never resubscribe",
      };
    }

    if (contact.unsubscribed) {
      if (!existing.id) {
        return {
          kind: "unchanged",
          contact,
          reason: "needs suppressing but the target row has no id",
        };
      }
      return { kind: "suppress", contact, targetContactId: existing.id };
    }

    return { kind: "unchanged", contact, reason: "already present and subscribed" };
  });
}

export function summarizePlan(actions: WriteAction[]): {
  create: number;
  createSuppressed: number;
  suppress: number;
  unchanged: number;
} {
  const create = actions.filter((a) => a.kind === "create");
  return {
    create: create.length,
    createSuppressed: create.filter((a) => a.contact.unsubscribed).length,
    suppress: actions.filter((a) => a.kind === "suppress").length,
    unchanged: actions.filter((a) => a.kind === "unchanged").length,
  };
}
