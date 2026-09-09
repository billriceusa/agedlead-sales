/**
 * Operator guides — the long-form "how to actually work them" tier.
 *
 * WHY THIS IS A TYPED RECORD AND NOT SANITY (2026-09-09)
 *
 * `/guides/[slug]` is Sanity-backed today, and its schema (`sanity/schemaTypes/guide.ts`)
 * defines `body` as `[block, image]` only — no table, no codeBlock, no callout, no step
 * type. A six-step email sequence authored there would degrade into h3-plus-blockquote
 * prose with no guaranteed shape across thirteen verticals, and the template emits
 * breadcrumb JSON-LD only, with no glossary linking at all.
 *
 * These guides need structure that survives being authored repeatedly: a sequence where
 * every step has a day, a subject, a body and a rationale; a tool table where every row
 * has a stated limit; a compliance boundary that renders identically everywhere. That is
 * a type, not a rich-text field.
 *
 * The pattern being followed is `data/flagship-verticals.ts` + `app/(site)/playbook/
 * [vertical]/page.tsx` — a typed record keyed by slug, rendered by one dynamic route.
 * It already proves out at three verticals; this needs the same at thirteen or fourteen.
 * The Sanity path stays live for one-off editorial guides via a fallback in the route.
 *
 * DOCTRINE. Every guide in this tier obeys Mode A (Bill, 2026-09-09): against aged leads
 * you manually dial and you email. You do not text and you do not autodial on consent
 * inherited from a publisher. `emailSequence` has no channel field for exactly that
 * reason — see components/email-sequence.tsx.
 */

export interface GuideSection {
  heading: string;
  /** Paragraph breaks are "\n\n", matching data/flagship-verticals.ts `deepDive`. */
  body: string;
}

export interface ConsentPlay {
  number: number;
  name: string;
  body: string;
  /** The exact language an operator can lift. Optional — not every play has a script. */
  script?: string;
}

export interface GuideEmailStep {
  day: number;
  subject: string;
  body: string;
  whyItWorks: string[];
  isConsentAsk?: boolean;
}

export interface GuideTool {
  name: string;
  category: string;
  why: string;
  limit: string;
  href?: string;
  pricing?: string;
}

export interface GuideData {
  slug: string;
  /** Which lead type this guide serves. Omitted for cross-cutting guides like the ladder. */
  leadTypeSlug?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** One-paragraph direct answer. Rendered first, and written for answer-engine citation. */
  summary: string;
  estimatedMinutes: number;
  updatedAt: string;
  sections: GuideSection[];
  plays?: ConsentPlay[];
  emailSequence?: GuideEmailStep[];
  sequenceIntro?: string;
  tools?: GuideTool[];
  toolsIntro?: string;
  compliance: {
    heading: string;
    body: string;
    rules?: string[];
    tone?: "stop" | "note";
    /** Null on the ladder guide itself — it IS the doctrine, so it must not link to itself. */
    learnMoreHref?: string | null;
  };
  faqs: { question: string; answer: string }[];
  /** Ungated markdown build specs. AI guide only. */
  buildSpecs?: { label: string; description: string; href: string }[];
  related?: { label: string; href: string }[];
}

// ---------------------------------------------------------------------------

