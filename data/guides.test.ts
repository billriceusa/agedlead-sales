import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { GUIDES, GUIDE_SLUGS, getGuide } from "./guides";

/**
 * These enforce the editorial standard, not just the type.
 *
 * Thirteen more guides get authored against this shape, most of them in one sitting.
 * TypeScript will catch a missing field; it will not catch a tool recommendation with no
 * stated downside, a sequence that never asks for consent, or a guide that quietly drops
 * the compliance boundary. Those are the things that make this tier trustworthy, so they
 * are asserted rather than trusted to the author's memory.
 */
describe("guide data invariants", () => {
  test("there is at least one guide and every slug resolves", () => {
    assert.ok(GUIDE_SLUGS.length > 0);
    for (const slug of GUIDE_SLUGS) {
      assert.ok(getGuide(slug), `${slug} does not resolve`);
      assert.equal(GUIDES[slug].slug, slug, `${slug} key does not match its own slug field`);
    }
  });

  test("every guide carries a compliance boundary", () => {
    // The doctrine has to travel with the tactic. A guide without this box is a guide
    // that teaches outreach with the boundary one click away, which is what the site
    // was doing wrong before 2026-09-09.
    for (const slug of GUIDE_SLUGS) {
      const g = GUIDES[slug];
      assert.ok(g.compliance?.heading, `${slug} has no compliance heading`);
      assert.ok(g.compliance?.body, `${slug} has no compliance body`);
    }
  });

  test("every tool recommendation states where it stops", () => {
    // A recommendation with no downside reads as an ad. This site's asset is that its
    // reviews are independent; tooling gets the same standard.
    for (const slug of GUIDE_SLUGS) {
      for (const tool of GUIDES[slug].tools ?? []) {
        assert.ok(tool.limit?.trim(), `${slug}: tool "${tool.name}" has no stated limit`);
        assert.ok(tool.why?.trim(), `${slug}: tool "${tool.name}" has no stated use`);
      }
    }
  });

  test("any email sequence asks for consent exactly once", () => {
    // The permission ask is the hinge of the whole approach. A sequence with none is
    // just outreach; a sequence with two is confusing about which one counts.
    for (const slug of GUIDE_SLUGS) {
      const seq = GUIDES[slug].emailSequence;
      if (!seq || seq.length === 0) continue;
      const asks = seq.filter((s) => s.isConsentAsk).length;
      assert.equal(asks, 1, `${slug}: expected exactly 1 consent ask, found ${asks}`);
    }
  });

  test("email sequences run in order and never land two on the same day", () => {
    for (const slug of GUIDE_SLUGS) {
      const seq = GUIDES[slug].emailSequence;
      if (!seq || seq.length < 2) continue;
      for (let i = 1; i < seq.length; i++) {
        assert.ok(
          seq[i].day > seq[i - 1].day,
          `${slug}: step ${i + 1} (day ${seq[i].day}) does not follow step ${i} (day ${seq[i - 1].day})`,
        );
      }
    }
  });

  test("every step and play teaches, not just prescribes", () => {
    for (const slug of GUIDE_SLUGS) {
      for (const step of GUIDES[slug].emailSequence ?? []) {
        assert.ok(
          step.whyItWorks.length > 0,
          `${slug}: day ${step.day} email has no "why it works"`,
        );
        assert.ok(step.subject?.trim(), `${slug}: day ${step.day} email has no subject`);
      }
      for (const play of GUIDES[slug].plays ?? []) {
        assert.ok(play.body?.trim(), `${slug}: play ${play.number} has no body`);
      }
    }
  });

  test("plays are numbered from 1 with no gaps", () => {
    for (const slug of GUIDE_SLUGS) {
      const plays = GUIDES[slug].plays;
      if (!plays || plays.length === 0) continue;
      const numbers = plays.map((p) => p.number);
      assert.deepEqual(
        numbers,
        Array.from({ length: plays.length }, (_, i) => i + 1),
        `${slug}: play numbering is not 1..n in order`,
      );
    }
  });

  test("no guide states a per-lead price", () => {
    // Standing rule across this repo: never state a per-lead price and never imply one.
    // `scanForPriceClaims` enforces it on the newsletter path; this is the same rule for
    // the guide tier, where a stray "$0.30/lead" would be just as wrong.
    const perLead = /\$\s?\d+(\.\d+)?\s*(per|\/)\s*(lead|record)/i;
    for (const slug of GUIDE_SLUGS) {
      const g = GUIDES[slug];
      const prose = [
        g.summary,
        ...g.sections.map((s) => s.body),
        ...(g.plays ?? []).map((p) => p.body),
        ...(g.emailSequence ?? []).map((s) => s.body),
        ...g.faqs.map((f) => f.answer),
        g.compliance.body,
      ].join("\n");
      assert.equal(perLead.test(prose), false, `${slug} states a per-lead price`);
    }
  });

  test("FAQ answers are substantial enough to be worth marking up", () => {
    // These emit FAQPage structured data. A one-line answer marked up as an FAQ is
    // thin-content bait rather than something a reader or an answer engine benefits from.
    for (const slug of GUIDE_SLUGS) {
      for (const faq of GUIDES[slug].faqs) {
        assert.ok(faq.question.trim().endsWith("?"), `${slug}: "${faq.question}" is not a question`);
        assert.ok(
          faq.answer.trim().length >= 120,
          `${slug}: answer to "${faq.question}" is too thin for FAQ markup`,
        );
      }
    }
  });

  test("the ladder guide does not link to itself", () => {
    // It IS the doctrine, so a "read the doctrine" link would be a loop.
    const ladder = getGuide("fresh-consent-ladder");
    assert.ok(ladder);
    assert.equal(ladder!.compliance.learnMoreHref, null);
  });
});
