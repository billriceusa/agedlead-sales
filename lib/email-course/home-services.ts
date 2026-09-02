import type { CourseModule, CourseEmail } from "./types";
import {
  renderShell,
  greet,
  para,
  heading,
  list,
  signoff,
  affiliateCtaBlock,
  affiliateCtaText,
} from "./shared";

const email1: CourseEmail = {
  day: 0,
  subject: "Your playbook's in. Here's where to start.",
  preheader: "Why aged home-services leads book more estimates than fresh ones.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Bill Rice here. Your <strong>Aged Lead Operator's System — Home Services Edition</strong> and <strong>Workbook</strong> are linked below.")}
${para("The mindset shift most home-services owners need:")}
${para("<strong>The house is the same house it was 90 days ago — and the roof is 90 days older.</strong>")}
${para("Every problem that pushed the prospect to shop originally — aging roof, rising utility bill, failing HVAC — got worse while they procrastinated. When you re-open the conversation, you catch them at the point where the problem has become undeniable.")}
${para("At 15% contact, 20% appt rate, 30% close, $4,500 ARPC — a $5 aged roofing lead produces a $555 cost-per-sold-job. ~8× ROI on lead spend.")}
${heading("Your first move this week")}
${list([
  "Read Part I and II of the playbook (~20 min)",
  "Fill out Worksheet 1 (Unit Economics) — use your actual average job size",
  "Skim the sub-vertical section for your line (roofing, solar, windows, HVAC, remodel, pest, foundation)",
])}
${para("Tomorrow: tech stack and field-crew capacity planning.")}
${affiliateCtaBlock("home-services", 1)}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Bill Rice. Your Home Services Edition playbook + Workbook are linked below.

Mindset: the house is the same house it was 90 days ago — and the roof is 90 days older. Every problem that pushed the prospect to shop got worse while they procrastinated. When you re-open, you catch them at the point the problem became undeniable.

15% contact × 20% appt × 30% close × $4,500 ARPC on $5 aged lead = $555 cost-per-sold-job. ~8× ROI.

This week:
1. Read Part I and II
2. Worksheet 1 (Unit Economics) — actual average job size
3. Skim sub-vertical section for your line

Tomorrow: tech + field capacity.

${affiliateCtaText("home-services", 1)}

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email2: CourseEmail = {
  day: 2,
  subject: "Lead volume = field-crew bookings — size accordingly",
  preheader: "The tech stack comes second. Your estimator calendar comes first.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Home services is the one vertical where tech stack is the #2 question. #1 is <strong>estimator capacity</strong>.")}
${para("If your lead volume produces 40 booked estimates a week and you only have 2 estimators, you have bottlenecked your operation before the first lead hits the CRM.")}
${heading("Start with capacity math")}
${list([
  "How many estimates can each field rep run per week? (typical: 8–15)",
  "How many reps do you have available?",
  "Weekly appointment ceiling = reps × estimates/week",
  "Weekly jobs sold = appointments × appt-to-sold rate",
  "Annual revenue ceiling = weekly jobs × ARPC × 52",
])}
${para("<strong>If field capacity caps revenue below your business goals, hiring estimators comes before buying more leads.</strong>")}
${heading("Tech stack tiers")}
${list([
  "<strong>Setup A</strong> (under 500 leads/mo): VoIP + SMS + Sheet + Google Calendar, ~$50/mo",
  "<strong>Setup B</strong> (500–5,000 leads/mo): CRM w/ scheduling integration (Jobber, Housecall Pro, ServiceTitan, Close), $200–$600/mo",
  "<strong>Setup C</strong> (5,000+ leads/mo): Field-service platform + dispatch, $500–$1,500+/mo per rep",
])}
${para("<strong>Home services-specific:</strong> even in Setup A, invest in automated appointment reminders. No-show rate drops from 20–30% to 5–10%. On a $4,500 ARPC and 30% close rate, every saved no-show is worth ~$500.")}
${heading("Your move this week")}
${list([
  "Worksheet 2 — pick your tier",
  "Calculate your field-capacity ceiling",
  "If lead volume would overwhelm capacity, adjust purchase plan",
])}
${para("Day 4: scripts. Home services has a specific funnel dynamic most playbooks miss.")}
${affiliateCtaBlock("home-services", 2)}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Home services: tech stack is #2. Estimator capacity is #1.

