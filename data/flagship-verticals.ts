import type { Vertical } from "@/lib/email-course/types";

export interface FlagshipVerticalConfig {
  slug: Vertical;
  title: string;
  icon: string;
  subtitle: string;
  heroHeadline: string;
  heroSubhead: string;
  bullets: string[];
  proofStat: { number: string; label: string };
  cadenceTease: string[];
  targetAudience: string[];
  playbookPdfPath: string;
  workbookPdfPath: string;
  affiliateCampaign: string;
  faqs: { q: string; a: string }[];
  /**
   * Long-form SEO depth rendered BELOW the conversion fold on the flagship
   * vertical landing page. Operator / "build-a-system" intent — deliberately
   * distinct from the buyer/comparison intent of /lead-types/* so the two
   * page families don't cannibalize. Body supports paragraph breaks via "\n\n".
   */
  deepDive: { heading: string; body: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const FLAGSHIP_VERTICALS: Record<Vertical, FlagshipVerticalConfig> = {
  mortgage: {
    slug: "mortgage",
    title: "Mortgage",
    icon: "🏠",
    subtitle: "For loan officers, mortgage brokers, and lenders",
    heroHeadline: "Turn $2 aged mortgage leads into funded loans.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for LOs running aged refi, purchase, HELOC, and reverse-mortgage leads.",
    bullets: [
      "The unit economics: max CPL, contact rate, and cost-per-funded-loan formulas",
      "14-day multi-channel cadence with NMLS-compliant scripts",
      "Rate-move nurture triggers to re-engage your 85% non-closers",
      "TCPA + state mini-TCPA compliance (FL, OK, WA, MD, TX)",
      "Fresh-Consent Ladder plays — graduate inherited consent into owned consent",
    ],
    proofStat: {
      number: "7.5×",
      label: "typical ROI on aged mortgage leads at 15% contact × 4% close",
    },
    cadenceTease: [
      "Day 0 — Mindset + unit economics",
      "Day 2 — Tech stack sized to your volume",
      "Day 4 — The 14-day opener cadence + scripts",
      "Day 7 — Infinity nurture + rate-move triggers",
      "Day 10 — Compliance + 90-day diagnostic",
    ],
    targetAudience: [
      "Loan officers buying aged refi, purchase, or HELOC leads",
      "Mortgage brokers running small to mid-size teams",
      "Branch owners looking to formalize an aged-lead operation",
      "Reverse-mortgage specialists",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-mortgage.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-mortgage.pdf",
    affiliateCampaign: "flagship-mortgage",
    faqs: [
      {
        q: "Does this work for refi, purchase, and HELOC all in one playbook?",
        a: "Yes. The master playbook covers the full system; the mortgage overlay has product-specific scripts and compliance notes for refi, purchase, HELOC, and reverse-mortgage leads.",
      },
      {
        q: "Is this compliant with current TCPA rules?",
        a: "The playbook walks you through current federal TCPA + state mini-TCPA guidance as of 2026 (including the vacated 1:1 rule and the 2027 revocation-all timeline). It is operator guidance, not legal advice — the playbook recommends Henson Legal for compliance reviews.",
      },
      {
        q: "What if I'm new to aged leads?",
        a: "Start in the 'Mode A' conservative setup the playbook recommends — manual dial, plain-text email, fresh-consent ladder. You can graduate to more automation once your consent workflow is solid.",
      },
      {
        q: "How is this different from your aged mortgage leads buying guide?",
        a: "The buying guide helps you choose and price leads — what to buy and where. This system is about what to do after you buy them: the operation, scripts, cadence, and compliance that turn a list into funded loans. Most LOs lose money on aged leads not because they bought wrong, but because they had no system to work them.",
      },
      {
        q: "Do I need a dialer or expensive tech to run this?",
        a: "No. The recommended starting setup is intentionally lean — manual dialing, a CRM you already have, and plain-text email. The playbook sizes a tech stack to your volume, but the system works on day one with tools most loan officers already own. Tech is an accelerant, not a prerequisite.",
      },
      {
        q: "How many aged mortgage leads do I need to make this work?",
        a: "Enough to run the full cadence on the full list rather than half-working a big file. A few hundred to a thousand records is a workable starting batch for one LO; the playbook's unit-economics module shows you how to back into the right volume from your close rate and capacity.",
      },
      {
        q: "Is the email course really free?",
        a: "Yes. The playbook PDF, the workbook, and the 10-day email course are all free. Enter your email and you get immediate access to the download plus the course delivered over the following days.",
      },
    ],
    deepDive: [
      {
        heading: "Why an Aged Mortgage Lead Operation Needs a System, Not Just a Script",
        body: "Most loan officers who try aged mortgage leads quit within a month, and almost none of them quit because the leads were bad. They quit because they treated a cheap list like a lottery ticket — buy a thousand records, make two hundred calls, get discouraged by the contact rate, and walk away. The leads weren't the problem; the absence of a system was.\n\nAn aged-lead operation is a process, not an event. The economics only work when the same disciplined cadence runs across the entire list, every contact attempt is logged, and the non-closers (which is most of any list) flow into a long-term nurture instead of a trash folder. That's the difference between an operator and a list-burner: the operator builds a repeatable machine that turns a fixed lead spend into a predictable number of funded loans, month after month.\n\nThis is exactly what the Aged Lead Operator's System is built to install. The playbook, workbook, and 10-day email course walk a loan officer from a cold list to a running operation — unit economics, the 14-day opener cadence, rate-move nurture triggers, NMLS-compliant scripts, and a compliance workflow — so the result doesn't depend on luck or hustle on any single call.",
      },
      {
        heading: "The Unit Economics Every Aged Mortgage Operator Must Know",
        body: "The single most expensive mistake in aged mortgage leads is optimizing the per-lead price instead of the cost per funded loan. A $1 lead and a $3 lead are indistinguishable at the funnel's end if your contact rate and close rate are weak — and a clean, well-worked $3 lead routinely beats a cheap, half-worked $1 lead on total funded production.\n\nThe operator's framework runs the whole funnel: lead spend, contact rate, application rate, funded-loan rate, and commission. Those numbers back into the two that actually matter — your maximum sustainable cost per lead and your true cost per funded loan. Once you can see the full chain, the highest-leverage move is almost never the lead price; it's the contact rate, which a fresh DNC scrub, better dialing windows, and a real multi-touch cadence can often double.\n\nThe Aged Lead Operator's System gives you the formulas and a workbook to plug your own numbers into, so you stop guessing and start running the operation against real targets. When you know your max CPL and your cost per funded loan, buying decisions get simple and your budget stops leaking into the wrong levers.",
      },
      {
        heading: "The Cadence That Separates Profitable Operators From List-Burners",
        body: "A single phone call is not a cadence, and single-touch outreach is why most aged mortgage lead files underperform. The contact rates that make the unit economics work assume a structured, multi-channel sequence spread over roughly two weeks — calls at varied times of day, a plain-text email, voicemail, and for local leads a direct-mail touch — all timed and logged rather than improvised.\n\nThe mortgage twist is the rate-move trigger. A refinance lead is a snapshot of interest at a specific rate; when rates dip below that snapshot, an aged refi file becomes a ready-made call list of people whose break-even math just flipped. Operators who keep their non-closers in a long-term nurture are already in conversation with hundreds of homeowners the moment rates move, while competitors start from a cold list.\n\nThe playbook lays out the exact 14-day opener cadence, the rate-move re-engagement triggers, and the 'infinity nurture' for the 85% who don't close on the first pass — with scripts written to be NMLS-compliant. It's the operational backbone that turns a one-time lead buy into a pipeline that compounds.",
      },
      {
        heading: "Compliance as an Operating Discipline, Not an Afterthought",
        body: "Aged mortgage leads are consumer data records, not pre-consented contacts, so compliance has to be built into the operation from day one rather than bolted on after a complaint. The operators who get burned are the ones who treat an old inquiry as permission to dial with any technology they like — it isn't.\n\nThe 2026 picture is more workable than recent headlines suggested: the FCC's one-to-one consent rule was vacated in early 2025 before it took effect, and the broad revocation-of-consent timeline was pushed to 2027. But several states run active mini-TCPA statutes — Florida, Oklahoma, Washington, Maryland, and Texas among them — so a campaign that's fine federally can still create exposure at the state level. The safe posture is manual dialing, clean DNC and litigator scrubs before every campaign, honored opt-outs, and respect for state calling windows.\n\nThe Aged Lead Operator's System frames compliance as a set of operating modes — a conservative Mode A you can start in today and graduate from as your consent workflow matures — plus the Fresh-Consent Ladder for converting inherited consent into owned consent. It's operator guidance, not legal advice, and the playbook names Henson Legal for the compliance reviews every serious operation should run. Compliance done this way isn't a brake on the operation; it's what lets it scale without becoming a liability.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Mortgage Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course. The complete system for working aged mortgage leads — scripts, unit economics, cadence, compliance.",
  },

  insurance: {
    slug: "insurance",
    title: "Insurance",
    icon: "🛡️",
    subtitle: "For auto, home, life, final expense, Medicare, and health agents",
    heroHeadline: "Turn aged insurance inquiries into new policies.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for agents running aged auto, home, life, final expense, Medicare, and health leads.",
    bullets: [
      "Sub-vertical economics: auto, home, term life, final expense, Medicare, health",
      "Script variants for each line — auto 'still going up', home 'non-renewal', Medicare AEP",
      "Renewal-cycle nurture calendar (AEP, OEP, SEP triggers)",
      "State DOI licensing checks + state mini-TCPA rules",
      "CMS-compliant Medicare workflow (Scope of Appointment, recorded enrollment)",
    ],
    proofStat: {
      number: "5×",
      label: "typical ROI on aged insurance leads at 15% contact × 8% close",
    },
    cadenceTease: [
      "Day 0 — Mindset + unit economics by sub-vertical",
      "Day 2 — Tech stack + Medicare-separate workflow",
      "Day 4 — Sub-vertical scripts (auto, home, final expense, Medicare)",
      "Day 7 — Renewal-cycle nurture (AEP, OEP, SEP)",
      "Day 10 — Compliance + Henson Legal + 90-day diagnostic",
    ],
    targetAudience: [
      "P&C agents running aged auto and home leads",
      "Life insurance agents (term + final expense)",
      "Medicare agents preparing for AEP",
      "Independent agencies working multiple lines",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-insurance.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-insurance.pdf",
    affiliateCampaign: "flagship-insurance",
    faqs: [
      {
        q: "Does this cover Medicare marketing too?",
        a: "Yes, the insurance overlay has a dedicated Medicare section covering Scope of Appointment, recorded telephonic enrollment, and CMS disclaimers. Medicare runs as a separate workflow from general insurance outreach.",
      },
      {
        q: "Is it compliant with state DOI rules?",
        a: "The playbook addresses state DOI licensing requirements and state mini-TCPAs (FL, OK, WA, MD), plus senior-marketing protections in states like NY, CA, and MA. Pair with counsel for your specific states.",
      },
      {
        q: "Will this work for just one line (e.g. only final expense)?",
        a: "Yes. The overlay breaks out economics, scripts, and compliance per sub-vertical. If you only sell final expense, you'll use that section; the rest is reference.",
      },
      {
        q: "How is this different from your aged insurance leads buying guide?",
        a: "The buying guide helps you choose and price leads across auto, home, life, final expense, and Medicare. This system is what you do after you buy them: the cross-sell-aware operation, sub-vertical scripts, renewal-cycle nurture, and compliance that turn a list into bound policies and multi-line households.",
      },
      {
        q: "Does it cover cross-selling across lines?",
        a: "Yes — cross-selling is central. The system treats every bound policy as the start of a household relationship, with a workflow that queues a coverage review on the other lines after each bind. That's where aged insurance leads actually pay off: lifetime household value, not a single-line close.",
      },
      {
        q: "How much tech do I need to run this?",
        a: "Less than you'd think. A CRM that can tag line of business and queue follow-ups, manual dialing, and plain-text email cover the starting setup. The playbook sizes a stack to your volume, but the cross-sell and renewal-nurture discipline matter far more than the tools.",
      },
      {
        q: "Is the playbook and email course really free?",
        a: "Yes. The playbook PDF, the workbook, and the 10-day email course are all free. Enter your email and you get the download immediately plus the course over the following days.",
      },
    ],
    deepDive: [
      {
        heading: "Why Aged Insurance Leads Reward a System Over a Sales Pitch",
        body: "Most agents who buy aged insurance leads work them like real-time leads — call hard, pitch a policy, move on — and then conclude the leads were junk. The leads were fine; the approach was wrong. Aged insurance leads are consumers who requested a quote weeks or months ago, were buried in competing pitches, and stalled. They convert for the agent who shows up as a helpful advisor, not the fifth person to hard-sell them.\n\nWhat turns that around is a system. A repeatable operation runs the same multi-touch cadence across the whole list, segments by line of business, and — critically — treats every bound policy as the opening of a household relationship rather than a finished transaction. Agents who do this build books; agents who one-and-done a list burn through it and blame the data.\n\nThe Aged Lead Operator's System installs that operation. The insurance edition's playbook, workbook, and 10-day email course cover sub-vertical economics, script variants for each line, the renewal-cycle nurture calendar, and a compliant workflow — so a cheap list becomes a steady source of bound policies and, over time, multi-line households.",
      },
      {
        heading: "Cross-Selling: The Economics That Make Aged Insurance Leads Pay",
        body: "The headline price of an aged insurance lead understates its value because insurance is a cross-sell business. A consumer who asked for an auto quote almost always has a home or rental, may need life coverage, and faces renewals across every line they hold. Each bound policy is a base, not an endpoint — and the second and third policies close at far higher rates because you're already a trusted advisor, at no additional lead cost.\n\nThis is why the right operating metric is lifetime household value, not cost per lead. A single inexpensive lead that becomes a three-line household with annual renewals returns many multiples of a one-policy close. The operation that captures this builds a coverage-review step into the workflow after every bind, so cross-sell opportunities surface automatically instead of being left on the table.\n\nThe system gives you the sub-vertical economics and the cross-sell workflow to make this systematic rather than accidental. When your operation is built to expand each household, the cheap aged lead becomes the lowest-cost customer-acquisition channel you have.",
      },
      {
        heading: "Renewal-Cycle Nurture: Selling on the Calendar",
        body: "Insurance buying intent follows a calendar, and aged leads are uniquely suited to working it. Auto and home policies renew on six- or twelve-month terms, so a consumer who bought elsewhere after their original quote comes back into play as their renewal approaches. Medicare concentrates intent into the Annual Enrollment Period and special-enrollment triggers. Life needs persist for months or years. An agent who only calls once misses all of it.\n\nThe operator's move is a renewal-cycle nurture: stay in low-pressure contact, tag each lead's line and likely renewal window, and time your outreach to land just before the moment the consumer can actually switch. Done across a whole list, this converts 'cold' aged records into perfectly-timed conversations — the renewal is the hook, and you're the agent already in the relationship when it arrives.\n\nThe insurance edition lays out the renewal-cycle nurture calendar (AEP, OEP, SEP, and P&C renewal timing) and the script variants that match each window. It turns the calendar from something that works against a one-time caller into the engine of a year-round operation.",
      },
      {
        heading: "Compliance as an Operating Discipline, Including Medicare's Extra Layer",
        body: "Aged insurance leads are consumer data records, not pre-consented contacts, so compliance belongs in the operation from day one. The federal baseline is the same across lines: DNC and litigator scrubs before every campaign, manual dialing rather than prohibited automated technology, honored opt-outs, and respect for calling windows. The FCC's one-to-one consent rule was vacated in early 2025 before it took effect, but several states run active mini-TCPA statutes (Florida, Oklahoma, Washington, Maryland), plus senior-marketing protections in states like New York, California, and Massachusetts.\n\nMedicare carries a heavier layer that has to run as a separate workflow. CMS rules require a valid permission to contact, a documented Scope of Appointment before discussing specific plans, the TPMO disclaimer, and call recording where applicable — so aged Medicare records demand more caution than any other line, because the original permission may have expired.\n\nThe Aged Lead Operator's System frames all of this as operating modes you can start conservatively and graduate from, plus the Fresh-Consent Ladder for converting inherited consent into owned consent and a CMS-compliant Medicare workflow. It's operator guidance, not legal advice; the playbook names Henson Legal for compliance reviews and recommends pairing with counsel for your specific states.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Insurance Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course for agents working aged auto, home, life, final expense, Medicare, and health leads.",
  },

  "home-services": {
    slug: "home-services",
    title: "Home Services",
    icon: "🔨",
    subtitle: "For roofers, solar, windows, HVAC, remodel, pest, foundation",
    heroHeadline: "Turn aged home-services leads into booked estimates.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for home-services contractors running aged roofing, solar, windows, HVAC, remodel, pest, and foundation leads.",
    bullets: [
      "The two-step funnel: contact → estimate → sold (never try to close on the phone)",
      "Sub-vertical economics and scripts — roofing storm-damage, solar payback, HVAC pre-season",
      "Field-capacity math: size lead volume to your estimator calendar",
      "The 'neighborhood proof' nurture play — unique to home services",
      "State storm-moratoriums, contractor-board rules, and financing disclosure language",
    ],
    proofStat: {
      number: "8×",
      label: "typical ROI on aged roofing leads at 15% contact × 6% sold",
    },
    cadenceTease: [
      "Day 0 — Mindset + ARPC math by sub-vertical",
      "Day 2 — Field-capacity planning + tech stack",
      "Day 4 — Book-the-estimate scripts (never close on the phone)",
      "Day 7 — Seasonal + neighborhood-proof nurture",
      "Day 10 — Compliance, storm moratoriums + 90-day diagnostic",
    ],
    targetAudience: [
      "Roofing and solar contractors",
      "Window, HVAC, and remodel companies",
      "Pest control and foundation repair operations",
      "Contractors running outbound teams against aged lead files",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-home-services.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-home-services.pdf",
    affiliateCampaign: "flagship-home-services",
    faqs: [
      {
        q: "Does this cover roofing, solar, and remodels all in one playbook?",
        a: "Yes. The home-services overlay breaks out economics, scripts, and compliance for roofing, solar, windows, HVAC, remodels, pest, and foundation. Shared cadence, sub-vertical-specific scripts.",
      },
      {
        q: "What about post-storm moratoriums in Florida and Texas?",
        a: "The compliance section covers state-specific storm-moratorium rules, contractor-board regulations (CA, TX, FL, NY), 'free estimate' vs 'free inspection' language, and Regulation Z financing disclosures.",
      },
      {
        q: "How many leads do I need to start?",
        a: "250–500 aged leads per field rep per month, targeted to a tight geographic cluster so reps aren't crossing paths. Size lead volume to your estimator capacity first.",
      },
      {
        q: "How is this different from your aged home services leads buying guide?",
        a: "The buying guide helps you choose and price leads across roofing, solar, HVAC, windows, and remodel. This system is what you do after you buy them: the two-step booking operation, zip-based field routing, the neighborhood-proof nurture, and the compliance that turn a list into booked estimates and sold jobs.",
      },
      {
        q: "Why is home services run as a two-step funnel?",
        a: "Because you don't sell a roof on the phone — you book the estimate, and your field rep closes on the driveway. The whole operation is built to drive aged leads to a scheduled estimate, then to maximize the show rate and the estimate-to-sold conversion. Trying to close on the call kills bookings.",
      },
      {
        q: "Do I need a big team or special software?",
        a: "No. The system works for a single crew with a CRM that can tag trade and zip and an SMS tool. The playbook sizes lead volume to your estimator calendar and shows the field-routing and reminder workflows — capacity planning and SMS reminders matter far more than expensive software.",
      },
      {
        q: "Is the playbook and email course really free?",
        a: "Yes. The playbook PDF, the workbook, and the 10-day email course are all free. Enter your email and you get the download immediately plus the course over the following days.",
      },
    ],
    deepDive: [
      {
        heading: "Why Home-Services Aged Leads Demand an Operation, Not a Phone Blitz",
        body: "Contractors who buy aged home-services leads and just start dialing usually conclude the leads were dead. They weren't — the approach skipped the operation the vertical requires. Home services is a two-step sale: the call books an estimate, and the field rep closes on the driveway. An operation built around that reality converts; a phone blitz that tries to sell a roof over the line does not.\n\nThe leads themselves stay warm because the underlying problem — an aging roof, a failing HVAC, a rising energy bill — doesn't resolve on its own. A homeowner who stalled 90 days ago because the first contractor was slow or pushy is still a live prospect. The operator's job is to re-engage them, book the estimate, get them to show, and route the field team efficiently. That's a system, not a script.\n\nThe Aged Lead Operator's System, home-services edition, installs exactly that: the two-step booking funnel, field-capacity math that sizes lead volume to your estimator calendar, sub-vertical scripts, the neighborhood-proof nurture, and a compliance workflow. It turns a cheap list into a steady stream of booked estimates and sold jobs.",
      },
      {
        heading: "The Two-Step Funnel Math: Cost Per Booked Estimate and Cost Per Sold Job",
        body: "The per-lead price is nearly meaningless in home services because the revenue per job is so large. The numbers that run the operation are cost per booked estimate and cost per sold job. Work an aged roofing list with a disciplined cadence and you might book an estimate from roughly one in ten leads; if your reps close a quarter of the estimates they run, a few-dollar lead nets a sold job for a tiny fraction of the job's value. Against a roofing ticket in the thousands, the lead cost is a rounding error.\n\nThat cushion is why home services is one of the most forgiving verticals for aged leads — and why the lever to optimize is never the lead price. It's the booked-estimate rate and the show rate. Better dialing windows, SMS alongside the call, appointment reminders, and zip-based routing that lets you offer tight estimate windows move the economics far more than shaving pennies off the lead cost.\n\nThe playbook gives you the field-capacity and unit-economics math (average revenue per contact by sub-vertical) so you size lead volume to your crew and run the operation against real targets instead of guessing.",
      },
      {
        heading: "The Neighborhood-Proof Play and Zip-Based Routing",
        body: "The highest-ROI move unique to aged home-services leads is the neighborhood play, and most contractors never run it. When you complete a job, you already have a crew, a truck, and a finished install in a specific zip. That's the moment to reach out — softly — to every aged lead you hold in that same zip: 'We'll have a crew on your street this week; since you'd looked at a new roof, want a free estimate while we're nearby?'\n\nIt converts because the proximity is real, a nearby finished job is visible social proof, and the offer is low-friction. It also compounds your economics: tighter estimate clusters mean less drive time, more estimates per rep-day, and a credible reason to re-contact records that had gone cold. The prerequisite is operational — your aged leads must be loaded and queryable by zip so you can pull 'all open leads in this zip' the moment a job wraps.\n\nThe system shows you how to build zip-based routing and the neighborhood-proof nurture into your operation, turning a static call file into a geographically activated asset that gets more efficient the more jobs you complete.",
      },
      {
        heading: "Compliance as an Operating Discipline: Storms, Boards, and Financing",
        body: "Aged home-services leads are consumer data records, not pre-consented contacts, so compliance belongs in the operation from day one. The federal baseline matches every vertical: DNC and litigator scrubs before each campaign, manual dialing rather than prohibited automated technology, honored opt-outs, and respect for calling windows. The FCC's one-to-one consent rule was vacated in early 2025 before it took effect, and several states run active mini-TCPA statutes, so a federally-fine campaign can still create state exposure.\n\nHome services adds trade-specific rules. Several states restrict roofing and storm-related solicitation for a window after a declared disaster — Florida, Texas, and Louisiana are the most active — so post-storm outreach needs a moratorium check first. State contractor boards regulate marketing language and incentives (using 'free estimate' rather than 'free inspection' avoids triggering solicitation rules in some states), and any financing offer must carry Regulation Z-compliant disclosures.\n\nThe Aged Lead Operator's System frames this as operating modes you can start conservatively and scale from, with the storm-moratorium, contractor-board, and financing-disclosure rules built into the scripts. It's operator guidance, not legal advice; the playbook names Henson Legal for compliance reviews. Built in from the start, compliance lets the operation scale without becoming a liability.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Home Services Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course for contractors working aged roofing, solar, windows, HVAC, remodel, pest, and foundation leads.",
  },
};

export function allFlagshipVerticals(): FlagshipVerticalConfig[] {
  return Object.values(FLAGSHIP_VERTICALS);
}
