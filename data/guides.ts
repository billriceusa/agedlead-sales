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

/**
 * SCOPED DELIBERATELY NARROW.
 *
 * `/blog/tcpa-compliance-lead-buyers` is a 3,642-word pillar that already covers the
 * whole TCPA landscape — the 1:1 rule, the revocation rule, ATDS, SMS, DNC, state
 * mini-TCPAs, vendor due diligence and a checklist. Writing another broad TCPA article
 * would split the site against itself for no gain.
 *
 * This one answers a single definitional question — `prior express written consent`,
 * 150/mo at difficulty 7, with no page on the site targeting it as a primary keyword —
 * and then hands the reader up to that pillar for the wider picture.
 */
const PEWC: GuideData = {
  slug: "prior-express-written-consent",
  title: "Prior Express Written Consent, Explained for Lead Buyers",
  metaTitle: "Prior Express Written Consent (PEWC): What It Is and How to Get It",
  metaDescription:
    "The four things prior express written consent must contain, what a purchased lead record actually carries instead, and how to earn consent that names your company.",
  summary:
    "Prior express written consent is a signed, written agreement in which a consumer agrees that a specific named company may contact them using an automated dialing system or a prerecorded message. It has four required parts: the consumer's signature, the name of the company being permitted, a clear statement that automated calls or texts may be used, and a statement that agreeing is not a condition of buying anything. A purchased lead record almost never carries this for you, because the disclosure the consumer signed named the publisher who captured the lead rather than your business.",
  estimatedMinutes: 8,
  updatedAt: "2026-09-10",
  sections: [
    {
      heading: "The four parts",
      body:
        "Consent that meets this standard is specific in a way that general marketing opt-in language is not. All four of these have to be present:\n\n**A signature.** Electronic counts — a checked box with a timestamp, an e-signature, a recorded verbal agreement. What matters is that it is attributable to the person and recorded.\n\n**The name of the company.** Yours, spelled out. This is the part that most often fails on a purchased record, and it is the part that decides whether the consent is yours or somebody else's.\n\n**A clear statement about automation.** The consumer has to be told they may receive calls or texts made with an automatic dialing system or a prerecorded voice. Burying it is the same as omitting it.\n\n**That agreement is not required to buy.** Consent cannot be a condition of purchase, and the disclosure has to say so.",
    },
    {
      heading: "What a purchased lead actually carries",
      body:
        "When you buy an aged lead you receive a record and a claim that the consumer once agreed to be contacted. That agreement is real. It named the site that captured it, and frequently a list of marketing partners defined broadly enough to mean very little.\n\nThat is inherited consent. It is the weakest ground available to you, it was given at a moment that may be many months old, and it is getting weaker as regulators and courts look harder at it.\n\nThe practical consequence is narrower than most people assume, and workable: manual dialing and plain email are open to you from day one. Automated dialing and texting wait until the prospect has told your company directly.",
    },
    {
      heading: "Where the rules stand in 2026",
      body:
        "Two developments matter for anyone reading older guidance and finding it out of date.\n\n**The one-to-one consent rule.** The FCC rule that would have required separate consent for each individual seller was vacated in January 2025 and formally repealed in August 2025. It is not in force. Plenty of published advice still describes it as though it were, so check the date on anything you read.\n\n**Revocation.** A consumer's request to stop must be honored promptly and across the board. The provision extending a single revocation to all of a sender's messages has been delayed to January 2027.\n\n**State law is the sharper edge.** Florida, Oklahoma, Washington, Maryland and Texas each have their own telephone consumer statutes, several stricter than the federal rule on calling hours and on what counts as consent. Aged lead lists are inherently multi-state, so the strictest applicable rule governs the record in front of you.",
    },
    {
      heading: "Earning consent that names you",
      body:
        "Consent you capture yourself is cleaner than anything you can buy, and it appreciates: a prospect who opts in directly can be contacted confidently for years, across channels, without rechecking anyone else's paperwork.\n\nThe route is the same one the whole site is built around. Use manual dial and plain email to re-open the conversation, and ask for permission at every point where the prospect engages — on a callback page, at the end of a live call, on a quote delivery, in a nurture email. Six specific plays are set out in the Fresh-Consent Ladder.",
    },
  ],
  compliance: {
    heading: "What you can do while consent is still inherited",
    body:
      "This is a workable operating position, not a holding pattern. Most profitable aged-lead operations run here permanently.",
    rules: [
      "Manual dialing is open to you. Predictive and parallel dialers to cell phones are the ones that need consent covering automated calls.",
      "Plain-text email is open to you, and it does most of the work of re-opening a conversation.",
      "Human voicemail is fine. Ringless voicemail at scale is not.",
      "Wait on texting until the prospect has given your company permission directly.",
      "Scrub the national Do Not Call registry and your own suppression list before every batch.",
      "Check the Reassigned Number Database before a calling campaign. Numbers change hands while a record ages, and doing the check provides a safe harbor.",
      "Observe calling windows in the prospect's local time zone, not yours.",
    ],
    tone: "stop",
  },
  faqs: [
    {
      question: "Does the opt-in on a lead form count as prior express written consent for me?",
      answer:
        "Almost never. The disclosure the consumer agreed to named the publisher that captured the lead, and often a broadly defined set of marketing partners. For the consent to be yours it has to name your company specifically. Treat what arrives with a purchased record as inherited consent, use manual dial and email to re-open the conversation, and capture your own permission from there.",
    },
    {
      question: "Is prior express written consent the same as prior express consent?",
      answer:
        "No, and the difference decides what you may do. Prior express consent is a lower bar and can cover non-marketing calls. Prior express written consent is the higher standard that applies to telemarketing calls and texts made with an automatic dialing system or a prerecorded voice, and it requires the signature, the named company, the automation disclosure and the statement that consent is not a condition of purchase.",
    },
    {
      question: "Do I need prior express written consent to send a plain email?",
      answer:
        "No. This standard governs automated calls and texts to phone numbers. Email is regulated separately, principally by CAN-SPAM, which requires accurate headers, a physical postal address and a working unsubscribe that you honor promptly. This is exactly why email carries so much of the load in aged-lead work.",
    },
    {
      question: "Is the FCC one-to-one consent rule still in effect?",
      answer:
        "It is not. The rule that would have required separate consent for each individual seller was vacated in January 2025 and formally repealed in August 2025. A great deal of published guidance still describes it as current, so check the date on anything you read about it before acting on it.",
    },
    {
      question: "How long does prior express written consent last?",
      answer:
        "There is no federal expiry date, but a consent record does get weaker as it ages, both as evidence and as a reflection of what the consumer actually wants. Revocation is immediate whenever the consumer asks. In practice, treat old consent as a reason to re-earn permission rather than as something that holds indefinitely.",
    },
  ],
  related: [
    { label: "The Fresh-Consent Ladder — six plays for earning your own permission", href: "/guides/fresh-consent-ladder" },
    { label: "TCPA compliance for lead buyers — the full landscape", href: "/blog/tcpa-compliance-lead-buyers" },
    { label: "Is it legal to call purchased leads?", href: "/blog/is-it-legal-to-call-purchased-leads" },
    { label: "State-by-state lead compliance guide", href: "/blog/state-by-state-lead-compliance-guide" },
  ],
};