40 booked estimates/week with 2 estimators = bottleneck before the first lead hits CRM.

Capacity math:
- Estimates per rep per week (typical 8-15)
- Reps available
- Weekly ceiling = reps × estimates
- Weekly jobs = appointments × close rate
- Annual ceiling = weekly jobs × ARPC × 52

If capacity caps revenue, hire estimators before buying more leads.

Tiers:
A (<500 leads/mo): VoIP + Sheet + Calendar, ~$50/mo
B (500-5,000): CRM + scheduling (Jobber, Housecall Pro, ServiceTitan), $200-$600/mo
C (5,000+): Field-service platform, $500-$1,500+/mo per rep

Home services-specific: automated appointment reminders drop no-show from 25% to 8%.

This week:
1. Worksheet 2 — pick tier
2. Calculate capacity ceiling
3. Adjust purchase plan if capacity-bound

Day 4: scripts.

${affiliateCtaText("home-services", 2)}

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email3: CourseEmail = {
  day: 4,
  subject: "The one rule of home-services outbound",
  preheader: "Never try to close on the call. Always book the estimate.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("The biggest mistake new home-services operators make on aged leads: they try to close on the phone.")}
${para("<strong>You cannot sell a roof, a solar system, or a kitchen remodel over the phone.</strong> Your prospect cannot make a $4K, $15K, or $25K decision based on a voice on the line. The goal of the call is <strong>one thing</strong>: book the estimate.")}
${heading("Opener — roofing example")}
${para('<em>"Hey [Name], Bill with [Company]. A couple months back you looked at getting quotes on your roof — just checking in. Did you get it handled, or is your insurance still dragging on the claim?"</em>')}
${para("If 'still dragging' or 'haven't moved yet':")}
${para('<em>"Totally get it. Can we get someone out there next week for a fresh look and a real number? Free estimate, 30 minutes, no pressure — worst case you get a second opinion."</em>')}
${para("<strong>Book the appointment. Don't explain more.</strong>")}
${heading("Sub-vertical variants")}
${list([
  "<strong>Solar</strong> — payback hook: \"Utility rates up [%] since you last looked. Payback's shortened. Run fresh numbers on your address?\"",
  "<strong>Windows</strong> — financing: \"Got a [financing offer] running through [date]. Get on the schedule before slots fill?\"",
  "<strong>HVAC</strong> — pre-season: \"Heading into [season], install slots fill. Want to get on the schedule?\"",
  "<strong>Remodel</strong> — soft: \"Long cycle — totally get it. Want a fresh look when you're ready?\"",
])}
${heading("Your move this week")}
${list([
  "Worksheet 5 — customize your opener + book-the-estimate language",
  "Rehearse until automatic",
  "Load the 14-day cadence (Worksheet 6)",
])}
${para("<strong>The neighborhood play:</strong> when you book a job on a street, soft-touch every aged lead in that zip. Highest-converting outreach play in home services.")}
${para("Day 7: turning unreached aged leads into next year's pipeline.")}
${affiliateCtaBlock("home-services", 3)}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Biggest mistake: trying to close on the phone. You cannot sell a $4K-$25K project over the phone.

Goal of the call: book the estimate.

Roofing opener:
"Hey [Name], Bill with [Company]. A couple months back you looked at quotes on your roof — did you get it handled, or is insurance still dragging?"

If still dragging: "Can we get someone out next week for a fresh look? Free estimate, 30 min, no pressure."

Book the appointment. Don't explain more.

Variants:
- Solar: payback hook
- Windows: financing hook
- HVAC: pre-season slot hook
- Remodel: soft "when you're ready"

This week:
1. Worksheet 5 — customize
2. Rehearse
3. Load cadence (Worksheet 6)

Neighborhood play: soft-touch every aged lead in a zip when you book a job there. Highest-converting outreach in home services.

Day 7: nurture.

${affiliateCtaText("home-services", 3)}

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email4: CourseEmail = {
  day: 7,
  subject: "Your aged leads are next spring's pipeline",
  preheader: "Home services has the best nurture ROI in the industry — if you run it.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("After Day 14, 80–90% of your aged home-services leads won't have booked an estimate. This is where the long-term money hides.")}
${para("<strong>Home services nurture ROI is extraordinary.</strong> Projects have long decision cycles. Seasonal cycles. Life-event triggers. Leads you don't close in the first 14 days routinely convert 6–18 months later when the right trigger fires.")}
${heading("Three-bucket system")}
${list([
  "<strong>Warm:</strong> responded but didn't book. 2-week cadence for 3 months.",
  "<strong>Cold:</strong> didn't respond, didn't opt out. Touches at Month 1, 3, 6, 9, 12.",
  "<strong>Dormant:</strong> 12+ months silent. Monthly newsletter only.",
])}
${heading("Home-services-specific triggers")}
${list([
  "<strong>Seasonal.</strong> Spring roofing. Summer HVAC. Fall windows. Winter pest prevention.",
  "<strong>Storms.</strong> Hail in a zip → touch every roofing lead in that zip (check state storm-chaser moratorium first).",
  "<strong>Utility rate moves.</strong> Fire solar nurture when the utility raises rates.",
  "<strong>Financing shifts.</strong> New promo? Touch every aged remodel/window/solar lead.",
  "<strong>Neighborhood proof.</strong> Complete a job on a street → touch every aged lead within half a mile.",
])}
${para("<strong>Build a zip-keyed nurture database.</strong> The neighborhood-proof play produces 15–25% lift on its own.")}
${heading("Your move this week")}
${list([
  "Worksheet 6 — classify your database into Warm/Cold/Dormant",
  "Build 6+ nurture content pieces",
  "Set up zip-keyed nurture to automate the neighborhood touch",
])}
${para("Day 10: compliance. State-specific rules and post-storm moratoriums will bite you if you're not watching.")}
${affiliateCtaBlock("home-services", 4)}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

After Day 14, 80-90% won't have booked an estimate. Long-term money hides here.

Home services nurture ROI is extraordinary. Projects have long cycles. Seasonal triggers. Life events. Leads convert 6-18 months later.

Three-bucket system:
- Warm: responded, didn't book. 2-week cadence, 3 months.
- Cold: no response, no opt-out. Touches Month 1/3/6/9/12.
- Dormant: 12+ months. Monthly newsletter only.

Triggers:
- Seasonal (spring roofing, summer HVAC, fall windows)
- Storms (check moratoriums first)
- Utility rate moves (solar)
- Financing shifts
- Neighborhood proof (complete a job → touch every aged lead in half-mile radius)

Build zip-keyed nurture database. Neighborhood-proof play = 15-25% lift.

This week:
1. Worksheet 6 — classify database
2. 6+ content pieces
3. Zip-keyed nurture

Day 10: compliance.

${affiliateCtaText("home-services", 4)}

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

const email5: CourseEmail = {
  day: 10,
  subject: "The home-services compliance rules that matter",
  preheader: "TCPA, storm moratoriums, state contractor rules, financing disclosures.",
  buildHtml: (ctx) =>
    renderShell({
      ctx,
      bodyHtml: `
${para(greet(ctx.firstName))}
${para("Home services compliance is specific — different from financial services in important ways.")}
${heading("Core non-negotiables")}
${list([
  "<strong>DNC scrub</strong> every list. Federal + state. Home services is heavily targeted by TCPA plaintiff firms.",
  "<strong>Post-storm moratoriums.</strong> FL, TX, LA restrict roofing solicitation after declared disasters.",
  "<strong>State contractor-board rules.</strong> CA, TX, FL, NY have specific rules on solicitation, 'free inspection' language, and gift-for-appointment.",
  "<strong>'Free estimate' not 'free inspection.'</strong> 'Inspection' can trigger solicitation rules.",
  "<strong>Financing disclosures.</strong> 'Free financing' or specific rates trigger Regulation Z.",
  "<strong>Run Mode A on inherited consent.</strong> Manual dial, plain-text email. SMS only after fresh PEWC via Fresh-Consent Ladder.",
  "<strong>No predictive/parallel dialing. No ringless voicemail.</strong> FCC ruled in 2022 that RVM to cell phones requires consent.",
  "<strong>Call windows:</strong> 8 AM–9 PM federal, 8 PM cap in FL/OK/WA/MD.",
  "<strong>D2D overlap.</strong> Local permits, 'no soliciting' signs, federal 3-day cooling-off on in-home sales $25+.",
])}
${para("<strong>Note on the FCC 1:1 rule:</strong> vacated Jan 2025, repealed Aug 2025. PEWC is the standard. Earn fresh consent.")}
${para("When you have a compliance question, the firm I trust is <a href=\"https://www.henson-legal.com/\" style=\"color:#2563eb;text-decoration:underline;font-weight:600;\">Henson Legal</a>. Pair with a state contractor-board attorney for each state you operate.")}
${heading("Your move this week")}
${list([
  "Worksheet 8 — compliance self-audit in Mode A",
  "FL/TX/LA: set up storm-moratorium tracker",
  "Audit scripts for 'free inspection' + undisclosed financing terms",
  "Build one Fresh-Consent Ladder play — start with the estimate-booking form",
])}
${heading("The 90-day diagnostic")}
${para("Worksheet 10 is a 25-question self-assessment. 85+ operator level. Under 65 means install basics.")}
${heading("Your next move")}
${para("Start tight: single-zip or multi-zip cluster. 250–500 aged leads per rep per month is the right opening volume.")}
${affiliateCtaBlock("home-services", 5)}
${para("You're on the Tuesday list. One tactical idea a week.")}
${para("Go book some estimates.")}
${signoff()}
`,
    }),
  buildText: (ctx) => `${greet(ctx.firstName)}

Last email. Home services compliance.

Core non-negotiables:
1. DNC scrub every list. Federal + state.
2. Post-storm moratoriums (FL, TX, LA).
3. State contractor-board rules (CA, TX, FL, NY).
4. "Free estimate" not "free inspection."
5. Financing disclosures trigger Reg Z.
6. Mode A on inherited consent. SMS only after fresh PEWC.
7. No predictive/parallel dialing. No RVM.
8. Call windows: 8 AM-9 PM federal, 8 PM cap in FL/OK/WA/MD.
9. D2D: local permits, 3-day cooling-off.

FCC 1:1 rule vacated Jan 2025. PEWC is standard.

Counsel: Henson Legal (https://www.henson-legal.com/). Pair with state contractor-board attorney per state.

This week:
1. Worksheet 8 audit
2. Storm-moratorium tracker for FL/TX/LA
3. Audit scripts
4. Build estimate-booking form (Fresh-Consent Ladder Play 1)

90-day diagnostic (Worksheet 10): 85+ operator, <65 install basics.

Start tight: single-zip cluster, 250-500 aged leads per rep per month.

See aged home services leads:
https://agedleadstore.com/all-lead-types/?utm_source=workagedleads&utm_medium=email&utm_campaign=flagship-home-services&utm_content=email-5

Go book some estimates.

${affiliateCtaText("home-services", 5)}

— Bill

Playbook: ${ctx.playbookUrl}
Workbook: ${ctx.workbookUrl}
Unsubscribe: ${ctx.unsubscribeUrl}
`,
};

export const homeServicesCourse: CourseModule = {
  vertical: "home-services",
  verticalLabel: "Home Services",
  emails: [email1, email2, email3, email4, email5],
};
