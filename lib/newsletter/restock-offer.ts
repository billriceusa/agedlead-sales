import { rebrandNoticeHtml } from "@/lib/rebrand-notice";
import { STORE_VERTICALS, storeUrl, catalogueUrl } from "./store-links";

/**
 * The recurring restock offer — the broadcast this program never had.
 *
 * WHAT WAS MISSING
 *
 * Until now the only thing that ever asked a reader to buy again was a
 * per-person journey: `replenishment` (21–90 days since last order) and
 * `winback` (90+ days), both in lib/als/lifecycle.ts. Those are one-shot. A
 * contact walks each journey exactly once, and after that nothing in the system
 * ever puts the store in front of them again. The Tuesday newsletter is
 * education and deliberately keeps the store links beside the content rather
 * than as the content.
 *
 * So a buyer who completed win-back in March hears no offer for the rest of
 * their life on this list, and that is the segment the store actually earns
 * from. On 2026-09-11, store-side GA4 (357329146) for Aug 1 – Sep 10 read:
 *
 *   our affiliate link, cold traffic to marketing pages   137 sessions    $707
 *   returning buyers landing on /customers/login           76 sessions  $8,693
 *
 * Five dollars a session against a hundred and fourteen. The money in that
 * store is repeat purchase by people who already have an account. This email is
 * the only thing in the system that reaches all of them on a schedule.
 *
 * WHY A ROTATION AND NOT ONE TEMPLATE
 *
 * `lib/newsletter/offer-email.ts` is the one-off that mailed on 2026-09-10. It
 * is written for a single moment ("Don't go into Q4 with a thin pipeline") and
 * cannot be re-sent monthly without reading as a form letter. A recurring send
 * has to say something slightly different each time or it trains the list to
 * ignore it, which costs far more than the send is worth.
 *
 * Six editions rotate by month index, so nothing repeats inside half a year.
 *
 * WHY EVERY EDITION IS EVERGREEN
 *
 * No season, no month name, no "ends Friday", no countdown. Two reasons. The
 * rotation is modular arithmetic, so a seasonal edition would eventually land
 * in the wrong month and mail something visibly stale to the whole list. And
 * invented urgency on inventory we do not control is exactly the device the
 * one-off template refuses, for the same reason: this list has been sold to
 * before, and the restraint is what keeps the door worth opening.
 *
 * Each edition is one true observation about running a pipeline, and then the
 * door. A reader who does not want to buy leads this month should be able to
 * tell that from the subject line and never open it.
 *
 * INHERITED RULES — these are not restatements, they are load-bearing
 *
 * - **No prices.** `lib/newsletter/issue-gate.ts` blocks a send that quotes
 *   one, because the 2026-08-10 issue quoted "$0.25" against a real $0.40 floor
 *   and mailed before anyone noticed. The storefront shows the live price.
 * - **No first-person purchasing claims.** Bill is not a current lead buyer
 *   (confirmed 2026-09-02). His authority is 25+ years building lead programs,
 *   and the copy must never borrow a customer's authority instead.
 * - **Affordability framed as sustainability, never as "cheap".**
 * - **Disclosure is one clause beside the links**, not a paragraph. Disclose
 *   and move on; making the arrangement the subject displaces the reader.
 * - **No claim about anyone's results.** The reader's own decision to look is
 *   the only thing asserted.
 */

export interface RestockEdition {
  /** Stable slug. Rides in `utm_content` — renaming one resets its trend line. */
  key: string;
  subject: string;
  previewText: string;
  /** Banner headline. Short — it wraps on a phone at about 40 characters. */
  headline: string;
  /** One line under the headline. */
  subhead: string;
  /** Body paragraphs above the vertical buttons. Plain strings; `<em>` allowed. */
  body: string[];
  /** The line that introduces the buttons. */
  prompt: string;
}

/** Campaign name. Separate from `weekly-newsletter` and from the one-off
 *  `direct-offer` so this program's performance can be read on its own. */
export const RESTOCK_CAMPAIGN = "restock-offer";

