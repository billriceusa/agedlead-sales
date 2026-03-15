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

const playbooks = [
  {
    _id: "pb-7-day-aged-lead-cadence",
    _type: "playbook",
    title: "The 7-Day Aged Lead Follow-Up Cadence",
    slug: { _type: "slug", current: "7-day-aged-lead-follow-up-cadence" },
    excerpt: "A day-by-day multi-channel outreach sequence for working aged leads — direct mail, phone, email, and door knocking with scripts for each touch.",
    difficulty: "beginner",
    estimatedTime: "10 min read",
    publishedAt: "2026-03-14T10:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-insurance"), ref("lt-final-expense"), ref("lt-mortgage")],
    seo: { metaTitle: "7-Day Aged Lead Follow-Up Cadence (Step-by-Step)", metaDescription: "Day-by-day multi-channel follow-up sequence for aged leads. Direct mail, phone scripts, email templates, and door knocking — beginner-friendly." },
    body: [
      block("Most aged leads are lost because agents give up too soon. They call once, get voicemail, and move on. Meanwhile, the data is clear: 80% of sales require 5-7 contact attempts, but 44% of salespeople give up after one. This cadence gives you a structured 7-day system that maximizes your chances of making contact and converting."),

      h2("Before You Start: Prep Work"),
      block("Import your leads into your CRM. Scrub against the DNC registry. Segment by lead age (work freshest first). Print a call sheet or queue your list in your dialer. Prepare your direct mail pieces if using yellow letters or postcards."),

      h2("Day 1: Direct Mail"),
      block("Send a personal letter or yellow letter. This is your first touch, and it arrives before your call. The goal is name recognition — when you call on Day 3, they may have seen your letter."),
      block("Keep the letter short: introduce yourself, reference their original inquiry, give your phone number, and say you'll be in touch. No hard sell. No brochures. Just a personal note."),

      h2("Day 3: First Phone Call"),
      block("Your letter has arrived. Now call. Use the Honest Follow-Up script:"),
      block("\"Hi [Name], this is [Your Name]. I sent you a letter earlier this week about [product]. I'm following up on some older inquiry records — it doesn't look like we ever connected, so I wanted to see if you were able to get what you needed, or if this is still on your to-do list.\""),
      block("If no answer: leave a voicemail. Keep it to 20 seconds. State your name, why you're calling, and your phone number. Speak slowly when leaving your number."),

      h2("Day 4: Email"),
      block("Send a plain-text email — no HTML templates, no graphics. It should look like a personal email, not marketing."),
      block("Subject: \"Following up — [Product]\""),
      block("Body: \"Hi [Name], I tried reaching you yesterday about [product]. If you have a quick moment, I'd love to help you [solve their problem]. You can reply to this email or call me at [number]. Either way, no pressure. — [Your Name]\""),

      h2("Day 5: Rest Day"),
      block("No contact. Give them space. If your mail, voicemail, and email are doing their job, they may call you back on this day."),

      h2("Day 6: Second Phone Call"),
      block("Call at a different time than Day 3. If you called in the morning before, try afternoon. Different days and times reach different people."),
      block("If you reach them: pick up the conversation naturally. If voicemail again: leave a shorter message — \"Hi [Name], just [Your Name] again. Wanted to make sure you got my note. Give me a call if you'd like to chat — [number].\""),

      h2("Day 7: Final Touch"),
      block("Choose based on your situation:"),
      block("If local: Door knock. This is the highest-converting final touch, especially for final expense and insurance leads. Show up professionally, reference your letter and calls, and offer to help in person."),
      block("If not local: Send a second email with a specific value offer. A free quote, a rate comparison, or a relevant resource. Give them a reason to respond."),

      h2("After Day 7"),
      block("If no contact after 7 days: move the lead to your \"recycle\" list. Try again in 60-90 days with a fresh approach. Many agents report closing leads on the second cycle that they couldn't reach the first time."),
      block("If contacted but not converted: set a specific follow-up date based on their timeline. Enter it in your CRM so it doesn't fall through the cracks."),

      h2("Adapting by Industry"),
      block("This cadence works across verticals but adjust the emphasis: Final expense — prioritize mail and door knocking over email (seniors prefer physical communication). Mortgage — lead with rate information in every touch (rates are your hook). Solar — include a savings estimate or incentive update in your email. Insurance — mention current rates and potential savings to create relevance."),
    ],
  },

  {
    _id: "pb-aged-lead-roi-tracking",
    _type: "playbook",
    title: "Tracking Your Aged Lead ROI: The Metrics Playbook",
    slug: { _type: "slug", current: "tracking-aged-lead-roi-metrics" },
    excerpt: "The essential metrics every aged lead professional should track — what to measure, benchmarks by industry, and how to use your numbers to make better decisions.",
    difficulty: "intermediate",
    estimatedTime: "12 min read",
    publishedAt: "2026-03-14T11:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-solar")],
    seo: { metaTitle: "Aged Lead ROI Tracking: Metrics Playbook", metaDescription: "The essential metrics for aged lead profitability. What to track, industry benchmarks, and how to use your numbers to optimize your operation." },
    body: [
      block("You can't improve what you don't measure. The difference between agents who make a living with aged leads and agents who quit after 60 days is almost always tracking — the successful ones know their numbers and optimize against them. The unsuccessful ones are guessing."),
      block("This playbook gives you the exact metrics to track, the benchmarks to compare against, and the framework for turning data into better decisions."),

      h2("The 5 Metrics That Matter"),

      h3("1. Cost Per Lead (CPL)"),
      block("What you pay for each lead record. This is your input cost. Track it by lead source, lead age, and vertical. Benchmark: $0.25-$5 depending on vertical and lead age."),

      h3("2. Contact Rate"),
      block("Contacts (real conversations) ÷ total dials. This tells you how effectively you're reaching people. Benchmark: 8-18% by phone. Track weekly and by time of day to optimize your calling schedule."),

      h3("3. Conversion Rate"),
      block("Closed deals ÷ total leads purchased. This is your end-to-end efficiency. Benchmark: 1-5% for aged leads across most verticals. If you're below 1%, your scripts or targeting need work. Above 5%, you should be scaling aggressively."),

      h3("4. Cost Per Acquisition (CPA)"),
      block("Total lead spend ÷ number of closed deals. This is the most important metric — it tells you what each customer actually costs. Benchmark: varies by vertical, but should be well below your average deal value. Use the Lead Cost Calculator on this site to model this."),

      h3("5. Return on Investment (ROI)"),
      block("(Revenue - Lead Spend) ÷ Lead Spend × 100. This is your bottom line. Benchmark: 200-500%+ is typical for a well-run aged lead operation. Below 100% means you're losing money. Use the ROI Calculator to project this before buying."),

      h2("The Weekly Scorecard"),
      block("Every Friday, fill in these numbers:"),
      block("Leads purchased this week: ___. Total dials: ___. Total contacts: ___. Contact rate: ___%. Appointments/quotes: ___. Closed deals: ___. Revenue: $___. Lead spend: $___. CPA: $___. ROI: ___%."),
      block("After 4 weeks, you'll have enough data to see patterns. After 8 weeks, you can make confident decisions about scaling, script changes, or channel adjustments."),

      h2("Diagnosing Problems"),
      block("Low contact rate (below 8%): Check your calling times — are you calling when people are available? Check your phone number reputation — is it flagged as spam? Try different channels (mail, door knock). Consider fresher aged leads."),
      block("Good contact rate, low conversion: Your script needs work. Record yourself (where legal) and listen back. Are you talking too much? Not asking enough questions? Missing objections? Role-play with a colleague and get honest feedback."),
      block("Good conversion, low volume: You need more leads. Your system works — scale it. Increase your monthly lead purchase and maintain the same cadence and scripts."),
      block("High CPA: Either your CPL is too high (try older, cheaper leads) or your conversion rate is too low (fix your system before buying more leads). Don't scale a broken system — fix it first, then scale."),

      h2("Industry Benchmarks"),
      block("Insurance: 10-15% contact rate, 1-3% conversion, $50-$150 CPA. Final expense: 12-18% contact rate, 2-5% conversion, $30-$80 CPA. Mortgage: 8-12% contact rate, 1-2% conversion, $200-$500 CPA. Solar: 10-15% contact rate, 1-3% conversion, $150-$400 CPA. Medicare: 12-18% contact rate, 2-4% conversion, $40-$100 CPA."),
      block("These are benchmarks for consistent, multi-channel follow-up. Single-channel (phone only) operations will see lower numbers across the board."),
    ],
  },

  {
    _id: "pb-final-expense-kitchen-table-close",
    _type: "playbook",
    title: "The Kitchen Table Close: Final Expense In-Home Presentation Guide",
    slug: { _type: "slug", current: "final-expense-kitchen-table-close" },
    excerpt: "Step-by-step guide to the in-home final expense presentation — from arriving at the door to taking the application. Scripts, objection handling, and closing techniques for seniors.",
    difficulty: "intermediate",
    estimatedTime: "15 min read",
    publishedAt: "2026-03-14T12:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-final-expense")],
    seo: { metaTitle: "Kitchen Table Close: Final Expense Presentation Guide", metaDescription: "Step-by-step in-home final expense presentation. Door arrival, needs assessment, 10-minute presentation, objection handling, and closing for seniors." },
    body: [
      block("The kitchen table presentation is the gold standard for closing final expense insurance. While telesales and Zoom presentations have their place, nothing converts aged final expense leads like sitting across from a senior in their home, looking them in the eye, and helping them protect their family."),
      block("This playbook walks through every step — from parking your car to walking out with a signed application."),

      h2("Arriving at the Home"),
      block("Park on the street, not in their driveway. It's a small detail that shows respect — you're a guest, not someone who's making themselves at home."),
      block("Walk to the door with your portfolio, business card, and a smile. Leave brochures and extra materials in the car — you can grab them if needed, but walking up with an armload of sales materials is intimidating."),
      block("Ring the bell or knock. Step back a half-step to give them space when they open the door. Smile."),

      h2("The Door Introduction"),
      block("\"Hi, are you [Name]? Great — I'm [Your Name]. I sent you a letter about final expense coverage, and I was in the neighborhood today. Did you get a chance to look at it?\""),
      block("If they didn't get the letter or don't remember: \"No worries. You had looked into some information about final expense coverage a while back, and I help people in [City] make sure their families are taken care of. Do you have a couple of minutes?\""),
      block("Your goal: get invited inside. Don't pitch at the door. If they engage, say: \"I don't want to keep you standing here — would it be easier to sit down for a few minutes? I can show you what the options look like.\""),

      h2("The Needs Assessment (5 minutes)"),
      block("Once seated, start with questions — not your pitch. You need to understand their situation before you can recommend anything."),
      block("\"Tell me a little about your situation. Do you have any life insurance coverage right now?\" (Determines if this is a new sale or a replacement/supplement.)"),
      block("\"Who would be responsible for handling things if something happened to you?\" (Identifies the beneficiary and makes the need personal.)"),
      block("\"Have you thought about how much it would cost?\" (Most seniors underestimate funeral costs — this opens the door to education.)"),
      block("Listen more than you talk. Take mental notes. The information they share in these 5 minutes determines how you frame your presentation."),

      h2("The Presentation (10 minutes)"),
      block("Keep it simple. Final expense is not a complex product — don't make it one."),

      h3("Step 1: Establish the Need"),
      block("\"The average funeral in [State] costs between $8,000 and $12,000. That doesn't include outstanding medical bills, credit card balances, or other expenses. Without a policy in place, that cost falls on [beneficiary's name].\" Pause. Let it sink in."),

      h3("Step 2: Present the Solution"),
      block("\"A final expense policy covers those costs so your family doesn't have to worry about it. The money goes directly to [beneficiary] — tax-free — and they can use it for whatever's needed.\""),
      block("Show 2-3 options at different price points. I typically present $5,000, $10,000, and $15,000 face values with monthly premiums. Write them on a notepad or show them on a simple rate sheet — not a glossy brochure."),

      h3("Step 3: Address Simplicity"),
      block("\"The good news is there's no medical exam required. I can get you an answer right now on whether you qualify, and coverage starts immediately.\" This removes the two biggest fears: that it will be complicated and that they might not qualify."),

      h2("The Close"),
      block("After presenting options, don't ask \"what do you think?\" — that invites indecision. Instead:"),
      block("\"Based on what we talked about, the $10,000 policy at $[X] per month gives [beneficiary] the coverage to handle everything without worrying. Should I get the application started?\""),
      block("Then be quiet. Wait. Let them decide. The silence feels uncomfortable, but it works. The next person to speak loses the negotiation — and you're not negotiating, you're helping."),

      h2("Handling Objections"),
      block("\"I need to think about it.\" — \"I completely understand. Most people do. Here's what I'd suggest — let me leave you with this rate sheet and my card. I'll stop back by on [specific day] and we can go from there. No pressure at all.\" Then come back. The follow-up visit closes 40-50% of \"think about it\" responses."),
      block("\"I can't afford it.\" — \"I hear you. Let me show you the $5,000 option — it's about $[lowest premium] per month. That's less than a cup of coffee a day, and it means [beneficiary] won't have to come out of pocket for anything.\""),
      block("\"My children will take care of it.\" — \"That's wonderful that they would. The question is whether you want them to have to. The average funeral is $8,000-$12,000 — this policy means they can focus on grieving, not on finances.\""),

      h2("After the Application"),
      block("If they sign: congratulate them, explain what happens next (underwriting, policy delivery timeline), and ask for referrals. \"Do you have any friends or family members who might want to look into this? I'd be happy to help them too.\""),
      block("If they don't sign: leave your card and rate sheet. Set a specific follow-up date. Enter it in your CRM immediately when you get to your car. Follow through."),
    ],
  },

  {
    _id: "pb-mortgage-rate-shopping-playbook",
    _type: "playbook",
    title: "The Mortgage Rate Shopping Playbook for Aged Leads",
    slug: { _type: "slug", current: "mortgage-rate-shopping-playbook" },
    excerpt: "How loan officers can win rate shoppers from aged mortgage leads — pre-call rate prep, the rate comparison script, locking strategies, and the pre-qualification fast track.",
    difficulty: "intermediate",
    estimatedTime: "12 min read",
    publishedAt: "2026-03-14T13:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-mortgage")],
    seo: { metaTitle: "Mortgage Rate Shopping Playbook for Aged Leads", metaDescription: "How loan officers win rate shoppers from aged mortgage leads. Pre-call rate prep, comparison scripts, locking strategies, and pre-qualification workflow." },
    body: [
      block("Every aged mortgage lead is a rate shopper. They compared rates when they first inquired, and they'll compare you to whoever else calls. Your advantage isn't your rate — it's your speed, service, and ability to make the process feel easy. This playbook shows you how to win the rate conversation and convert aged mortgage leads into locked applications."),

      h2("Pre-Call Rate Prep"),
      block("Before you dial a single number, know today's rates cold. Check your rate sheets for 30-year fixed, 15-year fixed, and ARM products. Know the rates for conventional, FHA, and VA. Know your lender credits and buydown options."),
      block("Also check what rates were when the lead was generated. If you're calling a 90-day-old lead and rates have dropped 0.5% since then, that's your opener. If rates have risen, you lead with locking before they go higher."),

      h2("The Rate Comparison Script"),
      block("\"Hi [Name], this is [Your Name]. You'd looked into mortgage options about [X] months ago, and I'm calling because rates have [dropped/changed] since then. Current 30-year fixed is around [X.XX%]. Were you able to lock in a rate you're happy with, or would it help to see what's available today?\""),
      block("If they got a rate from someone else: \"What rate did they offer you? I can tell you in 30 seconds if we can beat it.\" This is direct and competitive — rate shoppers respect it."),
      block("If they haven't acted yet: \"No worries — a lot of people start the process and wait for the right time. If you have 5 minutes, I can give you a quick pre-qualification and a rate quote based on your situation.\""),

      h2("The 5-Minute Pre-Qualification"),
      block("Speed wins in mortgage. The faster you can give them real numbers, the more likely they are to work with you."),
      block("Ask 5 questions: What's your estimated credit score range? Are you purchasing or refinancing? What's the property value (or purchase price)? What loan amount are you looking at? Are you self-employed or W-2? With those answers, you can give a ballpark rate and monthly payment in under 2 minutes."),
      block("\"Based on what you've told me, you're looking at approximately [X.XX%] on a 30-year fixed, which puts your monthly payment around $[X,XXX]. If you'd like, I can send you a formal rate quote and we can lock that in before it changes.\""),

      h2("The Lock Strategy"),
      block("Rates move daily. Use this reality as ethical urgency:"),
      block("\"Rates have been volatile — what I quoted you today might be different tomorrow. If you're seriously considering this, I'd recommend locking your rate today so we protect this number. There's no cost to lock, and if rates drop further, we have options to float down.\""),
      block("Float-down provisions (if your lender offers them) are a powerful closing tool. They eliminate the prospect's fear of locking too early: \"If rates drop more than 0.25% after we lock, I can adjust your rate down. You get the protection of today's rate with the upside if rates improve.\""),

      h2("Following Up on Unlocked Prospects"),
      block("Not everyone locks on the first call. For prospects who need time, set rate alerts:"),
      block("\"I'll keep an eye on rates for you. If they drop below [X.XX%], I'll call you immediately so we can lock before they bounce back. What's the best number to reach you?\""),
      block("This positions you as their rate advisor — not a salesperson waiting for a commission. When rates do move, you have a legitimate reason to call, and they're expecting to hear from you."),
    ],
  },
];

async function seed() {
  console.log("Publishing playbooks to Sanity...\n");
  for (const pb of playbooks) {
    try {
      await client.createOrReplace(pb);
      console.log(`✓ ${pb.title}`);
    } catch (err) {
      console.error(`✗ ${pb.title}: ${err.message}`);
    }
  }
  console.log(`\nDone! Published ${playbooks.length} playbooks.`);
}

seed().catch(console.error);
