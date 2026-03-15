import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function block(text, style = "normal") {
  return { _type: "block", _key: k(), style, markDefs: [], children: [{ _type: "span", _key: k(), text, marks: [] }] };
}
function h2(text) { return block(text, "h2"); }
function h3(text) { return block(text, "h3"); }
function k() { return Math.random().toString(36).slice(2, 10); }
function ref(id) { return { _type: "reference", _ref: id, _key: k() }; }

const posts = [
  // ── WEEK 1, Monday ──
  {
    _id: "post-direct-mail-aged-leads-playbook",
    _type: "post",
    title: "The Direct Mail Playbook for Aged Leads: Letters, Postcards & Yellow Letters",
    slug: { _type: "slug", current: "direct-mail-aged-leads-playbook" },
    excerpt: "A complete guide to using direct mail with aged leads — yellow letters, postcards, and printed letters compared. Templates, timing, cost analysis, and A/B testing.",
    publishedAt: "2026-03-17T09:00:00Z",
    contentType: "pillar",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-strategies")],
    leadTypes: [ref("lt-final-expense"), ref("lt-insurance")],
    seo: { metaTitle: "Direct Mail Playbook for Aged Leads (2026)", metaDescription: "Yellow letters, postcards, and printed letters for aged leads. Templates, timing, cost analysis, and A/B testing from 20+ years of direct mail campaigns." },
    body: [
      block("In a world obsessed with digital outreach, direct mail is the most underrated channel for working aged leads. I've tested every channel over 20 years — phone, email, text, door knocking, and mail — and direct mail consistently produces the highest ROI per dollar spent when used as part of a multi-channel cadence."),
      block("Why? Because nobody else is doing it. Your aged lead prospect gets 30 robocalls a day but one personalized letter a month. The letter gets opened. The robocall gets ignored. That's your competitive advantage in a single envelope."),

      h2("Three Formats Compared"),
      block("Not all direct mail is created equal. The format you choose dramatically affects your open rate, response rate, and cost per response."),

      h3("Yellow Letters"),
      block("A yellow letter is a handwritten or handwritten-style letter on yellow legal pad paper, stuffed in a hand-addressed envelope. It looks like personal mail, not marketing — and that's the point."),
      block("Open rate: 80-90% (people open handwritten-looking mail). Response rate: 3-5% (they call you or answer when you call). Cost per piece: $1.50-$3.00 including postage. Best for: final expense, senior market, and any audience that values personal touch."),
      block("The trade-off is cost and time. Real handwriting at scale is impractical. Handwriting-font printing services exist but the quality varies. If you're doing fewer than 200 pieces per batch, genuinely handwrite them — the results justify the time."),

      h3("Postcards"),
      block("Postcards are the volume play. They're cheap to print and mail, require no envelope, and can be professionally designed to look sharp."),
      block("Open rate: 100% (no envelope to open). Response rate: 1-2%. Cost per piece: $0.50-$1.00 including postage. Best for: solar, home improvement, and any vertical where a visual (before/after, savings chart) tells the story."),
      block("The downside: postcards feel like marketing. They don't have the personal warmth of a letter. For senior markets (final expense, Medicare), a letter almost always outperforms a postcard."),

      h3("Printed Letters"),
      block("A professionally printed letter in a standard #10 envelope. More scalable than yellow letters, more personal than postcards."),
      block("Open rate: 40-60%. Response rate: 1-3%. Cost per piece: $0.75-$1.50 including postage. Best for: mortgage, insurance, and any vertical where you need to convey credibility and professionalism."),
      block("Tip: use a real stamp instead of a postage meter. Hand-address the envelope or use a handwriting-font print. Include your business card. These details push open rates from 40% toward 60%."),

      h2("Copy Templates"),
      block("The copy on your mailer determines whether the recipient calls you, saves it for later, or tosses it. Here's what works:"),

      h3("Yellow Letter Template (Final Expense)"),
      block("\"Dear [Name], I'm writing because I help families in [City] with final expense planning. I noticed you'd looked into coverage a while back, and I wanted to make sure you were able to get what you needed. If you'd like to chat, I'm local — just call me at [Number]. No pressure at all. — [Your Name]\""),
      block("Why it works: short, personal, specific to their city, references their original inquiry, low-pressure, provides a clear next step."),

      h3("Postcard Template (Solar)"),
      block("Front: Bold headline — \"Still paying [Utility Company] $200+/month?\" with a simple before/after chart showing electric bill with and without solar. Back: \"[Name], you looked into solar options for your home — and the incentives have gotten even better since then. The federal tax credit covers 30% of your installation cost. Call [Number] for a free savings estimate. — [Your Name], Local Solar Specialist\""),

      h3("Printed Letter Template (Mortgage)"),
      block("\"Dear [Name], I'm reaching out because you explored mortgage options a while back, and rates have changed since then. Current 30-year fixed rates are in the [X.X%] range — and depending on your situation, that could mean significant savings on your monthly payment. I'd love to run a quick comparison for you at no cost or obligation. You can reach me directly at [Number] or reply to this letter. Best regards, [Your Name], [Title], NMLS# [Number]\""),

      h2("Timing: When to Mail"),
      block("Direct mail should be the FIRST touch in your cadence, not the last. Mail arrives 2-3 business days after sending. Plan your mailing so the letter arrives before your first phone call."),
      block("My recommended sequence: Day 0 — mail the letter. Day 3-4 — first phone call (letter has arrived). Day 5 — email. Day 7 — second phone call. Day 10 — door knock or second email."),
      block("When you call and say \"Hi [Name], this is [Your Name] — I sent you a letter earlier this week about [topic]\" — recognition jumps. You're no longer a stranger. You're the person who sent that letter. This recognition alone can double your phone contact-to-conversation rate."),

      h2("Cost Analysis and ROI"),
      block("Let's run the math on a 500-piece yellow letter campaign for final expense aged leads:"),
      block("Lead cost: 500 leads × $1.50 = $750. Mailing cost: 500 pieces × $2.50 = $1,250. Total investment: $2,000. Response rate: 4% = 20 inbound calls. Close rate of responders: 30% = 6 policies. Average annual premium: $600 × 9-month advance = $3,240 per policy. Total commission: $3,240 × 6 = $19,440. ROI: 872%."),
      block("Even if your numbers are half of these, the ROI is still exceptional. Direct mail works because it creates inbound interest — prospects who call you are dramatically easier to close than prospects you cold call."),

      h2("A/B Testing Your Mailers"),
      block("Never assume your first mailer is your best mailer. Test one variable at a time:"),
      block("Test format first: yellow letter vs postcard vs printed letter. Same copy, same list, different format. Run 200 pieces of each and compare response rates."),
      block("Then test copy: once you know your best format, test different headlines, offers, or calls to action. Again, 200+ pieces per variation minimum for meaningful data."),
      block("Test timing last: try mailing on different days of the week. Tuesday/Wednesday mailings tend to arrive Thursday/Friday (before the weekend), which some agents find produces better response rates."),
      block("Track every response with a unique phone number or a \"mention this letter\" prompt so you know which variation generated each call."),
    ],
  },

  // ── WEEK 1, Wednesday ──
  {
    _id: "post-new-insurance-agent-aged-leads-first-90-days",
    _type: "post",
    title: "New Insurance Agent? Here's Your First 90 Days with Aged Leads",
    slug: { _type: "slug", current: "new-insurance-agent-aged-leads-first-90-days" },
    excerpt: "A month-by-month guide for new insurance agents building their business with aged leads — budget planning, script practice, CRM setup, and scaling.",
    publishedAt: "2026-03-19T09:00:00Z",
    contentType: "pillar",
    isFeatured: true,
    author: ref("author-bill-rice"),
    categories: [ref("cat-getting-started")],
    leadTypes: [ref("lt-insurance"), ref("lt-final-expense")],
    seo: { metaTitle: "New Insurance Agent: First 90 Days with Aged Leads", metaDescription: "Month-by-month guide for new insurance agents using aged leads. Budget planning, script practice, CRM setup, and scaling from 0 to consistent deals." },
    body: [
      block("Your first year as an insurance agent will define your career. Most new agents fail within 18 months — not because they can't sell, but because they run out of people to talk to. Their warm market dries up, real-time leads eat through their savings, and they quit before the pipeline matures."),
      block("Aged leads solve the pipeline problem for new agents better than any other lead source. At $0.25-$2 per lead, you can fill your calendar with prospects on a shoestring budget — and every call is real-world practice that makes you better. Here's the 90-day plan."),

      h2("Month 1: The Learning Month"),
      block("Goal: Make 1,000 dials, have 100 conversations, and learn what works. Don't worry about closing deals this month — worry about getting comfortable on the phone."),

      h3("Week 1-2: Setup"),
      block("Buy your first batch: 200 aged insurance leads at $1-$2 each ($200-$400 total). Choose one product type to start — auto and home are the simplest. Don't try to sell life, health, auto, and home simultaneously as a new agent. Pick one."),
      block("Set up a free or low-cost CRM. HubSpot's free tier works. So does a Google Sheet if you're truly bootstrapping. You need to track: lead name, phone number, date of each call attempt, outcome (no answer, voicemail, conversation, appointment, sold), and follow-up date."),
      block("Memorize your script. Not word-for-word — memorize the framework. You should be able to deliver your opener naturally without reading. Practice with a spouse, friend, or mirror until it sounds conversational, not scripted."),

      h3("Week 3-4: Volume Calling"),
      block("Dial 50-80 leads per day. That's 3-4 hours of focused calling. You'll reach 5-10 people per day at a ~12% contact rate. Most will say they're not interested or they already have coverage. That's fine — you're practicing."),
      block("After each day, log your numbers: total dials, contacts, conversations (lasted 60+ seconds), and any appointments or quotes run. By the end of Month 1, you'll have data on your actual contact rate and conversation rate."),
      block("Don't get discouraged by rejection. A 12% contact rate and 20% conversation rate means 80% of your dials go nowhere. That's normal. The 20% that turn into conversations are your opportunities — focus on making those conversations count."),

      h2("Month 2: The Optimization Month"),
      block("Goal: Close your first 3-5 deals and identify what's working."),
      block("Buy your second batch: 300-500 leads. You've earned this volume because you now know your numbers. If Month 1 showed a 12% contact rate and 15% conversation rate, you can predict your Month 2 results and set realistic goals."),
      block("Review your Month 1 data and identify patterns: What times of day produced the most conversations? Which script variations got the best responses? Which objections stumped you? Adjust accordingly."),
      block("Start adding email to your cadence. After every phone attempt that goes to voicemail, send a simple plain-text email: \"Hi [Name], I tried reaching you about your insurance coverage. If you have 2 minutes, I'd love to help you compare options. Reply to this email or call me at [Number]. — [Your Name]\""),
      block("By the end of Month 2, you should have your first closed deals. Even 2-3 policies prove the system works and give you confidence to scale."),

      h2("Month 3: The Scaling Month"),
      block("Goal: Establish a repeatable system that produces consistent weekly deals."),
      block("Increase your lead volume to 500-1,000 per month. Add a second product line — if you started with auto, add home insurance. If you started with final expense, add Medicare or standard life."),
      block("Add direct mail to your cadence. Send a personal letter to your next batch of leads BEFORE your first call. This pre-warming step increases your contact rate by 15-25% because prospects recognize your name when you call."),
      block("If your leads are local, start door knocking. Even 2-3 afternoons per week of knocking aged leads in your area will produce results that phone calls alone can't match — especially for final expense."),
      block("Build your weekly rhythm: Monday — mail prep and list review. Tuesday through Thursday — calling hours (9 AM - 12 PM, 2 PM - 5 PM). Friday — follow-ups, door knocking, and weekly number review."),

      h2("Budget Planning"),
      block("New agents need to think of aged leads as a business investment, not an expense. Here's a realistic budget breakdown:"),
      block("Month 1: $200-$400 in leads + $0-$50 for CRM = $200-$450 total. Month 2: $300-$500 in leads + $50-$100 for CRM/tools + $100-$200 for direct mail = $450-$800. Month 3: $500-$1,000 in leads + $100 for tools + $200-$400 for direct mail = $800-$1,500."),
      block("Total 90-day investment: $1,450-$2,750. If you close even 5-10 policies in 90 days at $300-$500 average commission, you've covered your investment and have a growing pipeline. By Month 4-6, the system should be self-funding — lead spend comes from commission income."),

      h2("Common New-Agent Mistakes"),
      block("Buying too many leads too soon. Start with 200. Prove you can work them before buying 1,000. Leads you don't call are wasted money."),
      block("Switching scripts every day. Pick one opener and use it for 200 leads before changing anything. You can't evaluate a script on 20 dials — you need 200 to see the real conversion rate."),
      block("Skipping the CRM. Without tracking, you don't know what's working. You'll call the same leads twice and miss follow-ups. The CRM is your operating system — don't skip it."),
      block("Giving up too early. Most new agents quit after 30 days if they haven't closed a deal. The first 30 days are learning days, not earning days. Commit to 90 days before evaluating whether aged leads work for you."),
      block("Calling without a plan. Don't sit down and randomly dial. Know exactly which leads you're calling, in what order, and what you'll say. Preparation is 20% of the work and produces 50% of the results."),
    ],
  },

  // ── WEEK 1, Friday ──
  {
    _id: "post-tcpa-compliance-calling-aged-leads",
    _type: "post",
    title: "TCPA Compliance When Calling Aged Leads: What You Need to Know",
    slug: { _type: "slug", current: "tcpa-compliance-calling-aged-leads" },
    excerpt: "Plain-English guide to TCPA compliance for aged leads — consent rules, manual vs auto dialing, DNC scrubbing, state-specific rules, and what to tell your compliance team.",
    publishedAt: "2026-03-21T09:00:00Z",
    contentType: "pillar",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-compliance")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-final-expense")],
    seo: { metaTitle: "TCPA Compliance for Aged Leads: What You Need to Know", metaDescription: "Plain-English TCPA guide for aged leads. Consent rules, manual vs auto dialing, DNC scrubbing, state-specific rules, and record-keeping requirements." },
    body: [
      block("TCPA compliance is the question I get asked most about aged leads: \"Can I legally call these people?\" The short answer is yes, with important caveats. The long answer requires understanding what the TCPA actually says, what \"consent\" means in the context of aged leads, and how your dialing method affects your compliance obligations."),
      block("I'm not a lawyer, and this isn't legal advice. But after 20+ years in the lead industry, I've worked closely with compliance teams and attorneys who specialize in this area. Here's what you need to know — in plain English."),

      h2("What the TCPA Actually Says"),
      block("The Telephone Consumer Protection Act (1991, amended multiple times) regulates how businesses can contact consumers by phone, text, and fax. The key provisions for lead callers:"),
      block("You cannot use an automatic telephone dialing system (ATDS) or pre-recorded voice to call a cell phone without prior express consent. \"Prior express consent\" means the consumer gave permission to be called — either by providing their phone number on a form or through a written agreement."),
      block("You must honor the National Do Not Call Registry. If a number is on the DNC list, you generally cannot call it for telemarketing purposes unless you have an established business relationship or prior express written consent."),
      block("You must identify yourself at the beginning of the call. State your name, the name of your company, and a phone number or address where you can be reached."),

      h2("The Consent Question for Aged Leads"),
      block("Here's where it gets nuanced. When a consumer fills out a form requesting insurance quotes, they typically give consent to be contacted by the companies associated with that form. The original lead buyers (real-time) are the clear beneficiaries of that consent."),
      block("When that lead is resold as an aged lead, the consent picture is murkier. The consumer consented to be contacted about insurance — but they consented to be contacted by specific companies or a network of companies, not necessarily by you, months later."),
      block("The safest approach: treat aged leads as cold outreach from a compliance perspective. This means manual dialing (no auto-dialers), DNC scrubbing before every campaign, and clear identification when you call. This approach eliminates virtually all TCPA risk."),

      h2("Manual Dialing vs Auto-Dialers"),
      block("This is the most critical compliance decision you'll make. If you dial each number manually (pressing each digit or clicking a button to initiate each individual call), you have far fewer TCPA restrictions. Manual dialing to cell phones does not require prior express consent under most interpretations of the law."),
      block("If you use an auto-dialer (ATDS) — any system that automatically dials numbers from a list without human intervention — you need prior express consent to call cell phones. For telemarketing calls specifically, you need prior express written consent."),
      block("Power dialers (where you click to call each number but the system queues them up) occupy a gray area. Some courts have ruled they're not ATDS; others disagree. Consult your compliance team about your specific system."),
      block("My recommendation: for aged leads, use manual dialing or a click-to-call system that requires human initiation for each call. The compliance risk of auto-dialers with aged leads is not worth the marginal efficiency gain."),

      h2("DNC Scrubbing: Non-Negotiable"),
      block("Before you call any batch of aged leads, scrub the list against the National Do Not Call Registry. This is not optional — it's a legal requirement for telemarketing calls. Violations can result in fines of $500-$1,500 per call."),
      block("How to scrub: Access the National DNC Registry at telemarketing.donotcall.gov. Download the DNC file for the area codes in your lead list. Use a scrubbing tool (many CRM platforms have this built in) to remove matching numbers."),
      block("Also maintain your own internal DNC list. If anyone you call says \"don't call me again\" or \"put me on your do not call list,\" you must honor that request immediately and permanently. Log it in your CRM."),
      block("Re-scrub every 31 days. The national registry is updated regularly, and numbers are added constantly. A clean list on March 1 may have new DNC numbers by April 1."),

      h2("State-Specific Rules"),
      block("Several states have calling regulations that go beyond the federal TCPA. These are the ones most relevant to aged lead callers:"),
      block("Florida: Requires registration as a telephone solicitor if making more than 250 calls per month. Restricted calling hours (8 AM - 8 PM local time). Additional consent requirements for certain types of calls."),
      block("California: The California Consumer Privacy Act (CCPA) gives consumers additional rights regarding their personal data. California also has its own DNC list. Calling hours restricted to 8 AM - 9 PM."),
      block("Other states with notable calling restrictions include Oklahoma, Indiana, Pennsylvania, and Wisconsin. Research the specific states where your leads are located before launching a campaign."),

      h2("Record-Keeping for Protection"),
      block("If you're ever questioned about your calling practices, records are your defense. Keep these records for at least 5 years:"),
      block("Your DNC scrubbing receipts (proof you scrubbed before each campaign). Your internal DNC list with dates each number was added. A log of every call attempt: date, time, number dialed, outcome, and who initiated the call. Proof that your dialing method was manual (if applicable)."),
      block("Your CRM should handle most of this automatically. If it doesn't, upgrade to one that does. The cost of a good CRM ($50-$100/month) is trivial compared to the cost of a single TCPA complaint."),

      h2("What to Tell Your Compliance Team"),
      block("If you work for an agency or organization with a compliance department, they'll want to know the answers to these questions before you start calling aged leads:"),
      block("What is the source of these leads? (Aged consumer data from opt-in web forms, purchased from a licensed data provider.) What consent exists? (Original form consent to the initial buyer; we treat outreach as cold calling with manual dialing.) How are you dialing? (Manual/click-to-call, not auto-dialed.) Have you scrubbed against DNC? (Yes, before every campaign.) What record-keeping is in place? (CRM tracks all attempts, DNC scrub receipts maintained.)"),
      block("Having clear answers to these questions — ideally documented in a written compliance plan — protects you, your agency, and demonstrates good faith compliance efforts."),
    ],
  },

  // ── WEEK 2, Monday ──
  {
    _id: "post-iul-leads-financial-advisors-playbook",
    _type: "post",
    title: "IUL Lead Conversion for Financial Advisors: The Consultative Approach",
    slug: { _type: "slug", current: "iul-leads-financial-advisors-playbook" },
    excerpt: "How financial advisors and life insurance agents can convert aged IUL leads using education-first selling — illustrations, comparisons, and the multi-meeting close.",
    publishedAt: "2026-03-24T09:00:00Z",
    contentType: "pillar",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-lead-types")],
    leadTypes: [ref("lt-iul")],
    seo: { metaTitle: "IUL Leads for Financial Advisors: Consultative Playbook", metaDescription: "How financial advisors convert aged IUL leads. Education-first approach, illustrations, retirement comparisons, and the multi-meeting sales cycle." },
    body: [
      block("IUL — Indexed Universal Life — is a fundamentally different sale than term life, final expense, or P&C insurance. The product is complex, the premiums are high, the commission is substantial, and the buyer is educated. You cannot call an aged IUL lead with a transactional script and expect to close. This is a consultative sale that requires 2-4 conversations and genuine expertise."),
      block("That's actually great news for agents who do the work. Because IUL is complex, most agents avoid it — which means less competition for the leads. And because aged IUL leads cost $1-$5 versus $30-$75 for real-time, the economics of building an IUL pipeline with aged leads are exceptional."),

      h2("Understanding the IUL Prospect"),
      block("People who research IUL are not typical insurance shoppers. They're typically: higher income ($75K-$250K+), ages 35-55, interested in tax-advantaged wealth building, already maxing out their 401(k) or seeking alternatives, and financially literate enough to understand cash value concepts."),
      block("This means your approach must match their sophistication. Don't explain what life insurance is. They already know. Instead, explain how IUL's cash value component works as a retirement supplement, how the index-linked growth with floor protection differentiates IUL from variable products, and how the tax treatment compares to Roth IRAs and traditional retirement accounts."),

      h2("The Consultative Framework"),
      block("Forget the one-call close. IUL prospects need education and trust-building across multiple conversations:"),

      h3("Conversation 1: Discovery (15-20 minutes)"),
      block("Your only goal is to understand their financial situation and plant the seed of how IUL fits. Don't pitch."),
      block("\"Hi [Name], this is [Your Name]. You'd explored some information about Indexed Universal Life a while back — I specialize in helping people understand how these policies actually work in practice, not just in theory. Did you end up moving forward with something, or are you still evaluating options?\""),
      block("If they're interested, ask about their current retirement savings (401k balance, IRA, other investments), their tax bracket now vs expected in retirement, their timeline to retirement, and what prompted their IUL research in the first place."),
      block("End by saying: \"Based on what you've shared, I think an IUL illustration using your specific numbers would be really helpful. Can I put one together and walk you through it next week?\""),

      h3("Conversation 2: The Illustration Review (30-45 minutes)"),
      block("This is where you demonstrate your expertise. Prepare a personalized IUL illustration showing: monthly premium options at 2-3 levels, projected cash value growth over 20/30/40 years, comparison of tax-free retirement income vs taxable 401(k) withdrawals, the death benefit as a secondary benefit (not the primary selling point), and the floor protection feature (0% floor in down markets)."),
      block("Walk through the illustration slowly. Let them ask questions. Compare IUL to their existing retirement vehicles: \"You mentioned you're maxing your 401(k) at $22,500/year. If you add $1,000/month to an IUL, here's what the tax-free income stream looks like at age 65 alongside your 401(k) withdrawals.\""),
      block("Don't close at the end of this meeting. Instead: \"Take a few days to think about this and discuss with your spouse/partner. I'll follow up next week to answer any questions. And if you want, I can run different premium scenarios to show how the numbers change.\""),

      h3("Conversation 3: Questions and Close (20-30 minutes)"),
      block("By now they've had the illustration for a week. They've thought about it, discussed it, and probably have specific questions. Answer everything, then ask: \"Based on what we've discussed, the $1,500/month policy gives you the strongest retirement supplement while keeping the premium manageable. Would you like to move forward with the application?\""),
      block("If they need a fourth conversation, provide it. IUL is a $500-$2,000/month commitment — rushing the decision creates buyer's remorse and chargebacks. Let the process unfold naturally."),

      h2("Qualifying IUL Prospects"),
      block("Not every aged IUL lead is a viable prospect. Qualify early to focus your time:"),
      block("Income: $75K+ household income minimum. Below this, the premiums aren't sustainable and the tax benefits are marginal. Age: 30-55 is the sweet spot. Younger prospects have more growth time. Older prospects have less time for cash value to accumulate. Health: IUL requires underwriting. Significant health issues can result in rated premiums or decline. Interest level: Are they actively comparing retirement options, or did they fill out a form on a whim?"),
      block("If a prospect doesn't qualify for IUL, don't waste their time or yours. Transition to a more appropriate product: \"Based on your situation, a term policy might actually be a better fit right now. Can I run those numbers for you instead?\" This builds trust and may lead to an IUL conversation later as their income grows."),

      h2("The ROI of Aged IUL Leads"),
      block("IUL commissions are substantial — typically 80-110% of first-year premium. A $1,000/month policy pays $9,600-$13,200 in first-year commission. Even one closed IUL case per month transforms your business."),
      block("At $3-$5 per aged lead, buying 200 IUL leads costs $600-$1,000. If you close just ONE policy from those 200 leads (0.5% conversion), your commission covers the lead cost 10-20x over. The math is overwhelmingly in your favor — IF you use the consultative approach and don't try to close on the first call."),
    ],
  },

  // ── WEEK 2, Wednesday ──
  {
    _id: "post-aged-lead-crm-setup-guide",
    _type: "post",
    title: "Setting Up Your CRM for Aged Leads: The System That Prevents Lost Deals",
    slug: { _type: "slug", current: "aged-lead-crm-setup-guide" },
    excerpt: "How to configure your CRM for high-volume aged lead operations — lead statuses, automated cadences, daily dashboards, and the weekly review that identifies problems before they cost you money.",
    publishedAt: "2026-03-26T09:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-strategies")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage")],
    seo: { metaTitle: "CRM Setup for Aged Leads: Prevent Lost Deals (2026)", metaDescription: "Configure your CRM for aged lead operations. Lead statuses, automated cadences, daily dashboards, and the weekly review process that maximizes conversions." },
    body: [
      block("If you're working more than 100 aged leads per month without a CRM, you're losing deals. Not maybe — definitely. Leads fall through the cracks, follow-ups get missed, and you end up calling people you already called while forgetting people who asked you to call back Tuesday."),
      block("Your CRM is your operating system for aged leads. Set it up right once, and it runs your business for you. Set it up wrong (or not at all), and no amount of script optimization will save you."),

      h2("The 6 Lead Statuses You Need"),
      block("Keep it simple. Every lead should be in exactly one of these statuses:"),
      block("NEW — Just imported, never contacted. ATTEMPTED — You've tried to reach them (called, emailed, or mailed) but haven't connected. CONTACTED — You've had a real conversation. This is the status that matters most. APPOINTMENT — They've agreed to a follow-up meeting, quote review, or application. SOLD — Deal closed, policy issued, or contract signed. DEAD — They're not interested, the number is disconnected, or they've asked to be removed."),
      block("That's it. Resist the urge to add 15 sub-statuses like \"voicemail left,\" \"callback requested,\" or \"thinking about it.\" Those details belong in the contact notes, not the status field. The status tells you where the lead is in your pipeline. The notes tell you the story."),

      h2("Automating Your Follow-Up Cadence"),
      block("When you import a batch of leads, your CRM should automatically create the follow-up tasks for each lead based on your cadence. Here's a simple setup:"),
      block("Day 0 (import day): Create task — \"Send direct mail piece.\" Day 3: Create task — \"First phone call.\" Day 4: Create task — \"Send follow-up email.\" Day 7: Create task — \"Second phone call (different time of day).\" Day 10: Create task — \"Final touch — door knock or second email.\""),
      block("Each task should be dated and assigned to the responsible agent. When a task is completed, log the outcome and the CRM advances to the next task. If you mark a lead as CONTACTED or APPOINTMENT, the automated cadence stops and you manage the follow-up manually based on the conversation."),

      h2("Your Daily Dashboard"),
      block("Every morning before you start calling, look at three numbers:"),
      block("Today's tasks: How many calls, emails, and follow-ups are scheduled for today? This is your activity plan. Leads in ATTEMPTED status: How many leads have you tried but haven't reached? These are your callback pool. Leads in CONTACTED status: How many active conversations need follow-up? These are your highest-priority touches."),
      block("If today's tasks show 60 calls, 10 emails, and 5 follow-ups — that's your day. Don't wander. Don't cherry-pick leads. Work the list in order. Consistency beats talent in the aged lead game."),

      h2("The Weekly Review"),
      block("Every Friday (or your last day of the week), run these numbers:"),
      block("Total dials this week. Total contacts (conversations 60+ seconds). Total appointments set. Total deals closed. Contact rate (contacts ÷ dials). Appointment rate (appointments ÷ contacts). Close rate (deals ÷ appointments). Cost per deal (weekly lead spend ÷ deals closed)."),
      block("Track these numbers weekly in a spreadsheet. After 4 weeks, you'll see trends. After 8 weeks, you'll see patterns. After 12 weeks, you'll know your business inside out."),
      block("If contact rate drops, check your calling times and phone number reputation. If appointment rate drops, review your script. If close rate drops, review your presentation or pricing. The numbers tell you exactly where the problem is — you never have to guess."),

      h2("CRM Recommendations by Budget"),
      block("Free ($0): HubSpot Free CRM — solid contact management, basic task automation, limited reporting. Good for new agents starting out."),
      block("Budget ($25-$50/month): Close.com or Pipedrive — built-in calling, email integration, better automation. Good for solo agents working 500+ leads/month."),
      block("Growth ($50-$100/month): GoHighLevel or Salesforce Essentials — full automation, multi-channel sequences, team management, advanced reporting. Good for agencies and teams."),
      block("The CRM you use matters less than using it consistently. A free CRM used every day beats a $100/month CRM that sits idle."),
    ],
  },

  // ── WEEK 2, Friday ──
  {
    _id: "post-mva-leads-personal-injury-intake-playbook",
    _type: "post",
    title: "MVA Lead Intake for Personal Injury Firms: Screening, Scripts & Case Building",
    slug: { _type: "slug", current: "mva-leads-personal-injury-intake-playbook" },
    excerpt: "How PI firms use aged MVA leads to build case volume — the 8-question screening checklist, empathy-first scripts, statute urgency, and case value evaluation.",
    publishedAt: "2026-03-28T09:00:00Z",
    contentType: "pillar",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-lead-types")],
    leadTypes: [ref("lt-mva")],
    seo: { metaTitle: "MVA Lead Intake for PI Firms: Screening & Scripts (2026)", metaDescription: "How personal injury firms screen and convert aged MVA leads. 8-question checklist, intake scripts, statute of limitations urgency, and case value evaluation." },
    body: [
      block("Motor vehicle accident cases have a unique lifecycle that makes aged leads extremely valuable for personal injury firms. Unlike insurance, where the consumer can buy a policy any time, MVA cases have a hard deadline: the statute of limitations. And unlike most other lead types, accident victims often delay seeking legal representation for weeks or months."),
      block("This delay is your opportunity. A consumer who was in an accident 60-180 days ago and hasn't hired an attorney is likely: dealing with mounting medical bills, frustrated with the insurance company's settlement offer, and increasingly aware that they need legal help. Aged MVA leads catch people at exactly this moment."),

      h2("The 8-Question Screening Checklist"),
      block("Your intake team needs to qualify cases quickly. These 8 questions identify viable cases in under 5 minutes:"),
      block("1. When did the accident happen? (Determines statute of limitations urgency. In most states, you have 2-3 years from the accident date.) 2. Were you the driver, passenger, or pedestrian? (All can have claims, but the case dynamics differ.) 3. Was a police report filed? (Strengthens the case significantly.) 4. Have you received medical treatment for your injuries? (Active treatment dramatically strengthens case value.)"),
      block("5. What injuries did you sustain? (Soft tissue vs hard injury affects case value. Document everything.) 6. Do you have health insurance? (Affects how medical bills are managed during the case.) 7. Has the other driver's insurance company contacted you? (They may have already made a lowball offer.) 8. Have you spoken to any other attorneys? (If they've already retained someone, this lead is dead.)"),
      block("If the answers to questions 1, 3, 4, and 5 are favorable — recent accident, police report, medical treatment, documented injuries — that's a strong case. Move to the retainer conversation immediately."),

      h2("The Intake Script"),
      block("Empathy first, case evaluation second. These are people dealing with injuries, vehicle damage, and insurance companies — they need to feel heard before they'll trust you with their case."),
      block("\"Hi [Name], this is [Your Name] from [Firm]. You had reached out about your car accident a while back — I wanted to check in and see how you're doing. Were you able to get everything resolved with the insurance company, or are you still dealing with it?\""),
      block("If they're still dealing with it (which most are): \"I'm sorry to hear that. Insurance companies are notorious for making this process difficult. Can I ask you a few quick questions to see if we might be able to help you get a fair resolution?\" Then run through the screening checklist."),
      block("Explain the contingency fee structure immediately: \"I want you to know upfront — there's no cost to you unless we win your case. Our fee comes from the settlement, not from your pocket. If we don't get you money, you don't pay us anything.\" This removes the biggest barrier for accident victims who are already facing financial stress."),

      h2("Statute of Limitations Urgency"),
      block("The statute of limitations creates real but ethical urgency. Don't manufacture fear — inform them of the reality:"),
      block("\"I should mention that in [State], there's a [2/3]-year deadline to file a claim from the date of your accident. Based on what you've told me, your accident was [X] months ago, so we have time — but I wouldn't want you to wait too long and miss that window. Can we set up a time to review your case this week?\""),
      block("For leads where the accident is approaching the statute deadline (within 6 months), increase urgency appropriately: \"Your deadline is coming up in [X] months. If you're considering legal representation, now is the time to act so we have enough time to build the strongest case possible.\""),

      h2("Evaluating Case Value from Aged Leads"),
      block("Not all MVA cases are equal. The data available in an aged lead — combined with your screening questions — lets you estimate case value early:"),
      block("Higher value indicators: Hard injuries (broken bones, surgery, TBI). Significant medical treatment ($10K+). Clear liability (police report, citations). Fully insured at-fault driver. Lost wages documented."),
      block("Lower value indicators: Soft tissue only (whiplash, sprains). Minimal medical treatment. Disputed liability. Uninsured/underinsured at-fault driver. Pre-existing conditions in the injury area."),
      block("Even lower-value cases can be worthwhile at aged lead prices. At $1-$5 per lead, a $5,000 settlement with a 33% contingency fee = $1,650 in fees. If you convert 3% of your leads, that's $50 in lead cost per retained case. The economics work at almost any case value."),

      h2("The Follow-Up System for 'Not Ready Yet'"),
      block("Many MVA prospects aren't ready to retain an attorney on the first call. They're thinking about it, or they want to give the insurance company one more chance. Don't write them off — they're your future cases."),
      block("Set a 30-day follow-up: \"Totally understand. Here's what I'd suggest — give it another 30 days and see how the insurance company handles things. I'll check back with you on [specific date] to see where things stand. And in the meantime, if anything changes or they make you an offer, call me before you sign anything — I can tell you if it's fair. Sound good?\""),
      block("This positions you as their advisor, not a salesperson. When the insurance company inevitably lowballs them, they'll remember you're the attorney who offered to help for free. That's how you win the case 30-60 days later."),
    ],
  },
];

async function seed() {
  console.log("Publishing Week 1-2 blog posts...\n");
  for (const post of posts) {
    try {
      await client.createOrReplace(post);
      console.log(`✓ [${post.publishedAt.slice(0,10)}] ${post.title}`);
    } catch (err) {
      console.error(`✗ ${post.title}: ${err.message}`);
    }
  }
  console.log(`\nDone! Published ${posts.length} posts.`);
}

seed().catch(console.error);