const FRESH_CONSENT_LADDER: GuideData = {
  slug: "fresh-consent-ladder",
  title: "The Fresh-Consent Ladder",
  metaTitle: "The Fresh-Consent Ladder: Turning Inherited Consent Into Your Own",
  metaDescription:
    "Aged leads come with consent that names the publisher, not you. Six plays for earning fresh, documented consent directly from each prospect — and what you may do before you have it.",
  summary:
    "The consent attached to an aged lead was given to whoever originally captured it, usually months ago, and it names that publisher rather than your company. That is inherited consent, and it is the weakest ground you can stand on. The Fresh-Consent Ladder is the alternative: use manual dialing and plain email to re-open the conversation, then capture consent directly from the prospect at every point where they engage. Everything after that runs on permission you own, recorded with a timestamp, and it gets stronger over time instead of more doubtful.",
  estimatedMinutes: 12,
  updatedAt: "2026-09-09",
  sections: [
    {
      heading: "What you actually bought",
      body:
        "When you buy an aged lead you are buying a record: a name, a phone number, an email address, and a claim that at some point this person filled in a form and agreed to be contacted. That agreement is real. It is also not yours.\n\nThe consent language on almost every lead form names the site that captured it, and frequently a list of marketing partners defined so broadly that it means very little. It was given weeks or months ago, about a question the person may no longer have. Courts and regulators have grown steadily less impressed by it.\n\nThis is not an argument for leaving aged leads alone. It is an argument for being precise about what you are standing on when you make the first touch, and for replacing it as quickly as you can.",
    },
    {
      heading: "The three modes",
      body:
        "Before any tactic, decide which mode you operate in. This framing is the same one used throughout the Aged Lead Operator's System, and the whole site follows it.\n\n**Mode A — Conservative.** Manual dialing only. SMS only to leads where you have captured fresh consent directly from the prospect, not inherited from a publisher. No predictive or parallel dialing, no ringless voicemail. Every touch logged with a consent record. The legal floor. Slower velocity, lowest exposure. Most small shops should start here.\n\n**Mode B — Operator Standard.** Manual or preview dialing, meaning one at a time and agent-initiated. SMS only to leads with clear documented consent that permits SMS from your company. Rigorous DNC scrub, documented opt-out honoring, 10DLC registration. Quarterly compliance audit. What most compliant growth-oriented operators run.\n\n**Mode C — Not Recommended.** Predictive or parallel dialing to cell phones, ringless voicemail at scale, SMS to aged lists without verified consent, ignoring state mini-TCPA frequency caps. High plaintiff's-firm exposure and regulatory risk. This site does not teach these tactics.\n\nStart in Mode A. Use manual dial and plain email to re-contact aged leads, use the plays below to earn fresh consent from each prospect, and graduate those specific prospects to Mode B cleanly.",
    },
    {
      heading: "Why the ladder beats the shortcut",
      body:
        "The shortcut is to treat the inherited consent as sufficient, load the list into an automation platform and start texting. It is faster for about six weeks.\n\nThe ladder is slower to start and compounds. Every prospect who opts in directly becomes an asset you can contact confidently for years, across channels, without rechecking anyone else's paperwork. A list built this way appreciates. A list worked the other way is a liability that grows with its size.\n\nThere is also a practical argument that has nothing to do with law. A prospect who has just told you they want to hear from you answers the phone. One who has forgotten filling in a form eight months ago does not.",
    },
  ],
  plays: [
    {
      number: 1,
      name: "The callback-page opt-in",
      body:
        "Every voicemail and email in your cadence sends the prospect to a dedicated landing page on your own domain, not the publisher's. The page restates the conversation and offers something worth the click. It carries a short form — name, phone, email — and an explicit checkbox. Submission logs timestamp, IP address and the exact consent language shown.\n\nOnce they submit, that prospect is on your own consent record. Everything after that runs on permission you captured.",
      script:
        "Yes — please call, text, or email me about my [vertical] question. I understand this consent is given to [Your Company Name].",
    },
    {
      number: 2,
      name: "The text-to-join keyword",
      body:
        "Build a dedicated inbound keyword and mention it in every voicemail, every email footer and every page. The prospect texts you first, which inverts the consent problem entirely. Your automatic reply carries the disclosure and asks them to confirm.\n\nWhen they reply YES you have fresh, prospect-initiated SMS consent — the strongest kind, because they started the conversation.",
      script:
        "Reply YES to continue receiving updates from [Company]. Msg & data rates apply. Reply STOP to cancel.",
    },
    {
      number: 3,
      name: "The qualifying-call consent ask",
      body:
        "At the end of every live call, before you hang up, ask. Document the verbal yes in the call recording if you record, or in a CRM note with date and time. In most jurisdictions this supports follow-up calls and texts from that point on. Some operators follow it with a confirmation text the prospect must reply to, which is belt and braces and cheap.",
      script:
        "Before I let you go — so I can stay in touch as [rates move / your claim progresses / spots open up], can I have your permission to text you? You can reply STOP any time.",
    },
    {
      number: 4,
      name: "The quote or estimate checkbox",
      body:
        "Any time you deliver a quote, an illustration or an estimate, put a checkbox on the delivery email or form. This is the highest-quality consent available to you, because the prospect is already deep in the sale and actively wants the follow-up. It is also the one most operators forget to build.",
      script:
        "Yes — please text me updates about this [quote / policy / project].",
    },
    {
      number: 5,
      name: "The nurture re-engagement button",
      body:
        "Every newsletter or nurture email to your aged list carries a confirmation call to action. Prospects who click affirm ongoing consent. Prospects who never click quietly downgrade to dormant and stop receiving anything but the occasional re-permission attempt.\n\nOver six to twelve months this converts an inherited list into a re-consented one, without a single uncomfortable conversation.",
      script: "Still want updates? [Confirm here]",
    },
    {
      number: 6,
      name: "The incentive opt-in",
      body:
        "Offer something worth opting in for — a market report, a free consultation, a calculator result, a sample estimate. The prospect trades fresh permission for the resource, and unlike the other plays they now have a reason to remember your name when you call. This is the play that scales without a conversation.",
    },
  ],
  compliance: {
    heading: "What you may do before you have fresh consent",
    body:
      "Until a prospect has given you consent directly, you are in Mode A. That is a real, workable place to operate — it is simply narrower than the automation vendors imply.",
    rules: [
      "Manual dialing is fine. Predictive and parallel dialers to cell phones on aged lists are not, without a consent record from each prospect that explicitly covers automated calls.",
      "Plain-text email is fine, and it is the workhorse of the whole approach.",
      "Human voicemail is fine. Ringless voicemail at scale is a Mode C tactic.",
      "Do not text on inherited consent. This is the single most common and most expensive mistake in aged-lead work.",
      "Scrub against the national DNC list and your own suppression file before every batch, not once at import.",
      "Honor an opt-out everywhere, in your own database — not only inside whichever email tool sent the message.",
      "Observe calling windows in the prospect's local time zone, not yours. Several states are stricter than the federal 8am-to-9pm rule.",
    ],
    tone: "stop",
    // Null deliberately: this guide IS the doctrine. Linking it to itself would be a loop.
    learnMoreHref: null,
  },
  faqs: [
    {
      question: "Can I text aged leads if the original form mentioned text messages?",
      answer:
        "Treat that as inherited consent and do not rely on it. The disclosure named the publisher who captured the lead, not your company, and it was agreed to at a moment that may be many months gone. Use manual dial and email to re-open the conversation, then use one of the six plays above to get consent that names you. Once you have it, texting that specific prospect is clean.",
    },
    {
      question: "What is the difference between inherited and fresh consent?",
      answer:
        "Inherited consent is the permission the prospect gave to whoever originally captured the lead, which you acquired along with the record. Fresh consent is permission the prospect gives to your company directly, today, with your name in the disclosure and a timestamp against it. Inherited consent is what you buy. Fresh consent is what you build.",
    },
    {
      question: "How long does it take to re-consent an aged list?",
      answer:
        "Plan in months, not weeks. The nurture re-engagement button and the incentive opt-in do the bulk of the work quietly over six to twelve months, while the callback page and the end-of-call ask convert the prospects who actually engage. There is no version of this that completes in a single campaign, and any tool promising one is describing the shortcut rather than the ladder.",
    },
    {
      question: "Is manual dialing really enough to work an aged list?",
      answer:
        "Yes, and it is how most profitable aged-lead operations run. The constraint is not dial volume, it is contact rate and what happens in the conversation. Operators who lose money on aged leads almost never lose it for lack of automation; they lose it by working the list once, hard, and never building a nurture path for the ninety-odd percent who did not answer.",
    },
    {
      question: "Do I need a lawyer for this?",
      answer:
        "For anything beyond Mode A, yes. TCPA, FCC rules and state mini-TCPA laws change frequently, and consent requirements vary by state and by consent record. The firm Bill Rice uses for TCPA questions is Henson Legal. Everything on this page is operator guidance, not legal advice.",
    },
  ],
  related: [
    { label: "Is it legal to call purchased leads?", href: "/blog/is-it-legal-to-call-purchased-leads" },
    { label: "TCPA compliance for lead buyers", href: "/blog/tcpa-compliance-lead-buyers" },
    { label: "State-by-state lead compliance guide", href: "/blog/state-by-state-lead-compliance-guide" },
    { label: "Re-engage aged leads after 90 days", href: "/blog/re-engage-aged-leads-after-90-days" },
    { label: "The Aged Lead Operator's System", href: "/playbook" },
  ],
};

// ---------------------------------------------------------------------------

export const GUIDES: Record<string, GuideData> = {
  [FRESH_CONSENT_LADDER.slug]: FRESH_CONSENT_LADDER,
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

export function getGuide(slug: string): GuideData | undefined {
  return GUIDES[slug];
}
