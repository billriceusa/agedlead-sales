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
    _type: "block",
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  };
}

function h2(text) { return block(text, "h2"); }
function h3(text) { return block(text, "h3"); }
function k() { return Math.random().toString(36).slice(2, 10); }

const pillarRef = "post-what-are-aged-leads";

const posts = [
  // ── Post 2: Aged vs Real-Time ──
  {
    _id: "post-aged-vs-real-time-leads",
    _type: "post",
    title: "Aged Leads vs Real-Time Leads: Which Delivers Better ROI?",
    slug: { _type: "slug", current: "aged-leads-vs-real-time-leads" },
    excerpt: "A side-by-side comparison of aged leads and real-time leads — cost, conversion rates, competition, and ROI. The numbers tell a clear story.",
    publishedAt: "2026-03-14T14:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    pillarPost: { _type: "reference", _ref: pillarRef },
    author: { _type: "reference", _ref: "author-bill-rice" },
    categories: [{ _type: "reference", _ref: "cat-roi", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-insurance", _key: "lt1" },
      { _type: "reference", _ref: "lt-mortgage", _key: "lt2" },
    ],
    seo: {
      metaTitle: "Aged Leads vs Real-Time Leads: ROI Comparison (2026)",
      metaDescription: "Compare aged leads vs real-time leads on cost, conversion rate, competition, and ROI. See why aged leads often deliver 3-5x better returns for sales professionals.",
    },
    body: [
      block("If you're buying leads for your sales business, you've faced the fundamental question: should you pay premium prices for real-time leads, or buy aged leads in bulk at a fraction of the cost? I've spent 20+ years working both types across insurance, mortgage, and solar — and the answer depends on your business model, budget, and willingness to do the follow-up work."),
      block("Here's the honest comparison, with real numbers from actual campaigns."),

      h2("The Cost Difference"),
      block("This is where the conversation starts and often ends. Real-time leads cost $15-$60+ per record depending on vertical. Insurance leads average $25-$40. Mortgage leads run $30-$60. Final expense leads cost $20-$40. MVA leads can hit $50-$200."),
      block("Aged leads for the same verticals cost $0.25-$5 per record. That's an 80-95% cost reduction. A $500 budget buys you roughly 16 real-time leads or 500 aged leads. That volume difference is the entire aged lead thesis."),

      h2("Competition: The Hidden Cost of Real-Time"),
      block("Here's what most real-time lead vendors don't advertise: your lead is being sold to 3-8 other buyers simultaneously. The moment that consumer hits submit, a race begins. If you don't call within 60 seconds, you've already lost to the agent who did."),
      block("This creates a hidden cost beyond the lead price itself — you need instant response infrastructure. Dedicated intake staff, auto-dialers, real-time CRM notifications. For a solo agent or small team, this is often impractical."),
      block("Aged leads have virtually no competition. You're the only person calling that consumer this month. You can plan your outreach, research the prospect, and call when you're prepared — not when a notification buzzes."),

      h2("Conversion Rates: The Full Picture"),
      block("Real-time leads convert at 5-15% on average. Aged leads convert at 1-5%. On the surface, that looks like real-time wins. But conversion rate without context is misleading."),
      block("Let's run the actual math on a $500 monthly budget with a $1,000 average deal value:"),
      block("Real-time scenario: $500 ÷ $30/lead = 16 leads. At 10% conversion = 1.6 sales. Revenue: $1,600. ROI: 220%."),
      block("Aged lead scenario: $500 ÷ $1/lead = 500 leads. At 2% conversion = 10 sales. Revenue: $10,000. ROI: 1,900%."),
      block("The aged lead scenario produces 6x more sales and nearly 9x better ROI. The lower conversion rate is overwhelmed by the volume advantage."),

      h2("When Real-Time Leads Make Sense"),
      block("I'm not anti-real-time leads. They work well in specific situations: when you have a large call center with instant response capability, when your margins are high enough to absorb $30-$60 per lead, when you're in a market where speed determines who gets the business (like auto insurance), or when you need a small number of high-probability prospects."),
      block("If you can call within 30 seconds, have a team dedicated to intake, and your average deal value justifies the cost — real-time leads can work. But that describes a minority of sales professionals."),

      h2("When Aged Leads Win"),
      block("Aged leads are the better choice for most sales professionals: solo agents and small teams who can't win the speed-to-call race, anyone on a budget who needs pipeline volume, agents who prefer to work at their own pace with prepared outreach, markets where the buying cycle is long (mortgage, IUL, solar, Medicare), and anyone who's been burned by the economics of real-time leads."),
      block("The sweet spot is using aged leads as your pipeline foundation and supplementing with a small number of real-time leads when your budget allows. This gives you consistent volume plus occasional high-conversion opportunities."),

      h2("The Bottom Line"),
      block("After 20 years of working both types, here's my honest assessment: real-time leads are a speed game with thin margins. Aged leads are a volume game with thick margins. Most sales professionals make more money with aged leads because they can actually sustain the economics month after month."),
      block("Don't take my word for it — run your own numbers in our free ROI Calculator and see which approach works better for your specific situation."),
    ],
  },

  // ── Post 3: How to Work Aged Leads ──
  {
    _id: "post-how-to-work-aged-leads",
    _type: "post",
    title: "How to Work Aged Leads: The Complete System for Maximum Conversions",
    slug: { _type: "slug", current: "how-to-work-aged-leads" },
    excerpt: "The step-by-step system for working aged leads — from list prep to follow-up cadence to closing. Based on 20+ years of working millions of leads.",
    publishedAt: "2026-03-14T15:00:00Z",
    contentType: "cluster",
    isFeatured: true,
    pillarPost: { _type: "reference", _ref: pillarRef },
    author: { _type: "reference", _ref: "author-bill-rice" },
    categories: [{ _type: "reference", _ref: "cat-strategies", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-insurance", _key: "lt1" },
      { _type: "reference", _ref: "lt-mortgage", _key: "lt2" },
      { _type: "reference", _ref: "lt-final-expense", _key: "lt3" },
    ],
    seo: {
      metaTitle: "How to Work Aged Leads: Complete System (2026 Guide)",
      metaDescription: "The step-by-step system for working aged leads from prep to close. Scripts, cadences, and strategies from 20+ years working millions of leads.",
    },
    body: [
      block("Most agents who fail with aged leads don't have a lead quality problem — they have a system problem. They buy a batch, make a few calls, get discouraged by voicemails, and conclude that aged leads don't work. I've seen this pattern thousands of times."),
      block("Aged leads absolutely work. But they require a fundamentally different approach than real-time leads. Here's the complete system I've developed over 20+ years of working millions of leads across insurance, mortgage, and solar."),

      h2("Step 1: Prepare Before You Dial"),
      block("Spend 20% of your time on preparation. Most agents skip this and it costs them conversions."),
      block("Clean your list first. Remove duplicates, scrub against the DNC registry, and verify phone numbers if your vendor hasn't already. Segment leads by age — work 30-60 day leads first, then 60-90, then 90+. Fresher aged leads have higher contact rates."),
      block("Pre-research each lead for 30 seconds before calling: what did they request? What state are they in? Is this a homeowner (for insurance/mortgage)? This context turns a cold call into an informed conversation."),

      h2("Step 2: The Multi-Channel Cadence"),
      block("The biggest mistake is relying on phone calls alone. Aged leads require a multi-channel approach over 10-14 days:"),
      block("Day 1: Direct mail — send a personal letter or postcard. This arrives before your call and primes the prospect. Day 3: First phone call using the Honest Follow-Up script. If no answer, leave a voicemail. Day 4: Personal email — plain text, no HTML templates. Reference your call attempt. Day 7: Second phone call at a different time of day. Day 10: Final touch — door knock if local, or a second email with a specific value offer."),
      block("This cadence works because each channel reinforces the others. The prospect sees your name on a letter, hears your voicemail, reads your email. By touch 3-4, you're familiar — not a stranger."),

      h2("Step 3: The Honest Follow-Up Script"),
      block("I call this the most important skill in working aged leads. Your opening line determines whether the conversation continues or ends. Here's what works:"),
      block("\"Hi [Name], this is [Your Name]. I'm following up on some older inquiry records from [Month] regarding [Product]. It doesn't look like we ever spoke, so I wanted to make sure you were able to get what you needed — or is this still on your to-do list?\""),
      block("Why this works: it's honest about the timeline (\"older inquiry\"), transparent about the lack of relationship (\"doesn't look like we ever spoke\"), low-pressure (\"make sure you got what you needed\"), and it captures the procrastinators while giving everyone else an easy out."),
      block("What NOT to do: don't say \"I'm calling about your request\" (implies a relationship that doesn't exist), don't use high-pressure tactics, don't read from a script robotically. Memorize the framework and make it natural."),

      h2("Step 4: Handle the Common Objections"),
      block("You'll hear the same objections repeatedly. Here's how to handle them:"),
      block("\"I already took care of that.\" — Great! Happy to hear it. Out of curiosity, are you satisfied with what you ended up with? (This opens cross-sell opportunities.)"),
      block("\"I don't remember filling out a form.\" — Totally understand, it was a while back. You had looked into [specific product] — I just wanted to make sure you got the help you needed. (Most people genuinely don't remember. Don't argue about it.)"),
      block("\"I'm not interested.\" — No problem at all. If anything changes, I'm happy to help. Have a great day. (Don't push. Mark the lead and move on. Your time is better spent on the next dial.)"),

      h2("Step 5: Track Everything"),
      block("If you're not tracking your numbers in a CRM, you're flying blind. At minimum, track: dials per hour, contact rate (answered calls ÷ total dials), conversations (contacts that last 60+ seconds), appointments or applications, closed deals."),
      block("These numbers tell you exactly where your system is breaking down. Low contact rate? Adjust your calling times. High contact rate but low conversion? Fix your script. Good conversion but not enough volume? Buy more leads."),
      block("The math is simple: if you need 10 sales this month and you convert at 2%, you need 500 leads. If your contact rate is 10%, you need 5,000 dials across those 500 leads. That's roughly 250 dials per working day. Is your system set up to support that volume?"),

      h2("Step 6: Scale What Works"),
      block("Once you have 30 days of data, you'll know your numbers: cost per lead, contact rate, conversion rate, revenue per sale, and ROI. If the ROI is positive (and with aged leads, it almost always is), the playbook is simple: buy more leads and keep working the system."),
      block("Start with 100-200 leads to prove the system. Then scale to 500. Then 1,000. Each batch gives you more data to refine your approach — better calling times, better scripts, better channels for your specific market."),
      block("The agents who make the most money with aged leads aren't the best closers — they're the most consistent. They work the system every day, track their numbers, and let the volume do the heavy lifting."),
    ],
  },

  // ── Post 4: How Much Do Aged Leads Cost? ──
  {
    _id: "post-aged-leads-cost-pricing-guide",
    _type: "post",
    title: "How Much Do Aged Leads Cost? Pricing Guide by Industry (2026)",
    slug: { _type: "slug", current: "how-much-do-aged-leads-cost" },
    excerpt: "A transparent breakdown of aged lead pricing across insurance, mortgage, final expense, solar, Medicare, and more. What affects price and what you should expect to pay.",
    publishedAt: "2026-03-14T16:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    pillarPost: { _type: "reference", _ref: pillarRef },
    author: { _type: "reference", _ref: "author-bill-rice" },
    categories: [{ _type: "reference", _ref: "cat-roi", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-insurance", _key: "lt1" },
      { _type: "reference", _ref: "lt-mortgage", _key: "lt2" },
      { _type: "reference", _ref: "lt-final-expense", _key: "lt3" },
      { _type: "reference", _ref: "lt-solar", _key: "lt4" },
      { _type: "reference", _ref: "lt-medicare", _key: "lt5" },
    ],
    seo: {
      metaTitle: "How Much Do Aged Leads Cost? 2026 Pricing Guide",
      metaDescription: "Aged lead pricing by industry: insurance $0.25-$2, mortgage $0.50-$3, final expense $0.50-$3, solar $0.50-$3, Medicare $0.50-$3. What affects cost and what to expect.",
    },
    body: [
      block("One of the first questions I get from agents exploring aged leads is: how much do they actually cost? The answer depends on three factors: the industry, the age of the lead, and your geographic targeting. Here's a transparent breakdown based on current market pricing."),

      h2("Aged Lead Pricing by Industry"),
      block("Insurance leads (auto, home, life, health): $0.25-$2.00 per lead. Insurance is the most affordable vertical because of the high volume of online quote requests and the breadth of insurance types. Auto and home leads are typically cheapest. Life insurance leads command a slight premium."),
      block("Mortgage leads (purchase, refinance, HELOC): $0.50-$3.00 per lead. Mortgage leads cost more because the consumer data is more detailed (loan amounts, property values, credit ranges) and the commission per closed deal is significantly higher."),
      block("Final expense leads: $0.50-$3.00 per lead. Final expense sits in the middle of the pricing spectrum. These are seniors who expressed interest in burial insurance — a relatively straightforward product with consistent demand."),
      block("IUL (Indexed Universal Life) leads: $1.00-$5.00 per lead. IUL leads are the most expensive aged leads because the product is high-value and high-commission. The consumers are typically affluent and the policy sizes are large."),
      block("Solar leads: $0.50-$3.00 per lead. Solar leads include property information and electricity costs, making them more detailed than basic insurance leads. Pricing varies by state — leads in high-electricity-cost states command a premium."),
      block("Medicare leads: $0.50-$3.00 per lead. Medicare leads are seasonal — prices may fluctuate around the Annual Enrollment Period (October-December). Year-round, they're consistently priced in this range."),
      block("SSDI leads: $0.50-$3.00 per lead. Disability claim leads are moderately priced and tend to have longer relevance windows since the SSDI process takes months to years."),
      block("MVA (Motor Vehicle Accident) leads: $1.00-$5.00 per lead. Personal injury leads command premium pricing because of the high case values for attorneys. Even at $5 per lead, the potential return on a single case makes the economics work."),

      h2("What Affects Aged Lead Pricing"),
      block("Lead age is the biggest pricing factor. Leads that are 30-60 days old cost 2-3x more than leads that are 90-180 days old. This makes sense — fresher aged leads have higher contact rates and conversion potential. But don't dismiss older leads. I've seen agents close deals on leads that were 6-12 months old. The need doesn't disappear just because time passes."),
      block("Geographic targeting also affects price. Leads in high-population states (California, Texas, Florida, New York) may cost slightly more due to demand. Leads filtered to specific zip codes cost more than state-level filtering."),
      block("Data completeness matters too. Leads with verified phone numbers, email addresses, and mailing addresses cost more than leads with only a phone number. The more contact channels you have, the more likely you are to reach the prospect."),

      h2("Cost Per Acquisition: The Number That Actually Matters"),
      block("Lead cost is important, but cost per acquisition (CPA) is what determines your profitability. CPA = total lead spend ÷ number of closed deals."),
      block("Example: You buy 500 insurance leads at $1 each ($500 total). Your conversion rate is 2%, so you close 10 deals. Your CPA is $500 ÷ 10 = $50 per customer. If your average commission is $500 per policy, your ROI is 900%."),
      block("Compare that to real-time leads: 20 leads at $25 each ($500 total). At a 10% conversion rate, you close 2 deals. CPA is $500 ÷ 2 = $250 per customer. Same budget, same commission — but your CPA is 5x higher with real-time leads."),
      block("Always think in terms of CPA, not CPL. A $0.50 lead that converts at 1% has a lower CPA than a $25 lead that converts at 5%."),

      h2("How to Get the Best Value"),
      block("Start with a test batch of 200-500 leads to establish your baseline numbers before buying in volume. Focus on one vertical at a time — mixing lead types dilutes your attention and makes it harder to optimize your scripts."),
      block("Consider lead age strategically: if you have strong follow-up systems, older (cheaper) leads can deliver excellent ROI. If you want the highest possible contact rates, invest in 30-60 day leads. Many experienced agents use a blend — 30-60 day leads for their primary calling and 90+ day leads for direct mail campaigns."),
      block("Track your numbers religiously. After 30 days, you'll know your actual CPA and ROI. Use those numbers, not assumptions, to decide how much to invest in your next batch."),
    ],
  },

  // ── Post 5: Scripts for Calling Aged Leads ──
  {
    _id: "post-scripts-for-aged-leads",
    _type: "post",
    title: "5 Proven Scripts for Calling Aged Leads (With Real Examples)",
    slug: { _type: "slug", current: "scripts-for-calling-aged-leads" },
    excerpt: "The exact call scripts that convert aged leads — for insurance, mortgage, final expense, solar, and general use. Each script with delivery tips and objection handling.",
    publishedAt: "2026-03-14T17:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    pillarPost: { _type: "reference", _ref: pillarRef },
    author: { _type: "reference", _ref: "author-bill-rice" },
    categories: [{ _type: "reference", _ref: "cat-scripts", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-insurance", _key: "lt1" },
      { _type: "reference", _ref: "lt-mortgage", _key: "lt2" },
      { _type: "reference", _ref: "lt-final-expense", _key: "lt3" },
      { _type: "reference", _ref: "lt-solar", _key: "lt4" },
    ],
    seo: {
      metaTitle: "5 Proven Scripts for Calling Aged Leads (2026)",
      metaDescription: "Exact call scripts for aged insurance, mortgage, final expense, and solar leads. Each with delivery tips and objection handling from 20+ years of experience.",
    },
    body: [
      block("Your opening line on an aged lead call determines everything. Get it wrong and you hear a click in 3 seconds. Get it right and you're in a real conversation with a qualified prospect. After 20+ years of calling and training agents, here are the 5 scripts that consistently convert."),
      block("One important note before the scripts: don't read these word-for-word. Memorize the framework, internalize the psychology behind each line, and deliver it naturally. A perfectly worded script read robotically will always lose to an imperfect script delivered like a human being."),

      h2("Script 1: The Universal Honest Follow-Up"),
      block("This works across every vertical and is the foundation of all aged lead calling:"),
      block("\"Hi [Name], this is [Your Name]. I'm following up on some older inquiry records from [Month] regarding [Product]. It doesn't look like we ever spoke, so I wanted to make sure you were able to get what you needed — or is this still on your to-do list?\""),
      block("Why it converts: \"Older inquiry records\" is honest about the timeline. \"Doesn't look like we ever spoke\" avoids faking a relationship. \"Still on your to-do list\" captures procrastinators without pressuring people who already bought."),
      block("Delivery tip: Pause after \"to-do list\" and let them respond. Don't fill the silence. The pause creates space for them to think and answer honestly."),

      h2("Script 2: The Insurance Check-In"),
      block("Tailored for auto, home, life, and health insurance leads:"),
      block("\"Hi [Name], this is [Your Name] with [Agency]. You had looked into [insurance type] coverage a while back — I wanted to check in and see if you found a policy you're happy with, or if you're still comparing options?\""),
      block("If they say they got coverage: \"Great! Out of curiosity, when does your policy renew? I'd love to run a quick comparison when that comes up — rates change constantly and a lot of people find they're overpaying after a year.\" This turns a closed door into a future opportunity and opens cross-sell conversations."),
      block("If they haven't gotten coverage: \"No worries — a lot of people start the process and get busy. If you have 2 minutes, I can give you a quick ballpark quote right now. What's most important to you in your coverage?\""),

      h2("Script 3: The Mortgage Rate Hook"),
      block("Mortgage leads respond to rate-specific openers because rates change constantly:"),
      block("\"Hi [Name], this is [Your Name]. You had looked into mortgage options a while back, and I wanted to reach out because rates have [moved/dropped] since then. Were you able to lock in a rate you're comfortable with, or would it help to see what's available today?\""),
      block("Why it converts: Leading with rate movement gives a legitimate, timely reason for calling. Even if they've been procrastinating, new rate information feels like a fresh opportunity rather than a stale sales call."),
      block("Key delivery detail: Know the current rate environment before you call. If rates have dropped since their inquiry, that's your strongest hook. If rates have risen, pivot to \"I can help you lock something in before they go higher.\""),

      h2("Script 4: The Final Expense Care Script"),
      block("The senior market requires a softer, more empathetic approach:"),
      block("\"Hi [Name], this is [Your Name]. I'm reaching out because you had looked into some information about final expense coverage a little while back. I just wanted to check — did someone help you get that taken care of, or is that still something on your mind?\""),
      block("Key language choices: \"Get that taken care of\" resonates with seniors — it implies closure and peace of mind. \"Still something on your mind\" acknowledges the emotional weight of planning for end-of-life without being morbid."),
      block("If they're interested: Keep the explanation simple. Monthly premium, coverage amount, no medical exam required. Seniors want clarity, not complexity. Offer to send information by mail — many seniors prefer to review things on paper before committing."),

      h2("Script 5: The Solar Savings Opener"),
      block("Solar leads respond to specific savings data:"),
      block("\"Hi [Name], this is [Your Name]. You had looked into solar options for your home a while back — I'm reaching out because there have been some updates to the solar incentives in [State] that could save you more than before. Did you end up going solar, or are you still considering it?\""),
      block("Why it converts: Mentioning updated incentives gives a fresh, newsworthy reason for calling. Homeowners who were on the fence about solar are often tipped by new savings information. Always know the current federal ITC rate and any state-specific incentives before calling."),

      h2("General Delivery Tips"),
      block("Across all these scripts, a few principles apply: Smile when you talk. It sounds absurd, but smiling changes your vocal tone and makes you sound warmer and more approachable. Stand up while calling — it gives your voice more energy."),
      block("Use the prospect's name early and often. Say your name clearly. Don't rush the opening — the first 10 seconds set the tone for the entire conversation. And always have two follow-up questions ready for when they engage."),
      block("Most importantly: listen more than you talk. The script gets the conversation started. After that, your job is to understand their situation, not to pitch your product. The close happens naturally when people feel heard and understood."),
    ],
  },

  // ── Post 6: Working Aged Final Expense Leads ──
  {
    _id: "post-working-aged-final-expense-leads",
    _type: "post",
    title: "How to Work Aged Final Expense Leads: A Field-Tested Playbook",
    slug: { _type: "slug", current: "working-aged-final-expense-leads" },
    excerpt: "The complete playbook for working aged final expense leads — door knocking strategies, scripts for seniors, direct mail approaches, and conversion tactics that work.",
    publishedAt: "2026-03-14T18:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    pillarPost: { _type: "reference", _ref: pillarRef },
    author: { _type: "reference", _ref: "author-bill-rice" },
    categories: [{ _type: "reference", _ref: "cat-lead-types", _key: "c1" }],
    leadTypes: [
      { _type: "reference", _ref: "lt-final-expense", _key: "lt1" },
    ],
    seo: {
      metaTitle: "How to Work Aged Final Expense Leads: Field-Tested Playbook",
      metaDescription: "Complete playbook for aged final expense leads: door knocking, scripts for seniors, direct mail, and conversion tactics from 20+ years in the field.",
    },
    body: [
      block("Final expense is one of the best verticals for aged leads, and I say that based on data, not opinion. The senior market has unique characteristics that make aged leads work even better than in other verticals: longer decision cycles, persistent need, and a preference for personal, patient sales interactions."),
      block("Here's the complete playbook I've developed for working aged final expense leads — the strategies, scripts, and channel-specific tactics that consistently produce results."),

      h2("Why Final Expense Leads Age So Well"),
      block("Seniors take longer to make decisions. Period. They want to talk to family members, compare options, and think things over. The agent who originally received the lead called within 30 seconds with a hard pitch — and often scared the prospect off."),
      block("When you call 60-180 days later with a gentle, helpful approach, you're meeting the prospect where they actually are: past the initial overwhelm, still needing coverage, and ready for a real conversation. I've seen conversion rates on 90-day final expense leads match or exceed 30-day leads when worked with the right approach."),

      h2("The Three-Channel Approach"),
      block("Final expense is the one vertical where I strongly recommend a three-channel strategy: direct mail, phone calls, and door knocking. Each channel serves a different purpose."),

      h3("Channel 1: Direct Mail First"),
      block("Before you pick up the phone, send a personal letter. Not a flashy postcard — a letter. Handwrite the envelope if you can. Seniors open handwritten mail."),
      block("The letter should be short: introduce yourself, reference that they previously looked into final expense coverage, and let them know you'll be calling to check in. Include your name, phone number, and a line like: \"If you'd prefer to call me directly, I'm available at [number].\""),
      block("Mail drops 3-5 days before your first call. When you call and say your name, there's a chance they'll recognize it from the letter. That recognition alone can double your contact-to-conversation rate."),

      h3("Channel 2: The Phone Call"),
      block("Use the Final Expense Care Script: \"Hi [Name], this is [Your Name]. I'm reaching out because you had looked into some information about final expense coverage a little while back. I just wanted to check — did someone help you get that taken care of, or is that still something on your mind?\""),
      block("Call during mid-morning (9:30-11:30 AM) or early afternoon (1-3 PM). Seniors tend to be most alert and available during these windows. Avoid evenings and Mondays."),
      block("Keep the conversation simple. Final expense prospects care about three things: how much is the monthly premium, how much coverage do I get, and do I need a medical exam. Have answers to all three ready before you dial."),

      h3("Channel 3: Door Knocking"),
      block("If your leads are local (within 30-45 minutes of driving), door knocking is the highest-converting channel for final expense. I've seen agents convert at 3-5x the rate of phone calls through in-person visits."),
      block("Why it works: seniors trust face-to-face interactions more than phone calls. They can see you, read your body language, and feel more comfortable asking questions. You become a person, not a voice."),
      block("Door knock after your mail piece arrives and after at least one phone attempt. When you arrive, reference both: \"Hi [Name], I'm [Your Name] — I sent you a letter last week and tried calling. I was in the neighborhood and wanted to stop by in person.\""),
      block("Dress professionally but not intimidatingly. Carry your ID and business cards. Be prepared to sit down for 15-20 minutes. Final expense kitchen-table presentations are still one of the most effective sales formats in the insurance industry."),

      h2("Handling Senior-Specific Objections"),
      block("\"I need to talk to my children first.\" — Absolutely. Would it be helpful if I left some information they could review? What's a good time for me to follow up after you've had that conversation?"),
      block("\"I'm on a fixed income, I can't afford it.\" — I completely understand. That's actually why a lot of folks look into this — the monthly premiums start as low as $20-30, and it means your family won't have to worry about those costs. Can I show you what the options look like at different coverage levels?"),
      block("\"I already have life insurance.\" — That's great. A lot of people I talk to have a policy through work or an older term policy. Final expense is different — it's a small policy specifically for the funeral and related costs, so your family doesn't have to touch your other coverage or savings. Would it be worth looking at what a small supplement would cost?"),

      h2("Tracking Your Final Expense Numbers"),
      block("Final expense has some unique metrics to track beyond the standard contact and conversion rates. Track your appointment-to-close ratio (should be 50-70% for in-person sits), average premium per policy, and policy persistency (how many stay on the books after 6 months)."),
      block("A healthy aged final expense operation looks like this: 200-500 leads per month, 10-15% contact rate, 2-4% conversion rate, $40-$70 average monthly premium, and 80%+ 6-month persistency. Those numbers add up to a very profitable, sustainable business."),
    ],
  },
];

async function seed() {
  console.log("Publishing cluster blog posts to Sanity...\n");

  for (const post of posts) {
    try {
      await client.createOrReplace(post);
      console.log(`✓ ${post.title}`);
    } catch (err) {
      console.error(`✗ ${post.title}: ${err.message}`);
    }
  }

  console.log(`\nDone! Published ${posts.length} cluster posts.`);
}

seed().catch(console.error);
