import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildRestockHtml,
  editionFor,
  firstSundayLabel,
  hoursSinceDraft,
  RESTOCK_CAMPAIGN,
  RESTOCK_EDITIONS,
} from "./restock-offer";
import { STORE_VERTICALS } from "./store-links";
import { checkIssueHtml } from "./issue-gate";

const LABEL = "2026-10-04";
const SITE = "https://workagedleads.com";

function urls(html: string): URL[] {
  return [...html.matchAll(/href="(https:\/\/[^"]+)"/g)].map(
    (m) => new URL(m[1].replace(/&amp;/g, "&")),
  );
}

/**
 * Every invariant runs against EVERY edition.
 *
 * This is the difference between testing this module and testing
 * `offer-email.ts`. That one has a single body, so checking it once checks the
 * thing that mails. This one rotates, so a rule that holds for the edition
 * someone happened to test and fails for the one that mails in March is not a
 * rule at all — it is a coincidence with a test around it.
 */
const ALL = RESTOCK_EDITIONS.map((e) => [e.key, e] as const);

describe("restock offer editions", () => {
  test("every edition passes the gate the sender re-runs at transmission", () => {
    // The send path re-scans the archived bytes. A template that could fail
    // that gate would fail it at send time, on an offer already reviewed —
    // the worst possible moment to discover it.
    for (const [key, edition] of ALL) {
      const gate = checkIssueHtml(buildRestockHtml(edition, LABEL, SITE));
      assert.equal(gate.ok, true, `${key}: ${gate.reason}`);
    }
  });

  test("no edition quotes a price", () => {
    // Partner pricing is Troy's to publish and it moves. The 2026-08-10 issue
    // quoted "$0.25" against a real $0.40 floor and mailed before anyone noticed.
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, SITE);
      assert.equal(/\$\s*\d/.test(html), false, `${key} contains a dollar figure`);
    }
  });

  test("no edition argues that leads are cheap", () => {
    // Affordability is framed as sustainability — something you can keep doing
    // — never as a bargain. Describing the METHOD as cheap is fine and true;
    // describing the LEADS that way is the drift this guards against, so the
    // check is proximity-based rather than a blanket ban on the word.
    for (const [key, edition] of ALL) {
      const body = buildRestockHtml(edition, LABEL, SITE).replace(/<[^>]+>/g, " ");
      assert.equal(
        /cheap[^.]{0,40}\bleads?\b|\bleads?\b[^.]{0,40}cheap/i.test(body),
        false,
        `${key} calls the leads cheap`,
      );
    }
  });

  test("every edition makes the consistency argument", () => {
    for (const [key, edition] of ALL) {
      const body = buildRestockHtml(edition, LABEL, SITE).replace(/<[^>]+>/g, " ");
      assert.match(
        body,
        /consistent|steady|rhythm|regular|monthly|keep (?:doing|making)/i,
        `${key} is missing the consistency framing`,
      );
    }
  });

  test("no edition names a season, month or deadline", () => {
    // The rotation is modular arithmetic, so a seasonal edition eventually
    // lands in the wrong month and mails something visibly stale to the whole
    // list. Invented urgency is separately banned: we do not control the
    // inventory and cannot honestly say it is running out.
    const timebound = [
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/,
      /\bQ[1-4]\b/,
      /\b(?:spring|summer|autumn|fall|winter)\b/i,
      /\bends? (?:today|tonight|friday|soon|this week)\b/i,
      /\blast chance\b/i,
      /\bhurry\b/i,
      /\bwhile (?:supplies|stocks) last\b/i,
      /\blimited time\b/i,
      /\bact now\b/i,
    ];
    for (const [key, edition] of ALL) {
      const body = buildRestockHtml(edition, LABEL, SITE).replace(/<[^>]+>/g, " ");
      for (const re of timebound) {
        assert.equal(re.test(body), false, `${key} matched ${re}`);
      }
    }
  });

  test("no edition makes a first-person claim about buying leads", () => {
    // Bill is NOT currently an active lead buyer (confirmed 2026-09-02). His
    // authority is 25+ years building lead programs, and the copy must never
    // borrow a customer's authority instead.
    const claims = [
      /\bI buy\b/i,
      /\bI (?:re)?stock\b/i,
      /\bI order\b/i,
      /\bI purchase\b/i,
      /\bwhere I (?:actually )?(?:buy|shop|restock)\b/i,
      /\bmy (?:lead )?(?:orders?|buys?|supplier)\b/i,
    ];
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, SITE);
      for (const re of claims) {
        assert.equal(re.test(html), false, `${key} matched ${re}`);
      }
    }
  });

  test("no edition claims a result for anyone but the reader", () => {
    // We have no permission to publish a customer's numbers and no verified
    // set to publish. An invented outcome is the fastest way to lose a list.
    const results = [
      /\b\d+%\s*(?:close|conversion|contact|reply|open)\b/i,
      /\b(?:doubled|tripled|10x|10 ?x)\b/i,
      /\bour (?:customers|buyers|clients) (?:see|get|report)\b/i,
      /\bproven to\b/i,
      /\bguarantee/i,
    ];
    for (const [key, edition] of ALL) {
      const body = buildRestockHtml(edition, LABEL, SITE).replace(/<[^>]+>/g, " ");
      for (const re of results) {
        assert.equal(re.test(body), false, `${key} matched ${re}`);
      }
    }
  });

  test("no edition leaks strategy or internal reasoning to the reader", () => {
    // Bill, on an earlier subhead that read "One email, one job": "You
    // basically told the reader — I'm sending you an email to get your click.
    // Ugh! Yuck!" The reader must never be shown the machinery.
    const leaks = [
      /one email,? one job/i,
      /\bthis email (?:is|has|does|exists)/i,
      /\b(?:we|I) (?:want|need) (?:your|a) click/i,
      /\bcall.to.action\b/i,
      /\bwe(?:'re| are) testing\b/i,
      /\bour (?:strategy|goal|objective) (?:here|with this)/i,
      /\bthe (?:point|purpose) of this email\b/i,
      /\bmonthly (?:offer|broadcast|send)\b/i,
      /\bedition\b/i,
    ];
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, SITE);
      for (const re of leaks) {
        assert.equal(re.test(html), false, `${key} matched ${re}`);
      }
    }
  });

  test("every edition discloses the affiliate relationship, briefly", () => {
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, SITE);
      assert.match(html, /affiliate link/i, `${key}: no affiliate disclosure`);
      assert.match(html, /at no cost to you/i, `${key}: disclosure omits the no-cost clause`);
      const mentions = (html.match(/affiliate/gi) ?? []).length;
      assert.ok(mentions <= 3, `${key}: affiliate mentioned ${mentions} times — do not dwell`);
    }
  });

  test("every edition is written to the reader, not about Bill", () => {
    for (const [key, edition] of ALL) {
      const body = buildRestockHtml(edition, LABEL, SITE).replace(/<[^>]+>/g, " ");
      const you = (body.match(/\b(?:you|your)\b/gi) ?? []).length;
      const i = (body.match(/\bI\b/g) ?? []).length;
      assert.ok(you > i, `${key}: "you" ${you} vs "I" ${i}`);
    }
  });

  test("every edition offers every vertical the partner stocks", () => {
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, SITE);
      for (const v of STORE_VERTICALS) {
        assert.ok(html.includes(v.label), `${key}: missing button ${v.label}`);
        assert.ok(html.includes(`/${v.segment}/leads`), `${key}: missing segment ${v.segment}`);
      }
    }
  });

  test("every store link is tagged to the restock campaign", () => {
    // Tagging these as `weekly-newsletter` or as the one-off `direct-offer`
    // would average three different programs into one trend line and none of
    // them could be read afterwards.
    for (const [key, edition] of ALL) {
      const store = urls(buildRestockHtml(edition, LABEL, SITE)).filter((u) =>
        u.hostname.endsWith("agedleadstore.com"),
      );
      assert.ok(store.length >= STORE_VERTICALS.length, `${key}: too few store links`);
      for (const u of store) {
        assert.equal(u.searchParams.get("utm_campaign"), RESTOCK_CAMPAIGN, `${key}: ${u.href}`);
        assert.equal(u.searchParams.get("utm_medium"), "email", `${key}: ${u.href}`);
      }
    }
  });

  test("every store link gets a distinct utm_content", () => {
    // Two verticals legitimately share a destination — the partner maps Final
    // Expense onto life_insurance — so the placement tag is the only thing
    // separating them in GA4.
    for (const [key, edition] of ALL) {
      const contents = urls(buildRestockHtml(edition, LABEL, SITE))
        .filter((u) => u.hostname.endsWith("agedleadstore.com"))
        .map((u) => u.searchParams.get("utm_content"));
      assert.equal(new Set(contents).size, contents.length, `${key}: duplicate utm_content`);
    }
  });

  test("utm_content carries both the send label and the edition", () => {
    // The label joins a click back to the archived bytes. The edition key is
    // what makes the rotation measurable — without it, six different emails
    // report as one undifferentiated monthly campaign and there is no way to
    // learn which argument works.
    for (const [key, edition] of ALL) {
      const contents = urls(buildRestockHtml(edition, LABEL, SITE))
        .filter((u) => u.hostname.endsWith("agedleadstore.com"))
        .map((u) => u.searchParams.get("utm_content") ?? "");
      assert.ok(contents.length > 0);
      assert.ok(
        contents.every((c) => c.startsWith(`${LABEL}-${key}-`)),
        `${key}: ${contents.join(", ")}`,
      );
    }
  });

  test("every edition builds site links from the passed origin", () => {
    // lib/site-url.ts exists because a `www.agedleadsales.com` fallback drifted
    // into a live mailer once. A template that hardcodes a host mails dead links.
    for (const [key, edition] of ALL) {
      const html = buildRestockHtml(edition, LABEL, "https://example.test");
      assert.equal(html.includes("agedleadsales.com"), false, `${key} hardcodes a host`);
      assert.ok(html.includes("https://example.test/calculators/know-your-cpl"), key);
    }
  });

  test("every edition keeps the unsubscribe merge tag intact", () => {
    // Resend resolves this only on a broadcast. Escaped or renamed, every
    // recipient gets a dead unsubscribe link — CAN-SPAM, not cosmetics.
    for (const [key, edition] of ALL) {
      assert.ok(
        buildRestockHtml(edition, LABEL, SITE).includes("{{{RESEND_UNSUBSCRIBE_URL}}}"),
        key,
      );
    }
  });

  test("edition keys are unique and stable-looking", () => {
    // The key rides in utm_content. A duplicate would merge two arguments into
    // one trend line; a rename resets the only history the rotation has.
    const keys = RESTOCK_EDITIONS.map((e) => e.key);
    assert.equal(new Set(keys).size, keys.length, "duplicate edition key");
    for (const k of keys) assert.match(k, /^[a-z][a-z0-9-]*$/, `bad key: ${k}`);
  });

  test("every edition has a subject, preview text and body", () => {
    for (const [key, edition] of ALL) {
      assert.ok(edition.subject.length > 0, key);
      assert.ok(edition.previewText.length > 0, key);
      assert.ok(edition.body.length >= 2, `${key}: too thin to be worth a send`);
    }
  });
});

