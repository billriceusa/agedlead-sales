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

/**
 * THE THREE PILOT LEAD-TYPE GUIDES — final expense, life, auto.
 *
 * WHY THESE THREE (measured 2026-09-09): the partner stocks all of them, difficulty is
 * 1, 4 and 3 respectively, and the site already ranks 13-31 for each. The SERP for this
 * family is full of DR 2 and DR 3 winners, so ranking is an on-page question rather than
 * an authority one.
 *
 * WHY THEY DO NOT REPEAT `/lead-types/*`. That family is BUYER intent and monetises
 * through the affiliate door; `data/flagship-verticals.ts` records the deliberate split
 * between buyer intent and operator "build-a-system" intent. The lead-type pages already
 * carry the strategy for each vertical — the senior-market patience for final expense,
 * email-first for life, the renewal clock for auto. What none of them carries is the
 * actual copy an operator sends. That is what these are.
 *
 * Each links back to its lead-type page for the buying decision, and forward to the
 * warm-up guide for the full tooling comparison rather than triplicating it.
 */

/** Tool rows shared where the vertical genuinely does not change the answer. */
const SEQUENCE_TOOLS_NOTE =
  "Two that matter for this vertical specifically. The fuller comparison, including how each one handles your consent record, is in the warm-up guide.";