export const RESTOCK_EDITIONS: RestockEdition[] = [
  {
    key: "run-dry",
    subject: "What's left in your pipeline right now?",
    previewText: "Nine verticals. Restock whatever you're short on.",
    headline: "Reload before you run dry",
    subhead: "Nine verticals, one link each.",
    body: [
      "The quiet way a good month goes wrong is running out of people to call. Not a slump, not a bad market. Just a list that got worked all the way down while nothing new came in behind it.",
      "It is hard to see coming because the last week of a batch feels productive. You are talking to the people who were easiest to reach, the conversations are warm, and the pipeline looks fine right up to the morning it is empty.",
      "The operators who stay steady reload on a rhythm rather than on a feeling. They decide what a month's worth of opportunity costs them, they buy that much, and they do it again before the last batch is finished. That is what aged leads are <em>for</em>: affordable enough to buy consistently rather than once.",
    ],
    prompt: "See what is in stock right now:",
  },
  {
    key: "second-pass",
    subject: "The batch you already bought is not finished",
    previewText: "Most of a list is still unworked when people move on.",
    headline: "Most lists get abandoned early",
    subhead: "Work the one you have, then reload.",
    body: [
      "Most people work a batch top to bottom once, reach the easy contacts, and call the rest dead. The rest are not dead. They are unreached, which is a different problem with a different fix.",
      "Before you buy anything, run one more pass at what you already have. Email everyone who never answered the phone, then aim your calling hours at whoever opened or replied. Your contact rate climbs because you are spending your dials on people who have just shown you they are there.",
      "That habit is also what makes the next batch worth more. A list is not a one-time asset you use up. It is a base you keep working, and topping it up regularly costs less than starting over every quarter.",
    ],
    prompt: "Top up whichever vertical you work:",
  },
  {
    key: "cost-per-sale",
    subject: "Cost per lead is not the number that matters",
    previewText: "Cost per sale is. Here is how to size a monthly buy.",
    headline: "Size the buy, not the lead",
    subhead: "Nine verticals, one link each.",
    body: [
      "The number most people shop on is what a lead costs. The number that decides whether the month worked is what a sale costs, and those two move in opposite directions more often than you would think.",
      "A more expensive record that you reach on the first try can cost less per sale than a pile of bargain ones nobody works. The reverse is true too: a modest list you actually run a sequence against beats a premium one that sits in a spreadsheet.",
      "The point is that you cannot know which until you put your own close rate and your own commission into it. Then a monthly buy stops being a guess and becomes a budget line you can defend.",
    ],
    prompt: "Once you know your number, pick your vertical:",
  },
  {
    key: "steady-beats-big",
    subject: "One big order is worse than six small ones",
    previewText: "Why the rhythm matters more than the batch size.",
    headline: "Steady beats big",
    subhead: "A restock you can keep making.",
    body: [
      "The most common mistake with aged leads is treating them as an event. One large order, a burst of activity, and then months of nothing while the results get evaluated.",
      "The trouble is that a single batch gives you one shot at everything at once. Your sequence, your timing, your script and your market all get tested together, and whatever happens you cannot tell which part was responsible.",
      "Smaller and more often fixes that. You get a read on what is working while you can still change it, the workload stays inside what one person can actually run, and there is always something fresh behind the batch you are finishing.",
    ],
    prompt: "Set the rhythm here:",
  },
  {
    key: "email-first",
    subject: "The cheapest way to find out who is still there",
    previewText: "Let the list filter itself before you spend dial time on it.",
    headline: "Let the list filter itself",
    subhead: "Nine verticals, one link each.",
    body: [
      "Every batch has three groups in it: people who are gone, people who are reachable but not interested, and people who still want what they asked about. The whole economics of a list come down to how cheaply you can tell them apart.",
      "Dialing through the batch to find out is the expensive way. It spends the most costly hour you have, your own, on the discovery step rather than on the conversation.",
      "Email is the cheap way. Send the whole batch a plain, useful note first, then aim your calls at whoever opened or replied. Same list, same week, a fraction of the labor, and the people you do call are the ones who just raised their hand.",
    ],
    prompt: "Pick a vertical and put the method to work:",
  },
  {
    key: "what-they-want-now",
    subject: "They are not shopping for what they asked about",
    previewText: "An aged record is a person whose situation moved on.",
    headline: "The enquiry aged. The need did not.",
    subhead: "Nine verticals, one link each.",
    body: [
      "An aged record is not a stale version of a fresh one. It is a person whose circumstances have moved since they filled in the form, and that is usually an advantage rather than a defect.",
      "A rate shopper from a year ago has had a renewal since. Someone who looked at cover after a new baby now has a mortgage as well. The thing that made them search is rarely resolved, and the thing that will make them answer is usually whatever has changed since.",
      "So the opening line that works is not a callback about the old enquiry. It is a question about where they are now. Write to that and an old list stops behaving like an old list.",
    ],
    prompt: "Choose the vertical you sell:",
  },
];

/**
 * The edition for a given date.
 *
 * Indexed by calendar month so the sequence is deterministic and auditable —
 * any date maps to exactly one edition, and a replay of an old label renders
 * the same bytes it rendered the first time. With six editions on a monthly
 * send, a reader sees each one twice a year at most.
 */
export function editionFor(date: Date): RestockEdition {
  const index = date.getUTCMonth() % RESTOCK_EDITIONS.length;
  return RESTOCK_EDITIONS[index];
}