describe("editionFor", () => {
  test("uses every edition across a year", () => {
    // A rotation that skips one is a maintenance trap: the unused copy rots
    // and nobody notices until it finally mails.
    const used = new Set<string>();
    for (let m = 0; m < 12; m++) {
      used.add(editionFor(new Date(Date.UTC(2026, m, 15))).key);
    }
    assert.equal(used.size, RESTOCK_EDITIONS.length, [...used].join(", "));
  });

  test("is deterministic, so replaying an old label renders the same bytes", () => {
    const a = editionFor(new Date("2026-10-04T12:00:00Z"));
    const b = editionFor(new Date("2026-10-04T12:00:00Z"));
    assert.equal(a.key, b.key);
  });

  test("does not repeat inside six months", () => {
    for (let start = 0; start < 12; start++) {
      const run = new Set<string>();
      for (let i = 0; i < RESTOCK_EDITIONS.length; i++) {
        run.add(editionFor(new Date(Date.UTC(2026, start + i, 15))).key);
      }
      assert.equal(run.size, RESTOCK_EDITIONS.length, `repeat starting at month ${start}`);
    }
  });
});

describe("hoursSinceDraft", () => {
  // The arithmetic half of the review window. If this is wrong in the negative
  // direction, the Thursday send fires early and the STOP link Bill was shown
  // becomes decorative — the exact failure auto-send already caused once, when
  // a "preview" and the live broadcast went out in the same run.
  const DRAFT = "2026-10-04"; // the cron writes it at 14:00 UTC

  test("is zero at the moment the draft cron fires", () => {
    assert.equal(hoursSinceDraft(DRAFT, new Date("2026-10-04T14:00:00Z")), 0);
  });

  test("is negative before the draft, so an early send can never pass the gate", () => {
    // A Thursday that falls before the month's first Sunday recomputes to a
    // label in the future. That must read as "not yet", not as a large elapsed
    // time — otherwise the first Thursday of a month could mail an offer that
    // was never drafted or reviewed.
    assert.ok(hoursSinceDraft(DRAFT, new Date("2026-10-01T13:00:00Z")) < 0);
  });

  test("holds through the whole 48-hour window and releases after it", () => {
    assert.ok(hoursSinceDraft(DRAFT, new Date("2026-10-06T13:59:00Z")) < 48);
    assert.ok(hoursSinceDraft(DRAFT, new Date("2026-10-06T14:01:00Z")) >= 48);
  });

  test("the scheduled Thursday is comfortably past the window", () => {
    // Sunday 14:00 UTC to Thursday 13:00 UTC is 95 hours. If the two cron
    // schedules are ever moved closer together, this is what fails.
    const elapsed = hoursSinceDraft(DRAFT, new Date("2026-10-08T13:00:00Z"));
    assert.equal(elapsed, 95);
    assert.ok(elapsed >= 48);
  });
});