const FINAL_EXPENSE: GuideData = {
  slug: "working-aged-final-expense-leads",
  leadTypeSlug: "final-expense-leads",
  title: "Working Aged Final Expense Leads",
  metaTitle: "How to Work Aged Final Expense Leads: Sequence and Scripts",
  metaDescription:
    "Who these prospects are, what they are actually worried about months after enquiring, and a four-email sequence written for the senior market.",
  summary:
    "An aged final expense lead is usually someone over sixty who looked into burial or funeral cover because a specific event made them think about it — a friend's funeral, a health scare, a conversation with an adult child. Months later the worry is still there, but they have often been called hard by several agents and have learned to avoid the phone. Email works here precisely because it is quiet: it lets them read at their own pace, show it to a spouse or a daughter, and come back when they are ready. Patience converts this vertical. Urgency does not.",
  estimatedMinutes: 10,
  updatedAt: "2026-09-10",
  sections: [
    {
      heading: "Who you are actually writing to",
      body:
        "Most people who fill in a final expense form are between sixty and eighty, on a fixed or nearly fixed income, and they are not shopping for a financial product. They are trying to solve one specific worry: that someone they love will be handed a bill after they die.\n\nThat distinction changes everything about the copy. They are not comparing internal rates of return. They want to know that the amount is small enough to afford every month, that it will not be taken away, and that the person handling their affairs will not have to find money quickly at the worst possible time.\n\nA good number of them have also had a bad experience since they enquired. The final expense category is worked hard by phone, and a prospect who filled in a form six months ago may have taken a dozen calls in the first week. They did not stop being interested. They stopped answering.",
    },
    {
      heading: "What happened while the record aged",
      body:
        "Three things, and each one shapes what you send.\n\n**The trigger has faded but not gone.** The funeral that prompted the search is months back. The underlying worry — leaving a bill behind — is unchanged, because it is structural rather than situational.\n\n**They may have bought something already.** Some will have taken a small policy from a mail piece or a television offer. That is not a dead end. Those policies are frequently small enough that a conversation about whether it actually covers a funeral is welcome.\n\n**They have been trained to avoid the phone.** This is the single most useful thing to understand about the vertical. Your email is not competing with other emails. It is competing with the memory of being called at dinner time.",
    },
    {
      heading: "What they are looking for now",
      body:
        "Reassurance, in this order: that the monthly amount is genuinely affordable, that acceptance does not depend on a medical exam they will fail, that the payout goes to the person they name without a delay, and that nobody will pressure them.\n\nWrite to those four and you are writing to the actual question. Write about coverage tiers and riders and you are answering a question they did not ask.\n\nOne practical note on language. Say what the thing does — covers a funeral, pays for the burial, leaves money for the costs — rather than the category name. Plenty of prospects do not know that final expense insurance is what they searched for.",
    },
  ],
  sequenceIntro:
    "Four emails over about two weeks, deliberately unhurried. The permission ask sits at day 8, and the whole sequence is written to be readable by someone who wants to show it to a family member before deciding anything.",
  emailSequence: [
    {
      day: 0,
      subject: "the question most people actually have",
      body:
        "Hi {{first_name}} — a while ago you looked into cover for funeral costs. I do not know whether that got sorted, and this is not a sales call.\n\nThe question almost everyone has, and almost nobody asks out loud, is this: what would my family actually have to pay if it happened next month, and would they have it?\n\nA funeral typically has to be paid for before the estate settles, which is what catches people out. That is the whole reason this kind of cover exists.\n\nIf you have that handled, ignore this. If you do not, I will send a couple more notes explaining how it works, and you can decide in your own time.",
      whyItWorks: [
        "Opens on the worry rather than the product, which is what they were actually searching",
        "Names the timing problem — funerals are paid before estates settle — which most prospects have not been told",
        "Explicitly removes pressure, which is what this audience has learned to expect",
        "No phone call requested, so it does not trigger the avoidance they have built up",
      ],
    },
    {
      day: 5,
      subject: "what it costs and what it does not require",
      body:
        "Hi {{first_name}} — following up on the note about funeral costs.\n\nTwo things people are usually surprised by.\n\nThe monthly amount is smaller than expected, because the cover itself is small. This is not a big life insurance policy. It is a modest amount aimed at one specific bill.\n\nAnd most of these policies do not require a medical exam. A few health questions, usually, and that is it. People who assume they will be turned down because of their health are often wrong about that.\n\nWhat it will not do: pay out instantly if the policy is brand new. Most have a waiting period in the first couple of years. Anyone who tells you otherwise is worth being careful with.",
      whyItWorks: [
        "Answers the two objections this audience holds before they have to voice them",
        "Naming the waiting period builds trust precisely because it is the inconvenient part",
        "Warns them about high-pressure sellers, which positions you as the calm option",
        "Still no ask, so the third email has somewhere to go",
      ],
    },
    {
      day: 8,
      subject: "shall I keep sending these?",
      body:
        "Hi {{first_name}} — a short one.\n\nI have been writing because you looked into funeral cover at some point. That is a thin reason to keep appearing in your inbox, so I would rather ask than assume.\n\nIf these are useful, confirm here and I will keep them coming: {{confirm_link}}\n\nConfirming also means I can call if you would rather talk it through than read about it. Plenty of people find it easier that way, particularly if a spouse or a son or daughter wants to be on the call too.\n\nIf you would rather not, do nothing and I will stop.",
      whyItWorks: [
        "Asks after two emails have already been useful, which is why it earns a yes",
        "Offers the call as a benefit the prospect controls rather than as a next step you want",
        "Naming the family member reflects how this decision actually gets made",
        "Doing nothing is a valid answer, which lowers the cost of confirming",
      ],
      isConsentAsk: true,
    },
    {
      day: 14,
      subject: "the one thing worth checking on a policy you already have",
      body:
        "Hi {{first_name}} — last note from me on this.\n\nIf you already have something in place, one thing is worth checking: the amount. A lot of older policies were written for a few thousand, which was reasonable when they were taken out and is well short of what a funeral costs now.\n\nIt takes a minute to look at the paperwork and see the figure. If it is close, you are fine. If it is a long way short, that is worth knowing sooner rather than later.\n\nThat is genuinely the most useful thing I can tell you, whether or not you ever speak to me.",
      whyItWorks: [
        "Gives something valuable to people who never respond, which is most of any list",
        "Re-opens the conversation with prospects who bought a small policy years ago",
        "Ends the sequence on advice rather than an offer, which is what makes the next one welcome",
      ],
    },
  ],
  toolsIntro: SEQUENCE_TOOLS_NOTE,
  tools: [
    {
      name: "A preview-mode dialer",
      category: "Calling, after consent",
      why: "This audience answers unknown numbers rarely and remembers being hounded. Preview mode gives you the record on screen before the call connects, so you open by name and context rather than reading a script cold.",
      limit: "Predictive and parallel modes are the wrong tool here twice over — the consent picture on a purchased record does not support them, and the seniors most likely to answer are the ones most put off by the connect delay.",
    },
    {
      name: "A CRM with a household view",
      category: "Record keeping",
      why: "Final expense decisions are frequently made with an adult child on the call. Being able to see who else is involved, and what was said last time, is worth more here than any automation feature.",
      limit: "Most general sales CRMs model a lone buyer and a deal value, which fits this vertical poorly. Expect to use a notes field as the household record.",
    },
  ],
  compliance: {
    heading: "Mode A, and why it suits this vertical anyway",
    body:
      "Everything above is email until the prospect confirms, which is the rule for any purchased record. It also happens to be the right approach commercially: an audience trained to avoid the phone is an audience where patient email outperforms volume dialing.",
    rules: [
      "Do not text on the consent that arrived with the record. Day 8 exists to earn permission that names you.",
      "Manual dialing is available from the start. Predictive and parallel dialing to cell phones is not.",
      "Check the Reassigned Number Database before a calling campaign. This is an older demographic and numbers change hands.",
      "Observe calling windows in the prospect's local time zone, and be conservative — an early call to a retiree is remembered.",
      "Never imply immediate payout on a new policy. Most carry a waiting period, and saying otherwise is the fastest way to a complaint.",
    ],
    tone: "note",
  },
  faqs: [
    {
      question: "Why email rather than calling aged final expense leads?",
      answer:
        "Because this category is worked hard by phone and the prospects have adapted. Someone who enquired six months ago may have taken a dozen calls in the first week and now ignores unknown numbers as a matter of routine. Email reaches them without triggering that, lets them read at their own pace, and lets them show it to a family member — which is how the decision usually gets made.",
    },
    {
      question: "What if the prospect already bought a policy?",
      answer:
        "That is often a conversation rather than a dead end. Many people take a small policy from a mail piece or a television advertisement, and those amounts were frequently set years ago and have not kept pace with what a funeral costs. Asking them to check the figure on their paperwork is useful advice whether or not it leads anywhere for you.",
    },
    {
      question: "Should I mention price in the first email?",
      answer:
        "Mention that the monthly amount is modest, but do not quote a figure. The number depends on age, health and the amount of cover, so a specific price in an email is either wrong or so hedged it means nothing. The second email in the sequence handles cost honestly by explaining what drives it instead.",
    },
    {
      question: "How long should I keep emailing someone who never replies?",
      answer:
        "Finish the sequence, then move them to a low-frequency track with a standing confirmation link rather than continuing to send. Someone who has not opened anything across four emails has told you something, and continuing to mail them lowers deliverability for everyone else on your list.",
    },
  ],
  related: [
    { label: "Aged final expense leads — pricing and where to buy", href: "/lead-types/final-expense-leads" },
    { label: "How to warm up an aged list and earn permission", href: "/guides/warm-up-aged-lead-list" },
    { label: "The Fresh-Consent Ladder", href: "/guides/fresh-consent-ladder" },
    { label: "Final expense telesales — closing over the phone", href: "/blog/final-expense-telesales-close-aged-leads-over-phone" },
    { label: "Final expense door knocking playbook", href: "/blog/final-expense-door-knocking-playbook" },
  ],
};

