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
  preheader: "The #1 reason most people lose money on aged mortgage leads.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Bill Rice here. Your <strong>Aged Lead Operator's System — Mortgage Edition</strong> is linked at the bottom of this email, along with your <strong>Workbook</strong>.")}
${para("Before you open either one, the mindset:")}
${para("<strong>Aged leads are an arbitrage on sales-team attention span.</strong>")}
${para("Every refi shopper who filled out a form 3 months ago got called by the original buyer 2–3 times. When those calls didn't connect, that LO moved on. The prospect's intent didn't evaporate — their phone just stopped ringing. Your job is to be the phone that rings again, with a better script and a better cadence.")}
${para("At 15% contact rate and 4% contact-to-close, a $2 aged mortgage lead produces a $333 cost-per-funded loan. Against a $2,500 LO commission, that's a 7.5× return on lead spend. The math works.")}
${heading("Your first move this week")}
${list([
  "Read Part I and II of the playbook (~20 min)",
  "Fill out Worksheet 1 (Unit Economics) in the workbook (~10 min)",
  "Hit reply and tell me your max-viable CPL — I'll sanity-check it",
])}
${para("Tomorrow I'll send you the setup side — tech stack, operational flow, and the cheapest way to get running.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Bill Rice here. Your Aged Lead Operator's System — Mortgage Edition is attached. So is your Workbook.

Aged leads are arbitrage on sales-team attention span. Every refi shopper who filled out a form 3 months ago got called 2–3 times and dropped. Your job is to be the phone that rings again.

At 15% contact and 4% close, a $2 aged lead = $333 cost-per-funded-loan. Against $2,500 LO commission, that's 7.5× ROI. Math works.

This week:
1. Read Part I and II of the playbook
2. Fill out Worksheet 1 (Unit Economics)
3. Reply with your max-viable CPL — I'll sanity-check

Tomorrow: setup and tech stack.

— Bill

Downloads:
Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}

Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email2: CourseEmail = {
  day: 2,
  subject: "You don't need a $5K tech stack (actually, you shouldn't have one)",
  preheader: "The three tiers of an aged-lead operation — pick the right one.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("The biggest tech mistake I see in aged-lead operations: buying Setup C when you only need Setup A.")}
${para("Someone reads a LinkedIn post about an AI dialer, spends $3,000 setting it up, then dials 40 leads a day from it. They burned $3,000 on capacity they can't use.")}
${heading("Three tiers, three match points")}
${para("<strong>Setup A — No-tech</strong> (0–500 leads/mo, 1 rep)<br/>VoIP line ($15/mo) + SMS tool ($30/mo) + Google Sheet. Total: ~$50/mo. Runs a full aged-mortgage operation.")}
${para("<strong>Setup B — Light-tech</strong> (500–5,000 leads/mo, 1–5 reps)<br/>Dialer w/ recording + CRM (HubSpot/Close) + integrated SMS + <em>preview dialer only</em>. Total: $200–$400/mo per rep.")}
${para("<strong>Setup C — Full-tech</strong> (5,000+ leads/mo, 5+ reps)<br/>AI coaching, inbound routing, BI layer. $500–$1,200/mo per rep. Only worth it when your bottleneck is throughput.")}
${para("<strong>Critical:</strong> no predictive/parallel dialers on aged mortgage leads. The consent picture rarely supports it. Preview dial only.")}
${heading("Your move this week")}
${list([
  "Open Worksheet 2 and pick your tier honestly",
  "Define the metric that tells you to upgrade",
  "Even in Setup A, pay for a compliant DNC scrubber — mortgage is one of the most TCPA-targeted verticals",
])}
${para("Day 4's email: scripts. The exact words for your first call to a 90-day-old refi lead.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Biggest tech mistake I see: buying Setup C when you need Setup A.

Three tiers:

Setup A (0–500 leads/mo): VoIP + SMS + Google Sheet. ~$50/mo. Ships fast.
Setup B (500–5,000 leads/mo): CRM + preview dialer + SMS. $200–$400/mo per rep.
Setup C (5,000+ leads/mo): AI coaching, full stack. $500–$1,200/mo per rep.

Critical: no predictive/parallel dialers on aged mortgage leads. Preview only.

This week:
1. Worksheet 2 — pick your tier
2. Define upgrade trigger
3. Pay for DNC scrubber even in Setup A

Day 4: scripts.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email3: CourseEmail = {
  day: 4,
  subject: "The 14-day cadence for aged mortgage leads",
  preheader: "Most LOs quit after 2 calls. Winners run 14 days of multi-channel touches.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Today's the meat of the playbook: the 14-day opener cadence.")}
${para("Single-channel outreach on aged mortgage leads is malpractice. <strong>Multi-channel over 14 days beats 14 calls on one channel, every time.</strong>")}
${heading("The cadence at a glance")}
${list([
  "Day 1: Call (AM) + voicemail + SMS",
  "Day 2: Email",
  "Day 3: Call (PM) + SMS",
  "Day 5: Call (evening) + Email",
  "Day 7: Call (AM, new day of week) + break-up SMS",
  "Day 10: Break-up email",
  "Day 14: Final call — then move to nurture",
])}
${heading("The opener that converts")}
${para('<em>"Hey [Name], this is Bill with [Company]. A couple months back you looked at refinancing — rates have moved since then, and I wanted to see if you\'re still thinking about it or if you got it handled."</em>')}
${para("Shut up. Wait for the answer.")}
${para("If they say 'still looking': <strong>go straight to diagnosis</strong> — 'What rate would make it worth moving?'")}
${para("If they say 'got it handled': probe — 'Nice, who'd you end up with?' Half the time, 'handled' means 'I didn't do anything.'")}
${heading("Your move this week")}
${list([
  "Open Worksheet 5 — customize the script to your name, company, and vertical",
  "Say it out loud 5 times",
  "Load the 14-day cadence into your CRM or sheet",
])}
${para("Have Freddie Mac PMMS open during every dial. Rate-move scripts only work with current data.")}
${para("Day 7: what to do with the 85% who don't close in the first 2 weeks.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

14-day opener cadence is the meat of the playbook.

Single-channel outreach is malpractice. Multi-channel over 14 days beats 14 calls on one channel.

Cadence:
Day 1: Call (AM) + voicemail + SMS
Day 2: Email
Day 3: Call (PM) + SMS
Day 5: Call (evening) + Email
Day 7: Call + break-up SMS
Day 10: Break-up email
Day 14: Final call, then nurture

The opener:
"Hey [Name], Bill with [Company]. A couple months back you looked at refinancing — rates have moved since then, and I wanted to see if you're still thinking about it or got it handled."

Shut up. Wait.

Still looking → "What rate would make it worth moving?"
Got it handled → "Nice, who'd you end up with?" (Half the time they didn't do anything.)

This week:
1. Worksheet 5 — customize scripts
2. Say out loud 5×
3. Load cadence into CRM

Have Freddie Mac PMMS open during every dial.

Day 7: nurture.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email4: CourseEmail = {
  day: 7,
  subject: "The 85% that pays your rent",
  preheader: "Most LOs abandon non-closers after Day 14. Here's what to do instead.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("After 14 days of your opener cadence, 85–90% of your aged mortgage leads will not have closed. This is where most LOs make their biggest mistake: they <strong>abandon the 85%</strong>.")}
${para("If you buy 1,000 aged mortgage leads/month and abandon 90% after Day 14, you accumulate zero long-term asset. After 12 months you have nothing but a dialer log.")}
${para("If instead you nurture the 90%, after 12 months you have a database of 10,800 prospects. <strong>A 1% annual close rate on that database is 108 funded loans at near-zero marginal cost.</strong>")}
${heading("Three-bucket nurture")}
${list([
  "<strong>Warm</strong> — responded to opener but didn't close. 2-week cadence for 3 months.",
  "<strong>Cold</strong> — didn't respond, didn't opt out. Touches at Month 1, 3, 6, 9, 12.",
  "<strong>Dormant</strong> — 12+ months silent. Monthly newsletter only.",
])}
${para("<strong>For mortgage specifically:</strong> your best nurture trigger is a meaningful rate move. When 30-year fixed drops 0.25%+ in a month, reach out to every Cold and Dormant lead. Keep it factual: 'Rates dropped meaningfully since you shopped. Worth revisiting your numbers?'")}
${heading("Your move this week")}
${list([
  "Worksheet 6 — map every non-closed lead into Warm/Cold/Dormant",
  "Build your 6-piece nurture content library",
  "Set Freddie Mac PMMS rate-move alerts",
])}
${para("Day 10: compliance. The stuff that either kills your operation or becomes your moat.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

After 14 days, 85-90% of aged mortgage leads won't have closed. Most LOs abandon them. That's their biggest mistake.

1,000 leads/month × 90% abandoned × 12 months = nothing.
1,000 leads/month × 90% nurtured × 12 months = 10,800-person asset. 1% annual close = 108 loans.

Three-bucket system:
- Warm: responded but didn't close. 2-week cadence for 3 months.
- Cold: no response, no opt-out. Touches at Month 1/3/6/9/12.
- Dormant: 12+ months silent. Monthly newsletter only.

Best mortgage nurture trigger: rate move of 0.25%+. Reach out to every Cold/Dormant lead.

This week:
1. Worksheet 6 — map into buckets
2. Build 6-piece content library
3. Set Freddie Mac alerts

Day 10: compliance.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email5: CourseEmail = {
  day: 10,
  subject: "Your playbook is only as good as your compliance",
  preheader: "DNC, TCPA, state mini-TCPAs — the rules that keep your operation alive.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Last email. I'll close with the least-fun but most important topic: compliance.")}
${heading("Mortgage compliance non-negotiables")}
${list([
  "<strong>DNC scrub</strong> every list. Federal + state. Skip and it's $500–$1,500+ per call in damages.",
  "<strong>NMLS disclosure</strong> on every outbound call. Write it into every script.",
  "<strong>Run Mode A on inherited consent.</strong> Manual dial, plain-text email. Save SMS and automation for prospects who gave you <strong>fresh</strong> consent (Fresh-Consent Ladder, Part IV).",
  "<strong>Call windows:</strong> 8 AM–9 PM federal, 8 PM cap in FL, OK, WA, MD (and others).",
  "<strong>State call caps:</strong> Florida FTSA and Oklahoma OTSA cap at 3 calls/texts per day per subject.",
  "<strong>UDAAP hygiene.</strong> No 'rates are about to explode' on quiet days. Plain English, accurate numbers.",
])}
${para("<strong>Note on the FCC 1:1 rule:</strong> vacated by the 11th Circuit Jan 2025, repealed by the FCC Aug 2025. PEWC is the live standard. Safest move: earn fresh consent yourself (Ladder Plays 1–6).")}
${para("When you have a real compliance question, the firm I trust is <a href=\"https://www.henson-legal.com/\" style=\"color:#2563eb;text-decoration:underline;font-weight:600;\">Henson Legal</a>. Budget $300–$500 for an initial consult before you run your first campaign — it's the best compliance dollar you'll spend.")}
${heading("The 90-day diagnostic")}
${para("Worksheet 10 is a 25-question self-assessment out of 100. Score honestly.")}
${list([
  "<strong>85+</strong> — operator level",
  "<strong>65–84</strong> — fix your lowest dimension this quarter",
  "<strong>Under 65</strong> — install basics before scaling",
])}
${heading("Your next move")}
${para("When you're ready to run leads, start with 500–1,000 aged mortgage leads — enough volume to measure, not so much that a bad assumption hurts.")}
${affiliateCtaBlock("mortgage", 5)}
${para("You're on the Tuesday list now. One tactical idea every week. Short, useful.")}
${para("Go fund some loans.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Last email. Compliance.

Mortgage non-negotiables:
1. DNC scrub every list. Federal + state.
2. NMLS disclosure on every call.
3. Run Mode A on inherited consent. Manual dial, plain-text email. Save SMS/automation for fresh PEWC.
4. Call windows: 8 AM–9 PM federal, 8 PM cap in FL/OK/WA/MD.
5. State caps: FL/OK 3 calls/texts per day per subject.
6. UDAAP hygiene — plain English, no hype.

On the FCC 1:1 rule: vacated Jan 2025, FCC repealed Aug 2025. PEWC is the standard. Earn fresh consent.

Counsel recommendation: Henson Legal (https://www.henson-legal.com/). Budget $300-500 for initial consult.

90-day diagnostic (Worksheet 10):
- 85+: operator level
- 65-84: fix lowest dimension
- Under 65: install basics first

Next move: test batch of 500-1,000 aged mortgage leads.

See aged mortgage leads:
https://agedleadstore.com/all-lead-types/?utm_source=workagedleads&utm_medium=email&utm_campaign=flagship-mortgage&utm_content=email-5

You're on the Tuesday list. Go fund some loans.

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

export const mortgageCourse: CourseModule = {
  vertical: "mortgage",
  verticalLabel: "Mortgage",
  emails: [email1, email2, email3, email4, email5],
};