describe("firstSundayLabel", () => {
  // The entire schedule reduces to this function: the draft writes the label it
  // returns and the send reads it. The newsletter's equivalent was wrong for
  // months, skipped a send to 2,628 people, and reported itself healthy.
  test("returns the first Sunday of the month", () => {
    // 2026-10-01 is a Thursday, so the first Sunday is the 4th.
    assert.equal(firstSundayLabel(new Date("2026-10-20T00:00:00Z")), "2026-10-04");
    // 2026-11-01 is a Sunday — the 1st itself, not the 8th.
    assert.equal(firstSundayLabel(new Date("2026-11-25T00:00:00Z")), "2026-11-01");
    // 2026-09-01 is a Tuesday, so the first Sunday is the 6th.
    assert.equal(firstSundayLabel(new Date("2026-09-11T00:00:00Z")), "2026-09-06");
  });

  test("is stable for every day inside the same month", () => {
    for (let d = 1; d <= 31; d++) {
      assert.equal(
        firstSundayLabel(new Date(Date.UTC(2026, 9, d))),
        "2026-10-04",
        `day ${d} disagreed`,
      );
    }
  });

  test("always lands on a Sunday inside the first seven days", () => {
    for (let m = 0; m < 36; m++) {
      const label = firstSundayLabel(new Date(Date.UTC(2026, m, 15)));
      const day = new Date(`${label}T00:00:00Z`);
      assert.equal(day.getUTCDay(), 0, `${label} is not a Sunday`);
      assert.ok(day.getUTCDate() <= 7, `${label} is not in the first week`);
      assert.equal(day.getUTCMonth(), m % 12, `${label} fell outside its month`);
    }
  });
});