const LIFE: GuideData = {
  slug: "working-aged-life-insurance-leads",
  leadTypeSlug: "life-insurance-leads",
  title: "Working Aged Life Insurance Leads",
  metaTitle: "How to Work Aged Life Insurance Leads: Sequence and Scripts",
  metaDescription:
    "Life insurance enquiries are triggered by an event, not a product. A four-email sequence that re-opens on the event and earns permission that names you.",
  summary:
    "Almost nobody wakes up wanting life insurance. They buy a house, have a baby, change jobs, watch a friend get a diagnosis — and the search follows within a week or two. That means an aged life lead is a record of a life event, and the single most useful thing you can do is write to the event rather than to the product. Months later most of these prospects still have no cover, because the thing that stops people is not price. It is that the task has no deadline and never becomes urgent enough to finish.",
  estimatedMinutes: 10,
  updatedAt: "2026-09-10",
  sections: [
    {
      heading: "The enquiry was about an event",
      body:
        "Life insurance searches cluster tightly behind a handful of triggers: a mortgage, a new child, a new job with a benefits window, a health scare in the family, a divorce, a business partnership.\n\nEach one implies something different about the person, and a lead record rarely tells you which. But knowing that a trigger exists is enough to change the copy. \"You looked into life insurance\" is a weak opening. \"Most people look into this right after something changes — a house, a baby, a new job\" invites the reader to supply their own reason, and it is the reason that reopens the conversation.\n\nThis is also why the vertical rewards patience. The trigger created a window of attention, the window closed, and nothing since has forced the issue.",
    },
    {
      heading: "Why they did not finish",
      body:
        "The common assumption is price. It is usually not.\n\nWhat actually stops people is that buying life insurance requires deciding how much, for how long, and of what kind — three questions with no obvious answers and no deadline attached. Faced with that, most people close the tab and mean to come back.\n\nA smaller group stalled on the medical. Someone who assumes a health condition disqualifies them often stops rather than find out, and is frequently wrong.\n\nAnd a real proportion have employer cover and believe it is enough. It usually is not, and it usually disappears when they change jobs. That is a genuinely useful thing to tell someone, and it costs you nothing to say.",
    },
    {
      heading: "What to write to instead",
      body:
        "Make the decision smaller. The reason term dominates this market is that it removes two of the three questions — you are left only with how much and for how long, and both have simple defaults tied to the mortgage and the age of the youngest child.\n\nSo the sequence is not selling a policy. It is dismantling the reason the task never got finished. Give them a way to answer \"how much\" in a minute, tell them the medical is easier than they think, and correct the employer-cover assumption.\n\nDo that, and the ones who were stuck become the ones who reply.",
    },
  ],
  sequenceIntro:
    "Four emails over about two weeks, each removing one reason the task stalled. The permission ask sits at day 9, after the sequence has already been useful twice.",
  emailSequence: [
    {
      day: 0,
      subject: "why this never gets finished",
      body:
        "Hi {{first_name}} — you looked into life cover a while back. Whether or not that got sorted, here is the thing I would want someone to tell me.\n\nMost people who start this never finish it, and price is rarely the reason. The reason is that it asks you to decide three things at once — how much, for how long, and what kind — and none of them has an obvious answer or a deadline.\n\nSo it sits. For years, usually.\n\nThe way through it is to answer the easy question first and let the others follow. More on that in a few days.",
      whyItWorks: [
        "Names the real obstacle, which is decision fatigue rather than cost",
        "Tells the reader something true about themselves, which earns the next open",
        "Promises a specific next email rather than a vague follow-up",
        "Makes no assumption about the trigger, so it fits every reason they searched",
      ],
    },
    {
      day: 5,
      subject: "how much, in about a minute",
      body:
        "Hi {{first_name}} — the easy question first, as promised.\n\nHow much cover you need is close to arithmetic. Add what is left on the mortgage, plus roughly what the household spends in a year multiplied by the number of years until the youngest child is independent, plus anything you would want cleared. That is the figure.\n\nMost people land somewhere between five and fifteen times income, and most are surprised it is that high — usually because they were mentally comparing it to whatever their employer provides.\n\nOn that: employer cover is typically one or two times salary, and it stops when the job does. It is a useful supplement and a poor foundation.",
      whyItWorks: [
        "Turns the hardest question into arithmetic they can do in the email itself",
        "Corrects the employer-cover assumption, which is the quiet reason many never proceed",
        "Gives a range rather than a quote, which stays honest without being vague",
      ],
    },
    {
      day: 9,
      subject: "worth continuing?",
      body:
        "Hi {{first_name}} — short one.\n\nI have been sending these because you looked into cover at some point. That is a thin reason to keep writing, so I would rather ask.\n\nIf this is useful, confirm here: {{confirm_link}}\n\nConfirming also means I can reach out directly — which mostly matters for the medical question, because that is the one people get wrong on their own. Conditions that feel disqualifying often are not, and the only way to know is to ask someone who places these every week.\n\nIf not, do nothing at all and these stop.",
      whyItWorks: [
        "Asks after two genuinely useful emails, which is what makes the yes rate hold up",
        "Ties confirming to the medical question — the objection people cannot resolve alone",
        "Gives a concrete reason a conversation beats more email, without pressure",
      ],
      isConsentAsk: true,
    },
    {
      day: 15,
      subject: "if you already have a policy",
      body:
        "Hi {{first_name}} — last one from this sequence.\n\nIf you already have cover in place, two things are worth a five-minute check.\n\nThe beneficiary. It is the most common thing to be out of date, and it overrides whatever a will says. People who have married, divorced or had children since taking the policy frequently have not updated it.\n\nAnd the term end date. A twenty-year policy taken out when the mortgage started can expire while there is still mortgage left, which is exactly the wrong time to find out.\n\nBoth are on the paperwork. Neither costs anything to check.",
      whyItWorks: [
        "Useful to the majority who will never reply, which is the point of a last email",
        "The beneficiary point is genuinely under-known and gets forwarded",
        "Re-opens with people who thought they were covered and now have a reason to look",
      ],
    },
  ],
  toolsIntro: SEQUENCE_TOOLS_NOTE,
  tools: [
    {
      name: "A quoting engine you can send from",
      category: "Illustration delivery",
      why: "The moment a prospect asks 'what would that cost' is the moment the sequence has been building toward, and the gap between the question and a real number is where this vertical loses people. Being able to send an illustration the same day matters more than any nurture feature.",
      limit: "Quoting engines are carrier-specific and none covers the whole market, so expect to run more than one or accept that you are quoting a subset.",
    },
    {
      name: "A calendar link in every email footer",
      category: "Booking",
      why: "Life cover conversations are long enough that people want to schedule rather than be called. A link that lets them pick a time converts the reader who is ready but does not want to be caught off guard.",
      limit: "It only works for prospects already leaning in. It does nothing for the larger group who need the sequence to do its job first.",
    },
  ],
  compliance: {
    heading: "Email first, and no texting on inherited consent",
    body:
      "The lead-type page for this vertical already states the rule and it is worth repeating here: work aged life leads email-first and do not text them. The consent that arrived with the record does not carry the standard required for texting or automated dialing.",
    rules: [
      "No texting until the prospect confirms. Day 9 is what earns that.",
      "Manual dialing is open to you from the start; predictive and parallel dialing to cell phones is not.",
      "Never state or imply a premium in an email. It depends on age, health, term and amount, so any figure is either wrong or meaningless.",
      "Be careful with health questions in writing. Ask them on a call, where you can explain why you are asking.",
      "Several states run their own telephone consumer statutes on top of the federal rule. Aged lists are multi-state, so the strictest applicable rule governs.",
    ],
    tone: "note",
  },
  faqs: [
    {
      question: "Why do aged life insurance leads convert at all if they never bought?",
      answer:
        "Because most of them never decided against it — they simply never finished. The obstacle is usually decision fatigue rather than price: how much, for how long and what kind, with no deadline attached. The need created by the original trigger, a mortgage or a new child, is generally still there months later, which is why a sequence that makes the decision smaller reopens the conversation.",
    },
    {
      question: "Should I ask about health conditions by email?",
      answer:
        "Keep it general in writing and specific on a call. Telling people that conditions which feel disqualifying often are not is useful and encouraging. Asking someone to describe their medical history in an email reply is a poor experience and gets far fewer responses than raising it in conversation once they have agreed to talk.",
    },
    {
      question: "How do I handle someone who says they already have coverage through work?",
      answer:
        "Treat it as an opening rather than an objection. Employer cover is typically one or two times salary and ends when the job does, so it functions as a useful supplement and a poor foundation. Most people have never had that explained, and pointing it out is genuinely helpful whether or not they buy from you.",
    },
    {
      question: "Is term or permanent easier to sell from an aged lead?",
      answer:
        "Term, in almost every case, because it removes two of the three decisions that stalled the prospect in the first place. The amount ties to the mortgage and the age of the youngest child, and the length ties to the same horizon. Permanent products introduce exactly the complexity that caused the original search to go nowhere.",
    },
  ],
  related: [
    { label: "Aged life insurance leads — pricing and where to buy", href: "/lead-types/life-insurance-leads" },
    { label: "How to warm up an aged list and earn permission", href: "/guides/warm-up-aged-lead-list" },
    { label: "The Fresh-Consent Ladder", href: "/guides/fresh-consent-ladder" },
    { label: "Life insurance aged lead ROI", href: "/blog/life-insurance-aged-lead-roi" },
    { label: "Scripts and strategies for aged life leads", href: "/blog/aged-life-insurance-leads-scripts-strategies-agents" },
  ],
};