/**
 * The archive label for the month containing `date`: its first Sunday, in UTC.
 *
 * Both cron modes call this rather than remembering a label between runs. The
 * draft writes to it, the send reads it, and because it is a pure function of
 * the month, a send that runs after a failed draft simply finds nothing and
 * no-ops instead of mailing something unreviewed.
 *
 * The whole scheduling scheme reduces to this one function, which is why it is
 * tested rather than trusted. The newsletter's equivalent — the Monday label —
 * was wrong for months, silently skipped a send to 2,628 people, and reported
 * itself healthy while doing it.
 */
/**
 * Hours elapsed since the draft run that wrote `label`.
 *
 * The draft cron fires at 14:00 UTC, so the label plus that time is when the
 * review window opened. The send refuses to fire before the window closes.
 *
 * This lives here, and is tested, because it is the only thing standing between
 * "Bill gets a genuine chance to stop this" and "the STOP link is decorative".
 * Auto-send once mailed a preview and the live broadcast in the same run, and
 * the fix was structural rather than a promise — this is the arithmetic half of
 * that fix.
 */
export function hoursSinceDraft(label: string, now: Date): number {
  return (now.getTime() - Date.parse(`${label}T14:00:00Z`)) / 3_600_000;
}

export function firstSundayLabel(date: Date): string {
  const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  // getUTCDay(): 0 = Sunday. Days to add to reach the first Sunday on or after
  // the 1st; 0 when the month itself starts on a Sunday.
  const offset = (7 - first.getUTCDay()) % 7;
  const sunday = new Date(first.getTime() + offset * 86_400_000);
  return sunday.toISOString().slice(0, 10);
}

/**
 * @param edition Which edition to render, from `editionFor`.
 * @param label   Send label, `YYYY-MM-DD`. Rides in every `utm_content`, so it
 *                must match the archive filename or the report cannot join them.
 * @param siteUrl Absolute site origin, from `lib/site-url.ts`. Never hardcode.
 */
export function buildRestockHtml(
  edition: RestockEdition,
  label: string,
  siteUrl: string,
): string {
  const host = siteUrl.replace(/^https?:\/\//, "");
  const content = `${label}-${edition.key}`;

  const verticalButtons = STORE_VERTICALS.map(
    (v) => `
                <tr>
                  <td style="padding: 0 0 10px 0;">
                    <a href="${storeUrl(content, `vertical-${v.key}`, v.segment, RESTOCK_CAMPAIGN)}"
                       style="display: block; padding: 14px 20px; background-color: #ffffff; border: 1px solid #d4d4d8; border-radius: 8px; color: #18181b; text-decoration: none; font-size: 16px; font-weight: 600;">
                      ${v.label} <span style="color: #2563eb; font-weight: 500;">&rarr;</span>
                    </a>
                  </td>
                </tr>`,
  ).join("");

  const paragraphs = edition.body
    .map(
      (text) =>
        `<p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">${text}</p>`,
    )
    .join("\n              ");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${edition.subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${edition.previewText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 28px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800;">${edition.headline}</h1>
              <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">${edition.subhead}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 32px 8px;">
              ${paragraphs}

              <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px; line-height: 1.7; font-weight: 600;">${edition.prompt}</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${verticalButtons}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 32px 8px;">
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">Not listed? <a href="${catalogueUrl(content, "catalogue", RESTOCK_CAMPAIGN)}" style="color: #2563eb; text-decoration: none; font-weight: 600;">Browse the full catalogue</a>. <span style="color: #9ca3af;">Affiliate links — we may earn a commission at no cost to you.</span></p>

              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.7;">Not sure what you can afford to pay per lead? The <a href="${siteUrl}/calculators/know-your-cpl?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=${RESTOCK_CAMPAIGN}&amp;utm_content=${content}-calculator" style="color: #2563eb; text-decoration: none; font-weight: 600;">cost-per-lead calculator</a> works it out from your own close rate and commission, so you can size a monthly buy you will still be making next year.</p>

              <p style="margin: 0 0 4px 0; color: #111827; font-weight: 600; font-size: 16px;">— Bill Rice</p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
                <a href="${siteUrl}" style="color: #1e40af; text-decoration: none; font-weight: 600;">Work Aged Leads</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/playbook" style="color: #6b7280; text-decoration: none;">Playbook</a> &nbsp;|&nbsp;
                <a href="${siteUrl}/calculators" style="color: #6b7280; text-decoration: none;">Calculators</a>
              </p>
              <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                You're receiving this because you signed up at ${host}. Links to Aged Lead Store are affiliate links.
              </p>
              ${rebrandNoticeHtml()}
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
              <p style="margin: 12px 0 0 0; color: #d1d5db; font-size: 11px;">${label}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
