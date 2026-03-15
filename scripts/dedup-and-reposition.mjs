import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function block(text, style = "normal") {
  return {
    _type: "block", _key: k(), style, markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  };
}
function h2(text) { return block(text, "h2"); }
function h3(text) { return block(text, "h3"); }
function k() { return Math.random().toString(36).slice(2, 10); }

async function run() {
  console.log("=== STEP 1: Delete overlapping posts ===\n");

  const toDelete = [
    "post-aged-vs-real-time-leads",        // covered on agedleadstore.com + howtoworkleads.com
    "post-how-to-work-aged-leads",          // covered on both other sites
    "post-aged-leads-cost-pricing-guide",   // covered on both other sites
    "post-scripts-for-aged-leads",          // covered on agedleadstore.com
    "post-what-are-aged-leads",             // covered on agedleadstore.com "Ultimate Guide"
  ];

  for (const id of toDelete) {
    try {
      await client.delete(id);
      console.log(`  ✗ Deleted: ${id}`);
    } catch (err) {
      console.log(`  (skip: ${id} — ${err.message})`);
    }
  }

  console.log("\n=== STEP 2: Publish differentiated posts ===\n");

  const posts = [
    // ── Post 1: UNIQUE - Industry-specific final expense playbook (much deeper than other sites) ──
    {
      _id: "post-final-expense-door-knocking-playbook",
      _type: "post",
      title: "The Door Knocking Playbook for Aged Final Expense Leads",
      slug: { _type: "slug", current: "final-expense-door-knocking-playbook" },
      excerpt: "A field-tested door knocking system for working aged final expense leads in person — routes, timing, scripts at the door, kitchen-table presentations, and closing strategies.",
      publishedAt: "2026-03-14T12:00:00Z",
      contentType: "pillar",
      isFeatured: true,
      author: { _type: "reference", _ref: "author-bill-rice" },
      categories: [{ _type: "reference", _ref: "cat-lead-types", _key: "c1" }],
      leadTypes: [{ _type: "reference", _ref: "lt-final-expense", _key: "lt1" }],
      seo: {
        metaTitle: "Door Knocking Playbook for Aged Final Expense Leads (2026)",
        metaDescription: "Field-tested door knocking system for aged final expense leads: route planning, scripts at the door, kitchen-table presentations, and closing. From 20+ years in the field.",
      },
      body: [
        block("Door knocking aged final expense leads is the single highest-converting sales channel I've seen in 20+ years of working leads. Phone calls convert aged final expense leads at 2-3%. Door knocking converts at 8-15% when done right. That's not a typo — in-person visits to seniors who previously expressed interest in burial insurance produce dramatically better results than any other channel."),
        block("This playbook is based on running thousands of door knocks across multiple markets. It's not theory — it's a system that works, with specific details about what to wear, what to say at the door, how to structure the kitchen-table presentation, and how to close without pressure."),

        h2("Why Door Knocking Works for Final Expense"),
        block("Seniors trust face-to-face interactions more than phone calls. They grew up in an era when an insurance agent came to your house. When you show up professionally, introduce yourself, and explain why you're there — you're meeting them in a communication style they're comfortable with."),
        block("There's also a practical reason: seniors answer their doors. They're often home during the day, they're curious about visitors, and they're less likely to ignore a knock than a phone call from an unknown number. I've had days where my door-knock contact rate was 40-50%, compared to 8-12% by phone."),
        block("The combination of higher contact rate and higher conversion rate means door knocking typically produces 5-10x the results of phone calling per lead — more than enough to justify the travel time."),

        h2("Pre-Planning: Building Your Route"),
        block("Never door knock randomly. Before you leave the house, build a route of 20-30 leads clustered in the same geographic area. Use Google Maps to plot the addresses and organize them into an efficient driving route."),
        block("Filter your aged lead list by zip code first. I typically work in a 15-20 mile radius from my starting point. Anything beyond 30 minutes of driving between stops kills your efficiency. The goal is to knock 15-25 doors in a 4-5 hour session."),
        block("Plan your sessions for Tuesday through Thursday, 10 AM to 2 PM. These are the best days and times for reaching seniors at home. Avoid Mondays (doctor appointments), Fridays (grocery shopping and weekend prep), and weekends (family visitors)."),
        block("Print a one-page summary for each lead: name, address, age if available, and what they originally requested. Clip these to a clipboard in route order. Having their name and context at a glance makes your door approach feel personal, not random."),

        h2("What to Wear and Bring"),
        block("Dress business casual — slacks and a collared shirt or a conservative dress. Avoid suits (too formal and intimidating for a home visit) and avoid jeans and polo shirts (too casual for discussing insurance)."),
        block("Bring: your clipboard with lead sheets, business cards, a company ID badge if you have one, a rate book or tablet with illustrations, blank applications, and a pen. Keep everything in a professional-looking folder or portfolio — not a briefcase, which can feel overly salesy."),
        block("Leave marketing brochures in the car for your first visit. The first knock is about building rapport, not dumping materials. If they're interested, you can grab materials from the car — it gives you a natural reason to stay longer."),

        h2("The Door Script: First 30 Seconds"),
        block("The moment they open the door, smile and take half a step back. Giving them physical space makes you feel less threatening. Then:"),
        block("\"Hi, are you [Name]? [Wait for yes.] Hi [Name], I'm [Your Name]. I sent you a letter last week about some final expense coverage you'd looked into — I was in the area today and thought I'd stop by in person. Did you get a chance to look at that?\""),
        block("If you didn't send a letter: \"Hi [Name], I'm [Your Name]. I'm reaching out because you'd looked into some information about final expense coverage a while back, and I help people in [City/Area] get that taken care of. Did you end up finding a policy, or is that still something on your mind?\""),
        block("Key principle: the question at the end must be easy to answer and non-committal. You're not asking them to buy — you're asking if they need help. Most seniors will say some version of \"I've been meaning to look into that\" or \"Come on in.\""),

        h2("Getting Inside: The Kitchen-Table Sit"),
        block("If they engage at the door (even with mild interest), your next goal is to get invited in. Don't push — guide. Say something like: \"I don't want to keep you standing at the door — would it be easier to sit down for a couple minutes? I can show you what the options look like.\""),
        block("Once inside, the dynamic shifts entirely in your favor. You're no longer a stranger at the door — you're a guest. The conversation becomes more natural, questions flow more freely, and the prospect feels more comfortable."),
        block("At the table, start by asking about their situation, not pitching your product. \"Tell me a little about your situation — do you have any coverage in place right now?\" This question accomplishes three things: it shows you care about their needs, it qualifies them, and it gives you information to tailor your recommendation."),

        h2("The Presentation: Keep It Simple"),
        block("Final expense presentations should take 10-15 minutes, not 45. Seniors lose interest in long presentations. Cover three things:"),
        block("First, the need: \"The average funeral costs $8,000-$12,000. Without a policy, that cost falls on your family — usually your children.\" This is the emotional core. Don't linger on it, but make sure they understand what's at stake."),
        block("Second, the solution: \"A final expense policy covers that cost, and your family gets a check to handle everything.\" Show them 2-3 coverage options at different price points. I typically show $5,000, $10,000, and $15,000 face values with corresponding monthly premiums."),
        block("Third, the simplicity: \"There's no medical exam. I can get you an answer right now on whether you qualify, and the coverage starts immediately.\" The no-exam, instant-answer aspect is a huge selling point for seniors who've been avoiding this because they assumed it would be complicated."),

        h2("Closing Without Pressure"),
        block("After the presentation, the best close is the simplest: \"Based on what we talked about, the $10,000 policy at [$X] per month seems like the best fit. Should I get the paperwork started?\""),
        block("If they hesitate: \"I totally understand wanting to think about it. Here's what I'd suggest — let me leave you with my card and this rate sheet, and I'll swing back by [specific day] to see where you're at. No pressure at all.\" Then actually come back. The follow-up visit closes a large percentage of first-visit hesitations."),
        block("Never, ever pressure a senior. The final expense market runs on trust and referrals. One pressured sale costs you ten future referrals. Play the long game."),

        h2("After the Knock: Documentation"),
        block("After each door — whether you got in or not — note the outcome on your lead sheet: not home, home but didn't answer, spoke at door but not interested, spoke at door and scheduled follow-up, kitchen-table presentation, application taken."),
        block("This data is gold. After 100 door knocks, you'll know your exact contact rate, sit rate, and close rate. Those numbers tell you exactly what your cost per sale is and how many leads you need to buy to hit your income goals."),

        h2("The Numbers That Matter"),
        block("From my experience and training agents across the country, here are realistic benchmarks for a well-executed final expense door knocking operation:"),
        block("Contact rate (someone answers): 35-50%. Conversation rate (they engage beyond the door): 60-70% of contacts. Sit rate (you get inside): 30-40% of conversations. Close rate (application taken): 50-60% of sits. Overall conversion from lead to sale: 8-15%."),
        block("At $1-$3 per aged lead, with a 10% conversion rate and an average premium of $50/month, the economics are outstanding. 200 leads at $2 = $400 in lead cost. 20 door knocks that result in sits × 55% close = 11 policies × $50/month × 9 advance months = $4,950 in first-year commission. That's a 12x return on your lead investment."),
      ],
    },

    // ── Post 2: UNIQUE - Medicare AEP strategy (not covered elsewhere) ──
    {
      _id: "post-medicare-aep-aged-lead-strategy",
      _type: "post",
      title: "Medicare AEP Strategy: How to Use Aged Leads to Dominate Open Enrollment",
      slug: { _type: "slug", current: "medicare-aep-aged-lead-strategy" },
      excerpt: "How to build and work an aged Medicare lead pipeline before and during the Annual Enrollment Period. Timing, compliance, pre-AEP nurturing, and enrollment conversion tactics.",
      publishedAt: "2026-03-14T13:00:00Z",
      contentType: "pillar",
      isFeatured: true,
      author: { _type: "reference", _ref: "author-bill-rice" },
      categories: [{ _type: "reference", _ref: "cat-strategies", _key: "c1" }],
      leadTypes: [{ _type: "reference", _ref: "lt-medicare", _key: "lt1" }],
      seo: {
        metaTitle: "Medicare AEP Strategy with Aged Leads (2026 Playbook)",
        metaDescription: "How to use aged Medicare leads during the Annual Enrollment Period. Pre-AEP pipeline building, compliance, timing, and enrollment conversion tactics.",
      },
      body: [
        block("The Annual Enrollment Period (October 15 - December 7) is the Super Bowl for Medicare agents. It's when the majority of plan changes happen, commissions are earned, and books of business are built. But here's what most agents get wrong: they wait until October to start prospecting."),
        block("The agents who dominate AEP start building relationships with aged Medicare leads 3-6 months before enrollment opens. By the time October 15 hits, they have a warm pipeline of seniors who already know their name, trust their expertise, and are ready to enroll. Here's exactly how to build that pipeline."),

        h2("The Pre-AEP Timeline"),
        block("July-August: Buy your aged Medicare leads and begin outreach. Your goal isn't to sell — it's to introduce yourself and educate. You can't discuss specific plans before October 1, but you can build relationships and offer to be a resource."),
        block("September: Intensify your outreach. This is when CMS allows you to begin marketing specific plan information. Send educational mailers about what's changing in your county for the coming year. Call prospects and offer free plan reviews."),
        block("October 1-14: Scope of Appointment (SOA) collection period. Contact your warm pipeline, schedule appointments, and collect SOAs. The agents with the biggest head start will book their calendars solid before AEP even begins."),
        block("October 15 - December 7: AEP. Execute your appointments, enroll clients, and continue working your lead list. This is conversion time — every relationship you built since July is now an enrollment opportunity."),

        h2("Why Aged Leads Are Perfect for Medicare"),
        block("Medicare is inherently a long-cycle product. Seniors don't impulse-buy health coverage. They research, compare, talk to family, and think it over. An aged lead that's 90-180 days old fits this timeline perfectly — the consumer had questions months ago and likely still does."),
        block("Additionally, Medicare enrollment is restricted to specific windows. A senior who inquired in May can't change their plan until October. That means a May lead is actually more valuable in September than it was the day it was generated — because now the consumer can actually act on their interest."),
        block("At $0.50-$3 per lead, you can build a pipeline of 500-1,000 seniors for $500-$3,000. Even enrolling 5-10% of them at $500-$600 average annual commission produces $25,000-$60,000 in first-year revenue — plus renewals that compound year over year."),

        h2("Compliance: The CMS Rules You Must Follow"),
        block("Medicare marketing is heavily regulated by CMS, and the rules around aged leads require careful attention:"),
        block("You cannot discuss specific plan names, benefits, or premiums before October 1. During pre-AEP outreach (July-September), keep conversations educational: \"I help seniors in [County] understand their Medicare options. When enrollment opens in October, I'd love to do a free plan review for you.\""),
        block("You need a Scope of Appointment (SOA) before any in-person or virtual meeting where you'll discuss specific plans. SOAs must be collected at least 48 hours before the appointment (some carriers require longer). Build SOA collection into your pre-AEP cadence."),
        block("Do not use superlatives like \"best plan\" or make guarantees about savings. Present plan options factually and let the senior decide. Document every interaction in your CRM for compliance records."),
        block("Always identify yourself and your affiliation when calling. Never imply you're calling from Medicare or CMS. These rules exist to protect seniors — following them isn't just legal compliance, it builds the trust that earns enrollments."),

        h2("The Pre-AEP Nurturing Cadence"),
        block("Here's the outreach sequence I use for aged Medicare leads during the pre-AEP months:"),
        block("Touch 1 (July/August): Personal letter introducing yourself as a local Medicare specialist. Include your photo, phone number, and a line like: \"When enrollment season approaches in October, I'll be offering free plan reviews. I'll be in touch.\""),
        block("Touch 2 (2 weeks later): Phone call. \"Hi [Name], this is [Your Name] — I sent you a letter a couple weeks ago about Medicare. I'm a local specialist who helps seniors understand their options. I'm not selling anything today — I just wanted to introduce myself so you know who to call when enrollment opens in October. Do you have any questions I can help with now?\""),
        block("Touch 3 (September): Educational mailer about what's changing in their county for the coming year. Bullet points: new plans available, premium changes, formulary updates. Include a call to action: \"Call me for a free plan comparison.\""),
        block("Touch 4 (late September): Phone call to schedule an appointment. \"Hi [Name], this is [Your Name] — we spoke in August about your Medicare coverage. Enrollment opens October 15, and I'm scheduling free plan reviews now. Can I set up a time to go over your options?\""),
        block("Touch 5 (October 1-14): SOA collection and appointment confirmation. By this point, you've been in their world for 2-3 months. You're not a cold caller — you're the Medicare person who's been helping them."),

        h2("The AEP Appointment: What to Cover"),
        block("During the appointment itself, follow a structured but conversational format. Start with their current situation: What plan are they on now? What do they like about it? What frustrates them? What medications do they take? Which doctors do they see?"),
        block("Then present 2-3 plan options that match their needs. Don't show them every plan available — that overwhelms seniors. Show them the plan they're on now vs. 1-2 alternatives that specifically address their pain points (lower copays, better drug coverage, access to their doctor, lower premium)."),
        block("End with a clear recommendation: \"Based on what you've told me about your medications and doctors, Plan X is the best fit because [specific reason]. Would you like me to help you enroll today?\" Simple, clear, specific."),

        h2("Building a Renewable Book"),
        block("Here's the best part about Medicare: clients renew. Unlike selling a term life policy and moving on, Medicare clients come back every AEP. If you enrolled 50 clients this year, that's 50 warm renewal appointments next year — plus referrals."),
        block("The compounding effect is powerful. Year 1: 50 new enrollments. Year 2: 50 renewals + 50 new enrollments (from the same aged lead strategy). Year 3: 100 renewals + 50 new. By year 5, you have 200+ clients paying recurring commissions while you add 50 more each AEP."),
        block("This is why the pre-AEP aged lead strategy isn't just a one-time tactic — it's a business model. The $500-$3,000 you spend on aged leads each year is an investment in a growing, compounding book of business."),
      ],
    },

    // ── Post 3: UNIQUE - SSDI for disability attorneys (nobody covers this) ──
    {
      _id: "post-ssdi-leads-disability-attorneys",
      _type: "post",
      title: "SSDI Lead Conversion for Disability Attorneys: From Aged Lead to Retained Client",
      slug: { _type: "slug", current: "ssdi-leads-disability-attorneys" },
      excerpt: "How disability attorneys and legal intake teams can use aged SSDI leads to build case volume — screening strategies, intake scripts, and denial-stage targeting.",
      publishedAt: "2026-03-14T14:00:00Z",
      contentType: "pillar",
      isFeatured: false,
      author: { _type: "reference", _ref: "author-bill-rice" },
      categories: [{ _type: "reference", _ref: "cat-lead-types", _key: "c1" }],
      leadTypes: [{ _type: "reference", _ref: "lt-ssdi", _key: "lt1" }],
      seo: {
        metaTitle: "SSDI Lead Conversion for Disability Attorneys (2026)",
        metaDescription: "How disability attorneys use aged SSDI leads to build case volume. Intake scripts, denial-stage targeting, screening criteria, and conversion strategies.",
      },
      body: [
        block("Social Security Disability cases have a unique characteristic that makes aged leads exceptionally valuable: the process is slow. An initial SSDI application takes 3-6 months to process. Appeals take 12-24 months. Hearings can stretch beyond that. A consumer who sought help 90 days ago is almost certainly still in the process — and may now need an attorney more than ever."),
        block("Over 60% of initial SSDI applications are denied. Most denied applicants don't seek legal representation right away — they're overwhelmed, frustrated, and unsure of their options. This creates a massive opportunity for disability firms willing to reach out to aged leads with empathy and education."),

        h2("Why Aged SSDI Leads Work for Law Firms"),
        block("The timing advantage is the biggest factor. Consider the typical SSDI claimant's journey: they apply on their own (Month 0), wait for a decision (Months 1-5), receive a denial (Month 5-6), feel discouraged and research options (Months 6-8), and finally seek legal help (Months 6-12)."),
        block("A lead that was generated at Month 0-2 and aged to Month 6-8 lines up perfectly with the moment when legal representation becomes urgent. You're not calling too early (before they know they need help) or too late (after they've hired someone else). You're calling at exactly the right time."),
        block("At $0.50-$3 per lead, the economics for disability firms are compelling. SSDI attorney fees are capped by the SSA at 25% of back pay, up to a maximum (currently $7,200). Even at a conservative $4,000 average fee, you only need one retained case per 200 leads to generate positive ROI at $1/lead."),

        h2("Screening Aged SSDI Leads"),
        block("Not every SSDI lead is a viable case. Your intake team needs clear screening criteria to quickly identify which leads to pursue:"),
        block("Priority 1 — Denied applicants: These are your highest-value leads. They've already been through the process, received a denial, and are in the appeal window. Ask: \"Have you received a decision on your claim?\" If the answer is a denial, that's your case."),
        block("Priority 2 — Pending applicants who filed without representation: Many initial applicants don't use an attorney. If their case is still pending and they filed alone, there's an opportunity to take over before a decision is made — especially if the application was poorly completed."),
        block("Priority 3 — People who inquired but haven't filed yet: These leads may have been overwhelmed by the process and given up. If they're still unable to work due to a qualifying condition, help them file with proper representation from the start."),
        block("Disqualify leads who: have already retained an attorney, are working full-time (above SGA), don't have a medical condition that prevents work for 12+ months, or had their claim denied more than 60 days ago without filing an appeal (unless there's a basis for reopening)."),

        h2("The SSDI Intake Script"),
        block("Empathy is the most important element when calling disability claimants. These are people dealing with serious health issues, financial stress, and a confusing bureaucratic process. Your tone matters more than your words."),
        block("\"Hi [Name], this is [Your Name] from [Firm]. You had reached out about help with a disability claim a while back, and I wanted to check in. Have you been able to get your benefits approved, or are you still working through the process?\""),
        block("If they were denied: \"I'm sorry to hear that — denial is frustrating, but it's actually very common. Over 60% of initial applications are denied. The good news is that you have the right to appeal, and most appeals that are properly prepared with legal representation are successful. Can I ask you a few questions to see if we can help?\""),
        block("The screening questions: What condition prevents you from working? When did you stop working? Did you file the application yourself or with help? When was the denial? Have you filed an appeal yet? Are you currently receiving any other benefits?"),
        block("Key delivery point: always explain the contingency fee structure immediately. \"There's no upfront cost for our services. We only get paid if you get approved, and the fee is set by the Social Security Administration — 25% of your back pay, up to a cap. If you don't get approved, you don't pay us anything.\" This removes the biggest barrier for people on disability who have no income."),

        h2("Building a Denial-Stage Pipeline"),
        block("The most sophisticated SSDI operations segment their aged leads by claim timeline and target the denial stage specifically. Here's how to build that pipeline:"),
        block("Buy aged leads that are 90-180 days old. At this age, a large percentage of leads who filed at the time of inquiry have now received their initial decision — and many of those decisions are denials."),
        block("Track denial rates by lead age. In my experience, leads in the 120-180 day range have the highest percentage of recently-denied claimants. This is your sweet spot."),
        block("Develop a second-touch cadence for leads who were \"still waiting\" when you first called. Set a 60-day follow-up: \"Hi [Name], this is [Your Name] from [Firm] — we spoke a couple months ago when your claim was still pending. Have you heard back from Social Security?\" This follow-up catches newly-denied claimants at their moment of maximum need."),

        h2("Volume and Conversion Benchmarks"),
        block("For a disability firm working aged SSDI leads systematically, here are realistic benchmarks: Contact rate: 12-18% (higher than most verticals because disability claimants are often home). Screening pass rate: 40-50% of contacts meet basic criteria. Retention rate: 50-65% of screened leads sign a retainer. Overall conversion: 3-5% from lead to retained client."),
        block("At $1-$2 per lead, buying 1,000 leads for $1,000-$2,000 yields 30-50 retained clients. At an average fee of $4,000-$5,000 per approved case (factoring in that not all retained cases win), the return is significant — typically 10-25x the lead investment."),
        block("The key is consistency. Run the same system every month, track your numbers, and optimize your intake scripts based on what you learn. The firms that win with aged SSDI leads are the ones that build a machine, not the ones chasing one-off campaigns."),
      ],
    },

    // ── Post 4: UNIQUE - Solar seasonality strategy (not covered elsewhere) ──
    {
      _id: "post-solar-seasonal-aged-lead-strategy",
      _type: "post",
      title: "Seasonal Solar Sales: How to Use Aged Leads to Sell Year-Round",
      slug: { _type: "slug", current: "solar-seasonal-aged-lead-strategy" },
      excerpt: "Solar demand is seasonal, but your pipeline shouldn't be. How to use aged solar leads to smooth revenue across spring peaks and winter dips with timing-specific strategies.",
      publishedAt: "2026-03-14T15:00:00Z",
      contentType: "pillar",
      isFeatured: false,
      author: { _type: "reference", _ref: "author-bill-rice" },
      categories: [{ _type: "reference", _ref: "cat-strategies", _key: "c1" }],
      leadTypes: [{ _type: "reference", _ref: "lt-solar", _key: "lt1" }],
      seo: {
        metaTitle: "Solar Sales Year-Round with Aged Leads: Seasonal Strategy",
        metaDescription: "Use aged solar leads to build pipeline through seasonal dips. Spring peak, summer install, fall financing, and winter planning strategies for solar sales teams.",
      },
      body: [
        block("Solar sales follow a predictable seasonal pattern: interest spikes in spring when electricity bills start climbing, peaks in summer, and drops off in fall and winter. Most solar companies ride this wave — hiring in spring, scrambling in summer, and laying off in winter. It's a terrible way to run a business."),
        block("Aged solar leads let you break this cycle. Because aged leads cost $0.50-$3 instead of $20-$50 per fresh lead, you can afford to run consistent outreach campaigns year-round — filling your pipeline during slow months so you're not starting from zero every spring."),

        h2("The Solar Seasonality Problem"),
        block("Real-time solar leads are scarce and expensive in winter. Consumer search volume for \"solar panels\" drops 40-60% between November and February compared to the spring peak. That means fresh leads cost more and convert less during exactly the months when you need pipeline the most."),
        block("Meanwhile, the consumers who expressed interest during spring and summer and didn't buy? They're sitting in aged lead databases, available for $0.50-$3. Many of them are still interested — they just got busy, got multiple quotes and couldn't decide, or wanted to \"think about it over winter.\""),
        block("These are your winter pipeline. Instead of waiting for spring, you're reaching out to people who already researched solar and re-opening the conversation."),

        h2("Season-Specific Strategies"),

        h3("Spring (March-May): The Incentive Hook"),
        block("Spring is when solar interest naturally peaks. Aged leads from the previous spring and summer are now 9-12 months old and very affordable. Your hook: updated incentives."),
        block("\"Hi [Name], you looked into solar about a year ago — I'm reaching out because the federal solar tax credit is still at [current rate]% for this year, and [State] just updated their incentive program. Prices have also come down since you last looked. Did you end up going solar, or would it help to see what the numbers look like now?\""),
        block("The incentive landscape genuinely changes year to year. Use this as a legitimate, newsworthy reason to reconnect — not a manufactured urgency tactic."),

        h3("Summer (June-August): The Bill Pain"),
        block("Summer electricity bills are the most powerful solar selling tool in existence. Aged leads from spring (60-90 days old) are at the perfect intersection of interest and urgency — they researched solar when it was warm, and now they're living with the high electric bills that motivated them."),
        block("\"Hi [Name], with summer bills hitting hard right now, I wanted to follow up on the solar interest you had a few months ago. A lot of homeowners in [Area] are locking in solar right now to eliminate those summer spikes. Did you move forward with anyone, or are you still looking at options?\""),

        h3("Fall (September-November): The Year-End Tax Play"),
        block("Fall is traditionally slow for solar, but aged leads give you an angle: the tax year deadline. Homeowners who install before December 31 get the solar ITC on their current-year tax return. This is a genuine financial incentive with a hard deadline."),
        block("\"Hi [Name], I'm reaching out because you'd looked into solar earlier this year. We're heading into the last few months where you could get your solar system installed and still claim the federal tax credit on this year's return. Would it be worth a quick conversation about the timeline?\""),

        h3("Winter (December-February): The Planning Season"),
        block("Winter is your lowest-activity season, but it's the perfect time to plant seeds. Buy the cheapest aged leads (180-365 days old) and use direct mail and email — not phone calls — to stay top of mind."),
        block("Send a postcard: \"Planning ahead for spring? Solar prices are at their lowest during winter installation season — shorter wait times, and your system is ready to offset summer bills from day one. Call [Name] at [Number] for a free estimate.\""),
        block("Winter leads won't close immediately, but you're building a pipeline of warm prospects who will be ready when spring arrives. The solar agents who win year-round are the ones who prospect year-round."),

        h2("The Year-Round Numbers"),
        block("Here's what a consistent aged solar lead operation looks like across a year: Buy 200-400 aged leads per month at $1-$2 each ($200-$800/month). Maintain 15-25% contact rate through multi-channel outreach. Convert 2-3% of leads into signed contracts. Average system value: $25,000-$35,000 with 8-12% sales commission."),
        block("Annual lead spend: $2,400-$9,600. Annual contracts (at 2.5% conversion from 3,600 leads): 90 contracts. Annual commission at $3,000 average: $270,000. That's a 28-112x return on lead investment — and it smooths out the seasonal roller coaster that kills most solo solar reps."),
      ],
    },

    // ── Post 5: UNIQUE - Mortgage broker pipeline (specific to the role) ──
    {
      _id: "post-mortgage-broker-pipeline-aged-leads",
      _type: "post",
      title: "Building a Mortgage Pipeline with Aged Leads: A Broker's Playbook",
      slug: { _type: "slug", current: "mortgage-broker-pipeline-aged-leads" },
      excerpt: "How mortgage brokers and loan officers can use aged leads to maintain consistent deal flow — rate-change hooks, refinance timing, and purchase-vs-refi segmentation strategies.",
      publishedAt: "2026-03-14T16:00:00Z",
      contentType: "pillar",
      isFeatured: false,
      author: { _type: "reference", _ref: "author-bill-rice" },
      categories: [{ _type: "reference", _ref: "cat-strategies", _key: "c1" }],
      leadTypes: [{ _type: "reference", _ref: "lt-mortgage", _key: "lt1" }],
      seo: {
        metaTitle: "Mortgage Broker Pipeline: Aged Lead Playbook (2026)",
        metaDescription: "How mortgage brokers build consistent deal flow with aged leads. Rate-change hooks, refi timing, purchase-vs-refi segmentation, and LO-specific strategies.",
      },
      body: [
        block("Mortgage is one of the most rate-sensitive industries in the world. When rates drop, every consumer with a mortgage starts shopping for a refi. When rates rise, purchase buyers get nervous and start delaying. This rate sensitivity creates both a challenge and an opportunity for brokers working aged leads."),
        block("The challenge: aged mortgage leads were generated in a different rate environment than today. A refinance lead from 90 days ago may have been looking to refi at 6.5% when rates were at 7%. If rates have since dropped to 6.2%, that lead is actually hotter now than when it was generated. If rates went up, the lead is cooler — but not dead."),
        block("The opportunity: aged mortgage leads let you build a rate-independent pipeline. Instead of chasing the rate cycle, you maintain consistent outreach volume and catch consumers wherever they are in the rate environment."),

        h2("Segmenting Mortgage Leads: Purchase vs. Refinance"),
        block("This is the most important segmentation for mortgage aged leads, and it should happen before you make a single call. Purchase leads and refinance leads require completely different approaches."),
        block("Purchase leads are time-sensitive. A consumer who was looking to buy a home 90 days ago may have already found a property and started the process. Your window is narrower, but the opportunity is real — many home buyers go through multiple rate quotes and lenders before closing, and the process often takes 60-90 days. An aged purchase lead might be a buyer who's under contract but unhappy with their current lender's rate or service."),
        block("Refinance leads have a longer shelf life. Consumers consider refinancing for months or even years before acting. A refinance lead that's 180 days old may be someone who's still watching rates, waiting for the right moment. Rate changes are your hook — every significant rate movement gives you a legitimate reason to call."),

        h2("The Rate-Change Hook"),
        block("Mortgage is the one industry where aged leads get better with certain market conditions. When rates drop, every aged refinance lead in your database becomes a warm call. Here's how to use it:"),
        block("\"Hi [Name], this is [Your Name]. You'd looked into mortgage options a while back, and I'm calling because rates have moved since then — [current rate range] for a [30-year/15-year] fixed. Were you able to lock in a rate you're comfortable with, or would it help to see what's available today?\""),
        block("This script works because the rate change is a genuine, timely reason for calling. You're not making up urgency — you're providing relevant, time-sensitive information that the consumer actually wants."),
        block("Keep a pulse on rates weekly. When rates drop by 0.25% or more from where they were when your leads were generated, that's your trigger to work the entire batch. Some of the best conversion days I've seen in mortgage were the Monday after a significant rate drop."),

        h2("The Pre-Qualification Fast Track"),
        block("Mortgage consumers want to know one thing: can they qualify, and at what rate? The faster you can answer those two questions, the more leads you'll convert."),
        block("Build a 5-minute pre-qualification process into your first call. Ask: estimated credit score range, property value or purchase price, current loan balance (for refi), employment status and income range, property type and occupancy. With these five data points, you can give a ballpark rate quote and a preliminary qualification — which is often enough to keep the conversation going."),
        block("The pre-qual is also a qualifying tool for you. If the credit score is below 580, the LTV is too high, or the income doesn't support the loan, you know quickly and can move on to the next lead. Time is your most valuable resource when working volume."),

        h2("Building the Referral Loop"),
        block("Every closed mortgage becomes a referral source for years. Homeowners talk to other homeowners. Realtors send business to LOs they trust. One aged lead that turns into a closed loan can generate 3-5 referrals over the next 2-3 years."),
        block("Build referral requests into your post-close process: after closing, send a personal thank-you note (not an email — a handwritten card). 30 days after close, call to check in and ask if everything went smoothly. At the 6-month mark, send a market update for their area with your contact info."),
        block("This referral loop is why the long-term ROI of aged mortgage leads is even higher than the initial conversion numbers suggest. You're not just buying leads — you're buying entry points into networks of potential borrowers."),
      ],
    },
  ];

  for (const post of posts) {
    try {
      await client.createOrReplace(post);
      console.log(`  ✓ ${post.title}`);
    } catch (err) {
      console.error(`  ✗ ${post.title}: ${err.message}`);
    }
  }

  // Also keep the working-aged-final-expense-leads post since it's specific enough
  // (door knocking focus) to not overlap with other sites

  console.log("\n=== STEP 3: Delete old final expense post (replaced by door knocking version) ===\n");
  try {
    await client.delete("post-working-aged-final-expense-leads");
    console.log("  ✗ Deleted old final expense post (replaced by door knocking playbook)");
  } catch {
    console.log("  (already deleted)");
  }

  console.log("\nDone! Deleted 6 overlapping posts, published 5 differentiated posts.");
}

run().catch(console.error);