const AUTO: GuideData = {
  slug: "working-aged-auto-insurance-leads",
  leadTypeSlug: "auto-insurance-leads",
  title: "Working Aged Auto Insurance Leads",
  metaTitle: "How to Work Aged Auto Insurance Leads: Renewal Timing and Sequence",
  metaDescription:
    "An aged auto lead is a date, not an enquiry. Work the renewal clock with a four-email sequence, and know what a batch actually yields before you buy one.",
  summary:
    "Auto policies renew every six or twelve months, and that is the only moment switching is free. A prospect who shopped in March is sitting on a renewal in September or March no matter what they did next, which means a six- or twelve-month-old record arrives at almost exactly the right time. Nothing else in personal lines has that property. Work the clock rather than the enquiry and this vertical stops being a numbers game.",
  estimatedMinutes: 11,
  updatedAt: "2026-09-10",
  sections: [
    {
      heading: "The record is a date, not an enquiry",
      body:
        "Most aged-lead advice treats the original enquiry as the thing you re-open. In auto it is close to useless. Whatever quote they were chasing has expired, the rate has moved, and half of them do not remember filling in the form.\n\nWhat has not changed is the calendar. Auto policies run in six- or twelve-month terms, and a renewal is the one point where switching carries no cost — no mid-term cancellation, no short-rate penalty, no month of overlapping cover. Every other week of the year, changing carrier means eating something.\n\nSo the useful fact in the record is when they shopped. Someone who was in the market in March either switched, and their new term renews in September or the following March, or they stayed, and their existing renewal date is wherever it always was. Either way, an anniversary is coming, and the record tells you roughly when.\n\nThat is why age helps here instead of hurting. A record that has aged six or twelve months has aged into a window.",
    },
    {
      heading: "What actually changed since they shopped",
      body:
        "Two things, and both work in your favor.\n\nThe first is the renewal notice. Personal auto rates have moved sharply enough that a large share of drivers open a renewal that is higher than the last one, with no claim and no ticket to explain it. That letter arrives about thirty days before the renewal date, and it is the single most reliable trigger in this vertical. It creates the annoyance that the original search never quite reached.\n\nThe second is their own record. Violations and at-fault claims come off the rating window on a schedule — commonly three years for a moving violation and five for an at-fault claim, though it varies by state and carrier. A driver who was quoted eighteen months ago with a speeding ticket on file may price differently today without having done anything at all. Most people have no idea this is true, and telling them is useful whether or not they ever buy from you.\n\nBoth facts point at the same email: the rate you were quoted is not the rate you would be quoted, and your renewal is the moment to find out.",
    },
    {
      heading: "What a batch actually yields",
      body:
        "Model the net, not the gross, or the economics will surprise you in the wrong direction.\n\nA hundred-record batch is not a hundred workable records. Three filters take a bite before you contact anyone: the national Do Not Call registry, your own existing-customer and open-quote list, and whatever additional rules your CRM enforces on top. One captive agent working personal lines reported watching a hundred-record homeowners batch come down to sixty-seven workable records on those filters alone. That is one batch and one operation rather than a benchmark, but the shape of it is normal and the arithmetic matters. If a third of the batch drops, your net usable rate is sixty-seven percent and your true cost per workable record is roughly half again the sticker.\n\nThe second thing to price in is that aged inventory is generally sold as-is. Fresh internet leads often come with a return window for disconnected numbers and existing customers; aged records usually do not, because the discount is already carrying that risk. This is the trade, stated plainly: you accept lead spoilage in exchange for a price that assumes it.\n\nWhich is why the filter has to be cheap. If the thing that separates workable records from dead ones is your team dialing through the batch, the labor cost swamps the discount. If it is an email sequence, the batch filters itself for the price of sending, and the survivors arrive already engaged.",
    },
    {
      heading: "Buying on recency",
      body:
        "Aged does not mean undifferentiated. Most inventory can be filtered by how recently the prospect was in the market, and in auto that filter is doing real work — it is choosing where in the renewal cycle you land.\n\nA record from the last ninety days catches people who shopped, did not move, and are still inside the term they were shopping to escape. A record around the six- or twelve-month mark catches the anniversary itself. Both are workable and they want different copy: the recent one re-opens a live irritation, the older one arrives at a decision point.\n\nWhat you should not do is buy on age alone and write one sequence for the whole batch.",
    },
  ],
  sequenceIntro:
    "Four emails over about two and a half weeks. The first three are useful to someone who never replies, which is what makes the permission ask at day 9 land as a question rather than a pitch.",
  emailSequence: [
    {
      day: 0,
      subject: "when does your policy actually renew?",
      body:
        "Hi {{first_name}} — you looked at auto insurance a while back. I am not going to ask what happened, because the more useful question is a different one.\n\nWhen does your current policy renew?\n\nThat date is the only moment switching costs you nothing. Move mid-term and you are usually dealing with a cancellation, a short-rate adjustment, or a few weeks of paying twice. Move at the renewal and none of that exists.\n\nIt is on your declarations page, and most people cannot name it off the top of their head. Worth two minutes to find, whoever you end up insured with.\n\nMore in a few days on why the number on that renewal probably went up.",
      whyItWorks: [
        "Replaces a question they may not want to answer with one that is genuinely useful",
        "Gives a reason to go and look at their own paperwork, which raises engagement before any ask",
        "Establishes the renewal date as the frame for everything that follows",
        "Explicitly disclaims a pitch, which is what earns the second open",
      ],
    },
    {
      day: 4,
      subject: "the rate moved without you",
      body:
        "Hi {{first_name}} — the follow-up I promised.\n\nTwo things change your auto rate that have nothing to do with anything you did.\n\nThe first is the carrier's own pricing. Rates have moved enough in recent years that plenty of drivers open a renewal that is higher than the last one with a clean record and no claim. Nothing on your end caused it.\n\nThe second works the other way. Violations and at-fault claims fall out of the rating window on a schedule — commonly around three years for a moving violation and five for an at-fault claim, varying by state and carrier. If something was on your record when you last shopped and it has since aged off, you are a different risk now and you may be paying like the old one.\n\nNeither of those shows up unless someone looks. That is the whole reason a renewal is worth quoting rather than renewing on autopilot.",
      whyItWorks: [
        "Delivers a fact most drivers do not know and can verify, which builds standing before any ask",
        "Gives the reader a reason their rate may be wrong that does not blame them",
        "Ranges are stated as ranges with the state variation named, so nothing is overclaimed",
        "Sets up the day-9 ask by making a conversation obviously useful",
      ],
    },
    {
      day: 9,
      subject: "worth continuing?",
      body:
        "Hi {{first_name}} — a short one, and a fair question.\n\nI have been writing because you looked into auto cover at some point. That is a thin reason to keep going, so I would rather ask than assume.\n\nIf this is useful, confirm here: {{confirm_link}}\n\nConfirming also means I can reach out directly when your renewal is close, which is the only part of this that needs a conversation. Quoting properly means knowing your current limits, your deductible and the date — three things I cannot guess and you should not have to type into an email.\n\nIf not, do nothing and these stop.",
      whyItWorks: [
        "Comes after two emails that were useful on their own, which is what holds the confirm rate up",
        "Ties permission to a specific benefit tied to timing rather than to a generic offer",
        "Explains why a conversation beats more email without applying pressure",
        "Makes opting out effortless, which keeps complaints near zero on an aged list",
      ],
      isConsentAsk: true,
    },
    {
      day: 17,
      subject: "two numbers to check before you renew",
      body:
        "Hi {{first_name}} — last one from this sequence, and it is useful whether or not we ever speak.\n\nBefore your next renewal, look at two numbers on the declarations page.\n\nYour liability limits. Many drivers are carrying the state minimum without knowing it, and the state minimum was set to be minimal. If you own a house or have savings, a single at-fault accident can reach past the policy and into you. Raising those limits is usually one of the cheapest changes on the whole policy.\n\nYour deductible. If you would not comfortably pay it tomorrow, it is too high. If you could pay twice it without thinking, it is too low and you are buying down a risk you can absorb.\n\nThat is it. Both numbers are on one page, and getting them right matters more than the premium line most people shop on.",
      whyItWorks: [
        "Gives real value to the majority who will never reply, which is what a last email is for",
        "The liability-limits point is under-known and consistently gets forwarded",
        "Positions you as the person who told them something their current agent did not",
        "Leaves the door open without a call to action, so the sequence ends on generosity",
      ],
    },
  ],
  toolsIntro: SEQUENCE_TOOLS_NOTE,
  tools: [
    {
      name: "A comparative rater you can run in one sitting",
      category: "Quoting",
      why: "The gap between a prospect saying yes and seeing a real number is where this vertical loses people. Auto shoppers compare by nature, so the ability to put several carriers in front of someone in a single call is the difference between a conversation and a callback that never happens.",
      limit: "Raters cover a subset of carriers and bind-ready accuracy varies by state, so treat the output as a shortlist rather than a quote you can promise.",
    },
    {
      name: "A renewal-date field with a dated task attached",
      category: "CRM",
      why: "In this vertical the record's value is a date. Capturing the renewal month the moment a prospect tells you it, and firing a task thirty days ahead of it, turns a one-off contact into a recurring appointment that pays for years.",
      limit: "It only works once someone has actually told you the date, so it captures value after the sequence has done its job rather than before.",
    },
  ],
  compliance: {
    heading: "Email first, and no texting on inherited consent",
    body:
      "The rule for this vertical is the same as the rest of the site and worth repeating on the page it applies to: work aged auto leads email-first and do not text them. The consent that arrived attached to the record names the publisher who captured it, not you, and it does not carry the standard required for texting or automated dialing.",
    rules: [
      "No texting until the prospect confirms. Day 9 is what earns that.",
      "Manual dialing is open to you from the start; predictive and parallel dialing to cell phones is not.",
      "Scrub against the national Do Not Call registry before any calling, and re-scrub — registrations are added continuously and a list you cleaned last quarter is not clean now.",
      "Check numbers against the reassigned number database. Auto records age past the point where a number reliably belongs to the same person, and there is a federal safe harbor for having checked.",
      "Never quote a premium in writing. It depends on the vehicle, the driver, the limits and the state, so any figure in an email is either wrong or meaningless.",
      "Several states run their own telephone consumer statutes on top of the federal rule. Aged lists are multi-state, so the strictest applicable rule governs.",
    ],
    tone: "note",
  },
  faqs: [
    {
      question: "Why would a six-month-old auto insurance lead convert better than a fresher one?",
      answer:
        "Because auto policies renew in six- and twelve-month terms, and the renewal is the only point where switching carries no cancellation cost, short-rate penalty or overlapping premium. A record that has aged six or twelve months has aged into that window rather than away from the enquiry. Fresher records catch people mid-term, when moving costs them something.",
    },
    {
      question: "How many records in an aged auto batch are actually workable?",
      answer:
        "Fewer than you bought, and you should model the net before you buy. Three filters take a bite: the national Do Not Call registry, your own existing-customer and open-quote list, and whatever rules your CRM enforces on top. One captive agent working personal lines reported a hundred-record batch reducing to sixty-seven workable records on those alone. Measure your own net usable rate on a first batch and price every batch after that on the net.",
    },
    {
      question: "Can I get credit back for bad records the way I can with fresh internet leads?",
      answer:
        "Usually not, and that is the trade rather than a defect. Fresh lead sellers commonly offer a return window for disconnected numbers and existing customers; aged inventory is generally sold as-is because the discount already assumes spoilage. The right response is to make your filtering cheap. An email sequence separates workable records from dead ones for the cost of sending, where dialing through the batch spends labor that erases the discount.",
    },
    {
      question: "My carrier's CRM strips email addresses out of uploaded lists. How do I run an email-first sequence?",
      answer:
        "Run the sequence in a system you control and let the carrier CRM take the record afterwards. Several captive systems refuse to accept an email address from a purchased list and will only hold one once the agent has made contact and obtained permission. That constraint and the fresh-consent approach want exactly the same thing, so the sequence produces the permission the CRM is waiting for. Check your own carrier's rules before you buy, because this shapes which tool the sequence lives in.",
    },
    {
      question: "Should I filter aged auto inventory by how recently the prospect shopped?",
      answer:
        "Yes, and then write to the filter you chose. A record from the last ninety days catches someone still inside the term they were trying to escape, so the copy re-opens a live irritation. A record near the six- or twelve-month mark lands on the renewal anniversary itself, so the copy works the date. Buying on age alone and sending one sequence to the whole batch wastes the better half of it.",
    },
  ],
  related: [
    { label: "Aged auto insurance leads — pricing and where to buy", href: "/lead-types/auto-insurance-leads" },
    { label: "How to warm up an aged list and earn permission", href: "/guides/warm-up-aged-lead-list" },
    { label: "The Fresh-Consent Ladder", href: "/guides/fresh-consent-ladder" },
    { label: "Aged auto insurance leads: the overlooked goldmine for P&C agents", href: "/blog/aged-auto-insurance-leads-overlooked-goldmine-pc-agents" },
    { label: "The cross-sell strategy that doubles revenue", href: "/blog/auto-insurance-aged-leads-cross-sell-strategy-double-revenue" },
  ],
};

export const GUIDES: Record<string, GuideData> = {
  [FRESH_CONSENT_LADDER.slug]: FRESH_CONSENT_LADDER,
  [PEWC.slug]: PEWC,
  [WARM_UP.slug]: WARM_UP,
  [FINAL_EXPENSE.slug]: FINAL_EXPENSE,
  [LIFE.slug]: LIFE,
  [AUTO.slug]: AUTO,
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

export function getGuide(slug: string): GuideData | undefined {
  return GUIDES[slug];
}
