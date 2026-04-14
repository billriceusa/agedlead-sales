import type { CourseModule, CourseEmail } from "./types";
import {
  renderShell,
  greet,
  para,
  heading,
  list,
  signoff,
  affiliateCtaBlock,
} from "./shared";

const email1: CourseEmail = {
  day: 0,
  subject: "Your playbook's in. Here's where to start.",
  preheader: "Why aged insurance leads still convert — and why most agents miss it.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Bill Rice here. Your <strong>Aged Lead Operator's System — Insurance Edition</strong> and <strong>Workbook</strong> are linked at the bottom of this email.")}
${para("The mindset:")}
${para("<strong>Aged insurance leads work because insurance problems don't solve themselves in 90 days.</strong>")}
${para("The homeowner who shopped auto back in January didn't stop driving. The senior who asked about final expense didn't suddenly get covered. Their premiums went up. Their carriers sent non-renewal notices. The original agent stopped following up. That's your opening.")}
${para("At $1 aged CPL, 15% contact, 8% close, $400 ARPC — you're looking at ~5× return on lead spend. The math works in almost every insurance sub-vertical if you run the operation.")}
${heading("Your first move this week")}
${list([
  "Read Part I and II of the playbook (~20 min)",
  "Fill out Worksheet 1 (Unit Economics)",
  "If you sell Medicare or final expense, skim the sub-vertical section for your line — compliance is different",
])}
${para("Tomorrow: setting up the operation.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Bill Rice here. Your Insurance Edition playbook + Workbook are linked below.

Aged insurance leads work because insurance problems don't solve themselves in 90 days. Premium went up. Carrier non-renewed. Original agent moved on. Your opening.

At $1 CPL, 15% contact, 8% close, $400 ARPC = 5× ROI. Math works in almost every sub-vertical.

This week:
1. Read Part I and II
2. Worksheet 1 (Unit Economics)
3. Medicare/final expense: skim sub-vertical section (different compliance)

Tomorrow: setup.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email2: CourseEmail = {
  day: 2,
  subject: "The cheapest way to run an aged insurance operation",
  preheader: "Why your first setup should cost under $100/month.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("I watched a P&C agency spend $8,000 on a call center tech stack to run 300 aged auto leads a month. ROI math was upside-down before they dialed the first lead. Don't do that.")}
${heading("Three tiers for aged insurance")}
${list([
  "<strong>Setup A</strong> (0–500 leads/mo): VoIP + SMS + Google Sheet, ~$50/mo",
  "<strong>Setup B</strong> (500–5,000 leads/mo): CRM + preview dialer + SMS, $200–$400/mo per rep",
  "<strong>Setup C</strong> (5,000+ leads/mo, 5+ agents): AI dialer + QA + BI, $500–$1,200/mo per rep",
])}
${heading("Insurance-specific notes")}
${list([
  "<strong>Medicare needs a separate workflow.</strong> Scope of Appointment forms, recorded telephonic enrollment, CMS disclaimers. Do not mix Medicare into your general cadence.",
  "<strong>State DOI licensing matters.</strong> Before calling into a state, confirm you're licensed there.",
  "<strong>Final expense needs a softer cadence.</strong> 2-week minimum between nurture touches on senior prospects.",
])}
${heading("Your move this week")}
${list([
  "Worksheet 2 — pick your tier honestly",
  "If you sell multiple lines, run separate unit-economics for each",
  "Name the trigger that tells you to upgrade",
])}
${para("Day 4: scripts. Different sub-verticals, different scripts.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Watched a P&C agency spend $8K on tech for 300 aged auto leads a month. Don't do that.

Three tiers:
A (0–500 leads/mo): VoIP + SMS + Sheet, ~$50/mo
B (500–5,000 leads/mo): CRM + preview dialer, $200–$400/mo per rep
C (5,000+ leads/mo): AI stack, $500–$1,200/mo per rep

Insurance notes:
- Medicare = separate workflow. SOA forms, recorded enrollment, CMS disclaimers.
- State DOI licensing before calling.
- Final expense = softer cadence. 2 weeks minimum between nurture.

This week:
1. Worksheet 2 — pick tier
2. Separate unit economics for each line
3. Name upgrade trigger

Day 4: scripts.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email3: CourseEmail = {
  day: 4,
  subject: "The 14-day cadence — tuned for your line",
  preheader: "Auto vs home vs final expense — different scripts, same structure.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("The 14-day opener cadence is the same across insurance sub-verticals. What changes is the <strong>script</strong> and the <strong>tone</strong>.")}
${heading("The cadence")}
${list([
  "Day 1: Call (AM) + voicemail + SMS",
  "Day 2: Email",
  "Day 3: Call (PM) + SMS",
  "Day 5: Call (evening) + Email",
  "Day 7: Call + break-up SMS",
  "Day 10: Break-up email",
  "Day 14: Final call",
])}
${heading("Script variations by line")}
${para("<strong>Auto — 'still going up' opener:</strong><br/><em>'Hey [Name], Bill with [Company]. A couple months back you shopped auto quotes — just checking in. Did you end up switching, or is your premium still going up with your current carrier?'</em>")}
${para("<strong>Home — non-renewal hook:</strong><br/><em>'You shopped home insurance back in [month]. With what's been going on with rates in [state], I wanted to check in — are you still with your current carrier, or did you get non-renewal'd?'</em>")}
${para("<strong>Final expense — soft opener:</strong><br/><em>'Hey [Name], this is Bill. Back in [month] you asked for info on final expense coverage. Just checking in to see if you got that handled. No pressure at all — just closing the loop.'</em>")}
${para("<strong>Medicare — AEP opener:</strong><br/><em>'You looked at Medicare plans back in [month]. With AEP starting [date], I wanted to see if you'd want me to walk through your options. We'd do a Scope of Appointment first and then review.'</em>")}
${heading("Your move this week")}
${list([
  "Worksheet 5 — customize the script for your line and company",
  "Say it out loud 5 times",
  "Load the 14-day cadence into your CRM",
])}
${para("<strong>Critical:</strong> if you sell Medicare, stop here and build a separate Medicare workflow before running outreach.")}
${para("Day 7: the nurture game.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

14-day opener is the same across sub-verticals. Scripts and tone differ.

Cadence:
Day 1: Call (AM) + VM + SMS
Day 2: Email
Day 3: Call (PM) + SMS
Day 5: Call (evening) + Email
Day 7: Call + break-up SMS
Day 10: Break-up email
Day 14: Final call

Opener by line:
- Auto: "Did you switch, or is your premium still going up?"
- Home: "Did you get non-renewal'd?"
- Final expense (soft): "Just closing the loop on your question. No pressure."
- Medicare: "With AEP starting, want me to walk through options?"

This week:
1. Worksheet 5 — customize
2. Out loud 5×
3. Load cadence

Critical: Medicare needs separate workflow. SOA + recorded enrollment.

Day 7: nurture.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email4: CourseEmail = {
  day: 7,
  subject: "The renewal-cycle nurture most agents miss",
  preheader: "Insurance has a recurring event calendar. Use it.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Every insurance product has a renewal cycle. Every renewal is a re-buying opportunity. The aged-lead operators who get rich understand this.")}
${para("After Day 14, 85%+ of your aged leads won't have closed. Your job is to stay present until their renewal cycle, life event, or carrier behavior creates a new window.")}
${heading("Nurture triggers by line")}
${list([
  "<strong>Auto</strong> — reach out 30 days before renewal (6 or 12 months from original policy)",
  "<strong>Home</strong> — start of hurricane/wildfire season + premium-adjustment letter window (60–90 days pre-renewal)",
  "<strong>Term life</strong> — life events (new baby, home purchase, kid aging out)",
  "<strong>Final expense</strong> — anniversary only. Very soft.",
  "<strong>Medicare</strong> — AEP (Oct 15–Dec 7). Pre-warm every Cold lead in September.",
  "<strong>Health (ACA)</strong> — OEP (Nov 1–Jan 15) + SEP triggers (job change, move, income change)",
])}
${heading("Your move this week")}
${list([
  "Worksheet 6 — map your database into Warm/Cold/Dormant",
  "Build a 6+ piece nurture content library",
  "Set calendar triggers tied to renewal cycles, AEP, and OEP",
])}
${para("Day 10: compliance. In insurance, compliance failures end careers. Don't skim it.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Every insurance product has a renewal cycle. Every renewal is a re-buying opportunity.

After Day 14, 85%+ won't close. Your job: stay present until the next trigger.

Triggers by line:
- Auto: 30 days before renewal
- Home: hurricane/wildfire season + pre-renewal letter window
- Term life: life events (baby, home, kid aging out)
- Final expense: anniversary only. Soft.
- Medicare: AEP (Oct 15–Dec 7). Pre-warm Cold leads in September.
- Health (ACA): OEP + SEP triggers

This week:
1. Worksheet 6 — map buckets
2. 6+ nurture pieces
3. Set renewal/AEP/OEP triggers

Day 10: compliance.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email5: CourseEmail = {
  day: 10,
  subject: "The compliance rules that will save your career",
  preheader: "State DOI, Medicare CMS, final expense senior rules.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Insurance compliance is layered — federal TCPA on the outreach side, state DOI licensing on the sales side, CMS for Medicare, UDAP-style for senior products. Mess up any layer and your career is done.")}
${heading("Core non-negotiables")}
${list([
  "<strong>DNC scrub</strong> every list, every time. Federal + state.",
  "<strong>State DOI licensing</strong> before calling into any state.",
  "<strong>Run Mode A on inherited consent.</strong> Manual dial, plain-text email. Save SMS and automation for fresh-PEWC prospects (Fresh-Consent Ladder).",
  "<strong>Medicare = separate workflow.</strong> SOA forms, recorded telephonic enrollment, CMS disclaimers. Heavily audited.",
  "<strong>Final expense — UDAP hygiene.</strong> No implied urgency. No government-endorsement language.",
  "<strong>Call windows:</strong> 8 AM–9 PM federal, 8 PM cap in FL/OK/WA/MD.",
])}
${para("<strong>Note on the FCC 1:1 rule:</strong> vacated Jan 2025, repealed Aug 2025. PEWC is the standard. Safest posture: earn fresh consent yourself.")}
${para("When you have a real compliance question, the firm I trust is <a href=\"https://www.henson-legal.com/\" style=\"color:#2563eb;text-decoration:underline;font-weight:600;\">Henson Legal</a>. For Medicare, also engage a CMS-literate attorney — the Medicare Marketing Guidelines refresh annually.")}
${heading("Your move this week")}
${list([
  "Worksheet 8 — run a compliance self-audit",
  "Medicare: confirm your SOA + recorded-enrollment infrastructure",
  "Final expense: audit scripts for urgency + government-endorsement language",
  "Build one Fresh-Consent Ladder play for your line",
])}
${heading("The 90-day diagnostic")}
${para("Worksheet 10 is a 25-question self-assessment. Score honestly. 85+ is operator level. Under 65 means install basics before scaling.")}
${heading("Your next move")}
${para("Start with a test batch. Auto/home: 500–1,000 leads. Medicare: build a list 60 days pre-AEP. Final expense: 250–500 is enough to validate your soft-tone cadence.")}
${affiliateCtaBlock("insurance", 5)}
${para("You're on the Tuesday list now. One tactical idea a week.")}
${para("Go write policies.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Last email. Insurance compliance is layered.

Core non-negotiables:
1. DNC scrub every list.
2. State DOI licensing before calling.
3. Mode A on inherited consent. SMS/automation only on fresh PEWC.
4. Medicare = separate workflow. SOA + recorded enrollment.
5. Final expense — no urgency, no government-endorsement language.
6. Call windows: 8 AM–9 PM federal, 8 PM cap in FL/OK/WA/MD.

FCC 1:1 rule vacated Jan 2025, repealed Aug 2025. PEWC is live standard.

Counsel recommendation: Henson Legal (https://www.henson-legal.com/). Medicare questions: add CMS-literate attorney.

This week:
1. Worksheet 8 compliance audit
2. Medicare: confirm SOA infrastructure
3. Final expense: audit scripts
4. Build one Fresh-Consent Ladder play

90-day diagnostic (Worksheet 10):
85+ operator, 65-84 fix lowest, <65 install basics.

Test batch:
Auto/home: 500-1,000 leads
Medicare: 60 days pre-AEP
Final expense: 250-500 soft

See aged insurance leads:
https://agedleadstore.com/all-lead-types/?utm_source=agedleadsales&utm_medium=email&utm_campaign=flagship-insurance&utm_content=email-5

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

export const insuranceCourse: CourseModule = {
  vertical: "insurance",
  verticalLabel: "Insurance",
  emails: [email1, email2, email3, email4, email5],
};