/**
 * COMPLEMENTS `/blog/re-engage-aged-leads-after-90-days` RATHER THAN REPEATING IT.
 *
 * That post (2,678 words) covers the mechanics of recycling: the fresh-start script,
 * seasonal triggers, CRM pipeline stages, expected contact rates, when to retire a lead.
 * It does not mention consent once. This one is the permission half — the same warm-up,
 * written so that the list you end up with is one you own.
 */
const WARM_UP: GuideData = {
  slug: "warm-up-aged-lead-list",
  title: "How to Warm Up an Aged Lead List and Earn Permission That's Yours",
  metaTitle: "How to Warm Up an Aged Lead List and Earn Your Own Consent",
  metaDescription:
    "A five-email arc that re-opens the conversation with an aged list, asks for permission that names your company, and leaves you with a re-consented list you own.",
  summary:
    "Warming up an aged list is a sequence, not a send. Clean the file and check it against your suppression list and the Reassigned Number Database first. Then re-open the conversation with plain-text email that assumes nothing, ask for permission once the reader has engaged rather than in the first message, and retire the non-responders quietly instead of mailing them harder. Done over a few weeks, this converts a list you bought into a list you own — and the people who confirm are the ones worth calling.",
  estimatedMinutes: 11,
  updatedAt: "2026-09-10",
  sections: [
    {
      heading: "Before the first send",
      body:
        "Three passes over the file, in this order. Each one removes people who would cost you more than they could return.\n\n**Your own suppression list.** Prior opt-outs, complaints, current customers, anyone excluded by policy. This is separate from the national Do Not Call registry and it is yours to maintain. Scrub every batch, not once at import.\n\n**The Reassigned Number Database, if you plan to call.** Numbers change hands over the months a record sits, and a reassigned number reaches a stranger who never consented. Checking first provides a safe harbor and takes minutes.\n\n**Obvious dead weight.** Malformed addresses, duplicates across vendors, records with no usable contact method. A smaller file that reaches people beats a larger one that bounces, because bounce rate is what mailbox providers use to decide whether your future mail arrives at all.",
    },
    {
      heading: "Why the first email does not ask for anything",
      body:
        "The instinct is to open with the offer, because that is what you want. It reliably underperforms on an aged list.\n\nThe reader does not remember you. They filled in a form months ago, possibly on a site whose name they never registered, and the mailbox they used has since absorbed a lot of mail. An email that opens by asking for a decision is asking someone with no context to spend attention they have no reason to spend.\n\nSo the first message earns the right to send the second. It is short, it is plain text, it is useful on its own, and it makes replying easy. Everything after it is easier because of it.",
    },
    {
      heading: "Pacing, and why it decides whether this works",
      body:
        "Send the whole list at once and two things happen. Mailbox providers see an unfamiliar sender producing a volume spike and start deferring, which shows up as soft bounces. And any problem in your copy or your data hits every contact before you can see it.\n\nSpread the first pass across days rather than hours. Watch the bounce rate: under 3% of attempted is healthy, and above that mailbox providers begin throttling. Hard bounces matter more than soft ones — a soft bounce is a mailbox deferring, a hard bounce is an address that does not exist and should be suppressed immediately.\n\nIf you are sending from a domain that is new or has been quiet, start smaller than feels necessary and increase over a couple of weeks. Reputation is easy to build slowly and slow to repair.",
    },
    {
      heading: "What to do with the people who never respond",
      body:
        "Most of the list will not reply, and that is the expected result rather than a failure. What you do next is what separates an appreciating list from a decaying one.\n\nRetire them from active sending and move them to a low-frequency track — a monthly or quarterly newsletter with a standing confirmation link. Someone who never opens anything over several months has told you something, and continuing to mail them harms the deliverability of everything you send to everyone else.\n\nThis is the quiet part of the permission pass. The list gets smaller and the mail gets better.",
    },
  ],
  sequenceIntro:
    "Five emails over about three weeks. The permission ask sits at day 9, after two messages have already earned attention — asking in the first email converts worse and costs you the contact.",
  emailSequence: [
    {
      day: 0,
      subject: "the thing most people get wrong about aged leads",
      body:
        "Hi {{first_name}} — a while back you looked into {{vertical}}. I have no idea whether that is still live for you, and this is not a pitch either way.\n\nOne thing worth knowing if it is: the people who do well with this rarely have a better list than everyone else. They have a better second and third contact. Most of the value in any list sits behind the first attempt, and most people stop there.\n\nIf that is useful, I write about it. If not, the unsubscribe link below works immediately and I will not be offended.",
      whyItWorks: [
        "Names the gap in memory instead of pretending a relationship exists",
        "Gives something usable in the email itself, so opening it was worth it",
        "Offers the exit early, which raises trust and lowers complaints",
        "Plain text, one idea, no images — it reads like a person wrote it",
      ],
    },
    {
      day: 4,
      subject: "the second and third contact",
      body:
        "Hi {{first_name}} — following on from last week.\n\nHere is the pattern, concretely. Attempt one reaches the people who were already ready. Attempts two through five reach the much larger group who were busy, distracted, or not in the right week. The gap between operations that work and operations that do not is almost entirely in that second group.\n\nWhat that looks like in practice: a short call, a voicemail that gives a reason to call back, and an email that assumes nothing. Spread over two weeks, not two days.\n\nThat is the whole method. It is unglamorous and it is why it works.",
      whyItWorks: [
        "Pays off the specific promise made in the first email",
        "Teaches something the reader can use whether or not they ever buy from you",
        "Builds the case for follow-up without asking for anything yet",
      ],
    },
    {
      day: 9,
      subject: "worth keeping in touch?",
      body:
        "Hi {{first_name}} — short one.\n\nI have been sending these because you looked into {{vertical}} at some point. That is a thin reason to keep showing up in your inbox, so I would rather ask.\n\nIf this is useful, confirm here and I will keep sending: {{confirm_link}}\n\nIf you confirm, I can also reach out directly when something genuinely relevant comes up, rather than only by email.\n\nIf you would rather not, do nothing at all. I will stop.",
      whyItWorks: [
        "Asks only after two messages have earned attention, which is why it converts",
        "Confirming is one click and the alternative is genuinely doing nothing",
        "Captures permission that names your company, with a timestamp — the whole point of the sequence",
        "States plainly what confirming allows, so the consent is informed",
      ],
      isConsentAsk: true,
    },
    {
      day: 14,
      subject: "one number worth checking",
      body:
        "Hi {{first_name}} — for anyone still working {{vertical}}, this is the number I would look at first.\n\nWork out what you can afford to pay for a contact: your average deal value, times your close rate, times the share of that you are willing to spend to acquire it. Most people have never calculated it, and it changes what they buy.\n\nThe calculators on the site will do it in about two minutes if you would rather not do the arithmetic.",
      whyItWorks: [
        "Returns to being useful immediately after the ask, so the sequence does not read as a funnel",
        "Sends engaged readers to a tool, which is a low-commitment next step",
        "Works for people who confirmed and people who did not",
      ],
    },
    {
      day: 21,
      subject: "last one from this sequence",
      body:
        "Hi {{first_name}} — this is the last of these.\n\nIf you confirmed, you will hear from me when there is something worth your time, and not otherwise.\n\nIf you did not, this is where I stop and let you get on with your week. You are welcome back any time.\n\nEither way, the short version of everything above: the money is in the second contact, and almost nobody makes it.",
      whyItWorks: [
        "Ending on schedule is what makes the next sequence welcome",
        "Restates the single most useful idea so the last email still gives something",
        "Closes the loop cleanly for non-responders instead of trailing off",
      ],
    },
  ],
  toolsIntro:
    "Any of these will run the sequence above. The differences that matter are what happens to your consent record and your suppression list, not the template editor.",
  tools: [
    {
      name: "Resend",
      category: "Transactional and sequence sending",
      why: "Developer-first, clean deliverability defaults, and per-message webhooks that let you keep delivery, bounce and complaint data in your own database rather than only in a vendor dashboard.",
      limit: "There is no drag-and-drop journey builder. You are writing code or wiring it to something that does.",
      href: "https://resend.com",
    },
    {
      name: "Mailshake",
      category: "Sequenced outreach",
      why: "Built for exactly this shape of work — multi-step email with reply detection, so a prospect who answers drops out of the sequence automatically instead of receiving the next scheduled message.",
      limit: "Oriented toward one-to-one sales outreach rather than large recurring broadcasts, and it is not where you would run an ongoing newsletter.",
      href: "https://mailshake.com",
    },
    {
      name: "GoHighLevel",
      category: "All-in-one CRM and marketing",
      why: "Keeps the pipeline, the calling, the calendar and the email in one place, which suits a small operation that does not want to integrate four tools.",
      limit: "Broad rather than deep, and the breadth invites automation you may not have consent for. Turn the SMS features off until permission is yours.",
      href: "https://gohighlevel.com",
    },
  ],
  compliance: {
    heading: "The rules that shape this sequence",
    body:
      "Everything above is email and manual dial, which is what you may do while consent is still inherited. That constraint is why the sequence is shaped the way it is.",
    rules: [
      "Every email needs a working unsubscribe, an accurate from line and a physical postal address. Honor an opt-out in your own database, not only inside the sending tool.",
      "Do not add texting to this sequence until the prospect has confirmed. That confirmation is what the day 9 email exists to capture.",
      "Log what the person agreed to, when, and from what address — consent you cannot evidence is consent you do not have.",
      "Suppress a hard bounce immediately. Every further send to a dead mailbox costs you deliverability for everyone else.",
      "If you pair this with calling, check the Reassigned Number Database first and observe calling windows in the prospect's local time zone.",
    ],
    tone: "note",
  },
  faqs: [
    {
      question: "How long should warming up an aged list take?",
      answer:
        "Plan three weeks for the sequence itself and several months for the list as a whole. The five emails above do the concentrated work, and the standing confirmation link in your ongoing newsletter keeps converting quietly long after. Anything promising a re-consented list in a single campaign is describing a blast rather than a warm-up.",
    },
    {
      question: "Should the first email ask people to confirm?",
      answer:
        "No, and this is the most common mistake. A reader who does not remember you has no reason to grant anything in the first message, so an early ask converts poorly and burns the contact. Two useful emails first, then the ask at around day nine, when opening your mail has already been worth their time.",
    },
    {
      question: "What bounce rate should worry me?",
      answer:
        "Above three percent of attempted sends is where mailbox providers begin throttling. Distinguish the two kinds: soft bounces are mailboxes deferring and often resolve on their own, while hard bounces are addresses that do not exist and should be suppressed the moment they appear. A rising hard-bounce rate is the signal that matters.",
    },
    {
      question: "What do I do with people who never open anything?",
      answer:
        "Retire them from active sending and move them to a low-frequency track carrying a standing confirmation link. Continuing to mail people who never engage lowers the deliverability of everything you send to everyone else, so the unresponsive part of a list is not free to keep. Smaller and reaching inboxes beats larger and filtered.",
    },
    {
      question: "Can I run this sequence from a brand-new sending domain?",
      answer:
        "You can, but start smaller than feels necessary and build over a couple of weeks. A new or long-quiet domain has no reputation, and a sudden volume spike from an unfamiliar sender is exactly the pattern that triggers deferrals. Reputation is straightforward to build slowly and slow to repair once damaged.",
    },
  ],
  related: [
    { label: "The Fresh-Consent Ladder — six plays for earning permission", href: "/guides/fresh-consent-ladder" },
    { label: "Prior express written consent, explained", href: "/guides/prior-express-written-consent" },
    { label: "Re-engaging aged leads after 90 days — the recycling mechanics", href: "/blog/re-engage-aged-leads-after-90-days" },
    { label: "Email outreach templates for aged leads", href: "/blog/email-outreach-aged-leads-templates" },
    { label: "Know Your CPL calculator", href: "/calculators/know-your-cpl" },
  ],
};

export const GUIDES: Record<string, GuideData> = {
  [FRESH_CONSENT_LADDER.slug]: FRESH_CONSENT_LADDER,
  [PEWC.slug]: PEWC,
  [WARM_UP.slug]: WARM_UP,
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

export function getGuide(slug: string): GuideData | undefined {
  return GUIDES[slug];
}
