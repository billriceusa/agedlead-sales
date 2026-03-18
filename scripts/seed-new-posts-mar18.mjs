import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

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
  // ── POST 1: How to Buy Aged Leads ──
  {
    _id: "post-how-to-buy-aged-leads",
    _type: "post",
    title: "How to Buy Aged Leads: A First-Timer's Complete Guide",
    slug: { _type: "slug", current: "how-to-buy-aged-leads" },
    excerpt: "Everything you need to know before buying your first batch of aged leads — vendor evaluation, pricing, DNC compliance, and ROI calculation from 25+ years of experience.",
    publishedAt: "2026-03-18T14:00:00Z",
    contentType: "pillar",
    isFeatured: true,
    author: ref("author-bill-rice"),
    categories: [ref("cat-getting-started")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-final-expense")],
    seo: {
      metaTitle: "How to Buy Aged Leads: First-Timer's Guide (2026)",
      metaDescription: "Complete guide to buying aged leads for the first time. Vendor evaluation, pricing, DNC scrubbing, replacement guarantees, and ROI calculation from 25+ years of experience.",
    },
    body: [
      block("Buying aged leads for the first time can feel like walking into a casino — you know there's money to be made, but you're not sure if the odds are in your favor. I get it. After 25 years in the lead business and working with agents who have collectively dialed millions of aged leads, I can tell you the odds are absolutely in your favor — if you know what you're doing."),
      block("This guide is everything I wish someone had told me before I bought my first batch. I'm going to walk you through what aged leads actually are, how to find a reputable vendor, what to look for in lead quality, how many to buy for your first order, and how to calculate whether the investment makes sense before you spend a dollar."),
      block("If you follow this guide, you'll avoid the mistakes that cause most first-time buyers to give up after one bad batch. And you'll set yourself up for the kind of ROI that makes aged leads the most cost-effective prospecting channel in insurance, mortgage, and financial services."),

      h2("What Aged Leads Actually Are"),
      block("An aged lead is a consumer who previously filled out an online form expressing interest in a product — insurance, a mortgage quote, solar installation, whatever the vertical — but that lead is no longer considered 'fresh.' The definition of 'aged' varies by vendor, but it generally means the lead is anywhere from 30 days to 2+ years old."),
      block("Here's the critical thing most new buyers miss: these are real people who had a real need. They filled out a form because they wanted insurance, needed a mortgage, or were shopping solar panels. The fact that they did it 60 or 90 days ago doesn't erase the need — it just means the original buyer either didn't reach them or didn't close them."),
      block("In my experience, about 70-80% of leads that are sold as 'real-time' never actually get worked properly by the original buyer. The agent calls once, maybe twice, and moves on. That means the vast majority of aged leads have barely been contacted. You're not getting leftovers — you're getting overlooked opportunities."),
      block("The age ranges you'll typically see from vendors are 30-60 days, 60-90 days, 90-180 days, and 180+ days. Generally, the older the lead, the cheaper it is. A 30-day-old insurance lead might cost $3-5, while a 180-day-old lead might cost $0.50-1.00. The sweet spot for most agents starting out is 60-90 days — old enough to be affordable, recent enough that circumstances haven't changed dramatically."),

      h2("Where to Buy Aged Leads"),
      block("There are three main sources for aged leads, and each has tradeoffs you should understand before you buy."),

      h3("Dedicated Aged Lead Vendors"),
      block("These are companies whose entire business model is selling aged leads. They aggregate leads from multiple original sources, age them, and resell them at a fraction of the original price. The best vendors in this category invest heavily in data quality — DNC scrubbing, phone number validation, duplicate removal, and replacement guarantees."),
      block("The advantage of a dedicated vendor is specialization. They understand what agents need because that's all they do. The data is usually cleaner, the filtering options are better, and customer support understands your business. The Aged Lead Store is an example of this model — full disclosure, I work closely with them and I recommend them because I've seen the data quality firsthand."),

      h3("Lead Aggregators and Marketplaces"),
      block("These are platforms where multiple lead generators list their inventory. Think of it like an eBay for leads. You can often find good deals, but quality is inconsistent because you're buying from different sources with different standards."),
      block("If you go this route, start with a very small test order — 25-50 leads — and evaluate the data quality before committing to a larger purchase. Check phone number validity, look for duplicates within your batch, and verify that the leads match the geographic and demographic filters you requested."),

      h3("Direct from Lead Generators"),
      block("Some companies that generate real-time leads also sell their aged inventory directly. This can be a good option because you know exactly where the leads came from — a specific landing page, a specific ad campaign. The downside is that these leads may have been sold to multiple agents as real-time leads before being aged out, which means they've potentially been called by 5-8 different agents already."),

      h2("How to Evaluate a Vendor Before You Buy"),
      block("Not all aged lead vendors are created equal, and a bad vendor can sour you on the entire channel. Here's my vendor evaluation checklist — I've refined this over two decades of buying and selling leads."),

      h3("DNC Scrubbing"),
      block("This is non-negotiable. Your vendor must scrub their leads against the National Do Not Call Registry before selling them to you. If they don't, you're exposed to fines of up to $51,744 per violation. Ask the vendor directly: 'How often do you scrub your database against the DNC registry?' The answer should be at minimum monthly, ideally weekly."),
      block("Beyond federal DNC, some states have their own do-not-call lists with additional restrictions. A quality vendor scrubs against both. If the vendor can't clearly explain their DNC compliance process, walk away. The risk isn't worth the savings."),

      h3("Replacement Guarantees"),
      block("A reputable vendor stands behind their data. Look for a replacement guarantee that covers disconnected numbers, wrong numbers, and duplicate leads within your order. The industry standard is replacement for any lead with a non-working primary phone number."),
      block("Ask specifically: 'If I get a disconnected number, what's the process for getting a replacement lead?' A good vendor makes this easy — you flag the bad lead in their system and get a replacement automatically. A vendor who makes replacements difficult or doesn't offer them is telling you something about their data quality."),

      h3("Data Freshness and Source Transparency"),
      block("Even though these are aged leads, the underlying data should be maintained. Phone numbers change, people move, email addresses get abandoned. Ask the vendor how they handle data hygiene beyond the initial aging."),
      block("Also ask where the leads originally came from. Were they generated from search ads, social media ads, organic content, or co-registration? Search-generated leads tend to have the highest intent because the consumer was actively searching for a solution. Co-registration leads — where someone checks a box while signing up for something else — tend to have the lowest intent."),

      h3("Filtering and Targeting Options"),
      block("You should be able to filter leads by geography (state, zip code, radius), lead age, and lead type at minimum. Better vendors also offer filtering by estimated income, homeownership status, age of the consumer, and coverage amount requested."),
      block("The more precisely you can target, the better your conversion rates will be. An insurance agent specializing in final expense in Florida shouldn't be buying a mixed bag of life insurance leads from all 50 states."),

      h3("Exclusivity and Resale Policy"),
      block("Ask how many times a lead has been sold. Some vendors sell leads to unlimited buyers, which means you might be the 10th agent calling the same prospect. Others limit resales to 2-3 buyers. Obviously, fewer buyers means less competition and higher contact rates for you."),
      block("Exclusive aged leads — sold to only one buyer — do exist but cost more. For a first-time buyer, semi-exclusive (sold to 2-3 agents) offers the best balance of cost and contact rates."),

      h2("How Many Leads to Buy for Your First Batch"),
      block("This is one of the most common questions I get, and my answer is always the same: buy 50-100 leads for your first order. Not 500. Not 1,000. Fifty to one hundred."),
      block("Here's why. Your first batch is a learning experience, not a revenue play. You're going to make mistakes — your script needs refinement, your calling cadence isn't dialed in, your CRM workflow has gaps. You want to make those mistakes on a small batch, not a large one."),
      block("At 50-100 leads priced at $1-3 each, your total investment is $50-300. That's a small enough amount that even if everything goes wrong, you haven't blown your budget. But it's large enough to give you meaningful data on contact rates, conversation rates, and your own performance."),
      block("After you work through your first 50-100 leads, you'll have real numbers to work with. You'll know your contact rate (typically 10-15%), your conversation rate (typically 20-30% of contacts), and your close rate (typically 5-15% of conversations). Those numbers tell you exactly how many leads you need to buy to hit your income goals."),

      h2("What to Expect: Contact and Conversion Rates"),
      block("Let me set realistic expectations so you don't panic when your first day of calling doesn't produce five sales. Here are the benchmarks I've seen across thousands of agents working aged leads:"),

      h3("Contact Rates"),
      block("On your first dial attempt, expect to reach 8-12% of your leads by phone. This is live answers only — not voicemails. By the time you've made 5-7 dial attempts per lead over 2-3 weeks, your cumulative contact rate should reach 25-40%. This is why a multi-touch cadence is essential — I'll talk more about this below."),
      block("If your contact rate is below 8% on first attempt, something is wrong with the data. Flag it with your vendor and request replacements for disconnected numbers. If your contact rate is above 15% on first attempt, you've got great data — lean into it."),

      h3("Conversion Rates"),
      block("Of the people you actually speak with, expect 1-5% to convert to a sale on aged leads. This varies enormously by industry, product, and your skill level. Insurance agents working final expense aged leads often see 3-5% conversion on contacts. Mortgage loan officers working aged rate-shoppers might see 1-3%."),
      block("These numbers might seem low compared to real-time leads, but remember the math: you're paying $1-3 per lead instead of $20-75. Your cost per acquisition on aged leads is often lower than real-time leads despite the lower conversion rate."),

      h3("Timeline to Results"),
      block("Don't expect to close a deal on day one. Most aged lead sales happen between the 3rd and 7th contact attempt. Your first week will feel unproductive — lots of voicemails, lots of 'not interested,' lots of no-answers. By week two, callbacks start coming in. By week three, you're having real conversations with people who remember your voicemail or email."),
      block("I've seen agents quit after three days because they didn't close anything. The agents who succeed are the ones who commit to working a batch completely — every lead gets 7+ attempts across phone, email, and voicemail — before judging the channel."),

      h2("How to Calculate ROI Before Buying"),
      block("You can predict your ROI before you spend a dollar. Here's the formula I use, and it works across every vertical I've tested."),
      block("Step 1: Determine your average revenue per closed deal. For insurance, this is your average first-year commission. For mortgage, it's your average loan officer compensation per funded loan. Let's use $500 as an example — a conservative first-year commission on a term life policy."),
      block("Step 2: Estimate your conversion rate on contacts. If you're brand new, use 2%. If you have experience, use 3-5%. We'll use 3%."),
      block("Step 3: Estimate your contact rate. Use 30% as a cumulative rate over your full cadence (5-7 attempts). This is realistic if the data is decent."),
      block("Step 4: Run the math. Buy 100 leads at $2 each = $200. Contact 30% = 30 conversations. Close 3% of conversations = 0.9 sales. Revenue: 0.9 x $500 = $450. ROI: ($450 - $200) / $200 = 125%."),
      block("That's a 125% ROI on a conservative scenario. And it gets better with scale and experience — as your close rate improves from 3% to 5%, the same 100 leads produce $750 in revenue for a 275% ROI."),
      block("Use the ROI Calculator on this site to run your own numbers with your specific commission structure and product mix. It takes two minutes and gives you a clear picture before you buy."),

      h2("Common First-Timer Mistakes"),
      block("I've watched thousands of agents buy aged leads for the first time, and the same mistakes come up over and over. Here's how to avoid them."),

      h3("Mistake 1: Buying Too Many Leads Upfront"),
      block("Enthusiasm is great, but buying 1,000 leads before you've proven your process is a recipe for waste. Start with 50-100 leads. Prove your cadence works. Then scale. I've seen agents buy 5,000 leads on day one and then not have the bandwidth to work them — those leads sit in a spreadsheet aging further while the agent feels overwhelmed."),

      h3("Mistake 2: Calling Once and Moving On"),
      block("The biggest ROI killer in aged leads is the single-dial agent. They call a lead once, get a voicemail, and never call again. Your money is in the follow-up. My data consistently shows that 80% of sales happen after the 4th contact attempt. If you're calling once and moving on, you're leaving 80% of your revenue on the table."),

      h3("Mistake 3: Not Leaving Voicemails"),
      block("Some agents think voicemails are a waste of time. They're wrong. A good voicemail — short, curious, non-salesy — generates callbacks at a 3-5% rate. On 100 voicemails, that's 3-5 inbound calls from people who are warmed up and ready to talk. Those callbacks close at 2-3x the rate of cold contacts."),

      h3("Mistake 4: Using a Real-Time Lead Script"),
      block("Aged leads require a fundamentally different approach than real-time leads. With a real-time lead, the prospect just submitted a form and expects a call. With an aged lead, they submitted that form weeks or months ago. If you open with 'Hi, I'm calling about the insurance quote you requested,' they'll say 'I didn't request any quote' and hang up."),
      block("Instead, acknowledge the time gap: 'Hi [Name], this is [Your Name]. You explored some insurance options a while back, and I wanted to see if you were able to get everything taken care of.' This framing respects their time, acknowledges reality, and opens a conversation instead of triggering a defensive reaction."),

      h3("Mistake 5: Not Tracking Your Numbers"),
      block("If you're not tracking dials, contacts, conversations, appointments, and sales, you're flying blind. You can't improve what you don't measure. Use a simple CRM or even a spreadsheet, but track every interaction. After your first 100 leads, your data will tell you exactly what to adjust."),

      h3("Mistake 6: Ignoring Email and Text Follow-Up"),
      block("Phone calls are the primary channel, but email and text dramatically increase your total contact rate. After a voicemail, send a brief email that references your call. After two unanswered calls, send a text. A multi-channel approach can increase your total contact rate from 30% to 50% or higher."),

      h2("Your First Week Action Plan"),
      block("Here's exactly what I'd do if I were buying aged leads for the first time today:"),
      block("Day 1: Choose a reputable vendor. Order 75 leads filtered to your state and product specialty. Set up a CRM or tracking spreadsheet. Write out your opening script and practice it 10 times out loud."),
      block("Day 2: Start calling. Dial 50 leads. Leave voicemails for every no-answer. Send a follow-up email to every lead you leave a voicemail for. Log every outcome in your CRM."),
      block("Day 3: Call the remaining 25 leads. Re-dial the 50 from yesterday who didn't answer. Leave a different voicemail this time. Log everything."),
      block("Day 4-5: Continue the cadence. By now you'll have a handful of live conversations. Focus on listening, not pitching. Ask questions. Find out if their need still exists. If it does, set an appointment to discuss options in detail."),
      block("Day 6-7: Review your numbers. Calculate your contact rate, conversation rate, and appointment rate. Compare to the benchmarks above. Identify one thing to improve — maybe your voicemail script, maybe your calling time, maybe your opening line."),
      block("By the end of your first week, you'll have more real-world sales experience than most new agents get in their first month. You'll have actual performance data. And you'll know whether aged leads are a fit for your business — spoiler: for most agents, they absolutely are."),

      h2("What Comes Next"),
      block("Once you've worked your first batch and have real data, you're ready to scale. Use the Lead Cost Calculator to figure out your optimal order size based on your proven contact and conversion rates. Check out the 7-Day Follow-Up Cadence playbook for the exact multi-touch sequence I recommend. And if you want to see the math on aged leads versus real-time leads, read my cost comparison guide."),
      block("The agents who build sustainable businesses with aged leads are the ones who treat it like a system, not a gamble. Buy leads consistently, work them completely, track your numbers religiously, and optimize continuously. Do that, and aged leads will become the most reliable and profitable lead source in your business."),
    ],
  },

  // ── POST 2: Aged Leads vs Real-Time Leads ──
  {
    _id: "post-aged-leads-vs-real-time-leads",
    _type: "post",
    title: "Aged Leads vs Real-Time Leads: The True Cost Comparison",
    slug: { _type: "slug", current: "aged-leads-vs-real-time-leads-cost-comparison" },
    excerpt: "A side-by-side cost and ROI comparison of aged vs real-time leads with worked examples. See which lead type actually wins when you run the full math.",
    publishedAt: "2026-03-19T10:00:00Z",
    contentType: "pillar",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-strategies")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-solar")],
    seo: {
      metaTitle: "Aged Leads vs Real-Time Leads: Cost Comparison",
      metaDescription: "Side-by-side cost comparison of aged vs real-time leads with real numbers. ROI math, conversion rates, and worked examples from 25+ years in the lead business.",
    },
    body: [
      block("Every agent I talk to eventually asks the same question: 'Should I buy aged leads or real-time leads?' It's the right question, but most people answer it with gut feel instead of math. I've spent 25 years in the lead business — buying leads, selling leads, and working leads at scale at Quicken Loans — and I can tell you the answer is almost always in the numbers."),
      block("In this guide, I'm going to lay out the true cost comparison between aged leads and real-time leads. Not the sticker price — the actual cost per acquisition when you factor in conversion rates, competition, time investment, and the leads that never pick up the phone. By the end, you'll be able to run this calculation for your own business and make a data-driven decision."),

      h2("The Sticker Price Gap"),
      block("Let's start with the obvious difference: what you pay per lead."),
      block("Real-time leads — delivered within seconds of the consumer filling out a form — typically cost $20-75 per lead depending on the vertical. Insurance leads run $20-40. Mortgage leads run $30-75. Solar leads run $25-50. These prices reflect the fact that you're getting the lead while the consumer's intent is at its peak."),
      block("Aged leads — the same consumer data, but 30-365 days after the original form submission — typically cost $0.50-5 per lead. The exact price depends on how old the lead is, the vertical, and the vendor. A 30-day-old insurance lead might run $3-5. A 180-day-old mortgage lead might be $0.50-1.00."),
      block("On sticker price alone, aged leads are 10-50x cheaper. But sticker price doesn't tell you much. What matters is cost per acquisition — how much you spend per actual closed deal. And that requires looking at conversion rates."),

      h2("Conversion Rate Reality"),
      block("Real-time lead vendors love to quote high conversion rates — and they're not lying, but they're not telling the whole story either."),

      h3("Real-Time Lead Conversion Rates"),
      block("On real-time leads, the industry average conversion rate (form submission to closed sale) is 5-15%, depending on the vertical and how quickly you respond. The catch is that this number assumes you call the lead within 5 minutes of receiving it. Call within 60 seconds, and you'll see the higher end. Call an hour later, and your conversion rate drops to 2-5% — barely better than aged leads."),
      block("There's another factor the real-time lead vendors don't emphasize: competition. Most real-time leads are sold to 3-8 agents simultaneously. That means when a consumer fills out a form for auto insurance, they get 5 calls within 90 seconds. The first agent to connect usually wins. If you're agent number 4 or 5 reaching that consumer, your effective conversion rate drops to 1-3% even though you paid the same $30."),
      block("I saw this firsthand at Quicken Loans. We had speed-to-lead technology that most individual agents can't match — auto-dialers, dedicated inbound teams, sub-10-second response times. Even with that infrastructure, we knew that the agents buying the same leads from the same aggregators didn't have a chance against our speed. The lead vendor got paid either way."),

      h3("Aged Lead Conversion Rates"),
      block("On aged leads, the conversion rate on contacts (people you actually reach by phone) is typically 1-5%. The cumulative contact rate over a full 5-7 attempt cadence is 25-40%. So for every 100 aged leads, you'll talk to 25-40 people and close 1-5 of them."),
      block("The key advantage: competition is minimal. By the time a lead is 60-90 days old, the original buyers have stopped calling. You're often the only agent reaching out. This means your conversations are calmer, less rushed, and more consultative. The prospect isn't comparing you to four other agents who called in the same hour — they're having a genuine one-on-one conversation about their needs."),
      block("I've seen agents with strong scripts and good follow-up cadences consistently hit 4-5% conversion rates on aged leads. Those agents aren't superhuman — they just work the leads systematically instead of cherrypicking."),

      h2("The Real Math: Two Agents, Same Budget"),
      block("Let me show you what this looks like with real numbers. We'll compare two insurance agents — Agent A buying real-time leads and Agent B buying aged leads — both with a $500 monthly lead budget and selling term life insurance with a $600 average first-year commission."),

      h3("Agent A: Real-Time Leads"),
      block("Budget: $500. Lead cost: $35 each. Leads purchased: 14. Contact rate (within 5 minutes): 80% = 11 contacts. But leads are sold to 5 agents on average, so Agent A is actually competing for those contacts. Effective conversion rate: 8% of contacts = 0.9 sales."),
      block("Revenue: 0.9 x $600 = $540. Profit: $540 - $500 = $40. ROI: 8%."),
      block("That's a real scenario for a solo agent buying shared real-time leads. You might get lucky and close 2 deals some months, but you'll also have months where you close zero. The margin is razor-thin."),

      h3("Agent B: Aged Leads"),
      block("Budget: $500. Lead cost: $2 each (90-day-old leads). Leads purchased: 250. Contact rate (over full cadence): 30% = 75 contacts. Competition: minimal (you're likely the only agent calling). Conversion rate: 3% of contacts = 2.25 sales."),
      block("Revenue: 2.25 x $600 = $1,350. Profit: $1,350 - $500 = $850. ROI: 170%."),
      block("Same budget. Same product. Same commission structure. Agent B makes 20x the profit because the math works in her favor at every step — more leads, less competition, and a large enough sample size that the law of averages kicks in."),

      h2("The Volume Advantage"),
      block("There's a factor in the comparison above that deserves its own section: volume. Agent A gets 14 leads per month. Agent B gets 250. This volume difference creates a cascading advantage."),
      block("First, Agent B gets dramatically more practice. In one month, she'll have 75 live conversations compared to Agent A's 11. By month three, Agent B has had 225 conversations while Agent A has had 33. That experience gap compounds — Agent B's scripts improve faster, her objection handling gets sharper, and her confidence grows exponentially."),
      block("Second, Agent B has a real pipeline. At any given time, she has dozens of prospects in various stages of follow-up. Some will call back next week. Some will be ready next month when their current policy renews. Agent A is restarting from near-zero every month because he has so few leads in the funnel."),
      block("Third, Agent B can test and iterate. With 250 leads per month, she can test two different opening scripts on 125 leads each and have statistically meaningful results within 30 days. Agent A would need 6+ months to run the same test with his 14 leads per month. The ability to optimize quickly is an enormous competitive advantage."),

      h2("When Real-Time Leads Make Sense"),
      block("I'm not anti-real-time leads. There are specific situations where they're the right choice:"),
      block("High-ticket, low-volume sales. If your average commission is $5,000+ per deal (think commercial insurance or jumbo mortgages), the economics of real-time leads can work because one closed deal covers many months of lead costs. The higher conversion rate on fresh intent justifies the premium price."),
      block("Speed-to-lead infrastructure. If you have an auto-dialer, a dedicated intake team, or a system that routes leads to available agents within seconds, you can capture the speed advantage that real-time leads are priced for. Without this infrastructure, you're paying for speed you can't deliver."),
      block("Exclusive real-time leads. If you can find a vendor selling exclusive real-time leads (you're the only buyer), the conversion math changes dramatically. Exclusive real-time leads are expensive — $50-100+ — but the absence of competition means conversion rates can hit 15-25%. For experienced agents, this can be very profitable."),

      h2("When Aged Leads Make Sense"),
      block("Aged leads are the better choice for the vast majority of agents and loan officers. Here's when they're especially powerful:"),
      block("Limited budget. If your monthly lead budget is under $2,000, aged leads give you enough volume to build a real pipeline and generate consistent income. Real-time leads at that budget level give you so few opportunities that one bad month can wipe out your entire lead investment."),
      block("Building skills. If you're newer to phone sales, aged leads are the most affordable way to get thousands of reps. You'll develop your pitch, learn objection handling, and build confidence — all at a fraction of the cost of practicing on $35 real-time leads."),
      block("Consistent pipeline. If you need predictable deal flow rather than feast-or-famine swings, aged leads give you a large enough base that the law of averages smooths out your results. 250 leads per month produces more consistent results than 14 leads per month, even if the per-lead quality is lower."),
      block("Multi-channel outreach. If you're willing to call, email, text, and even send direct mail, aged leads reward that effort. Real-time leads are a speed game — call fast or lose. Aged leads are a persistence game — work the cadence and the results come."),

      h2("The Hybrid Strategy"),
      block("The smartest agents I work with use both lead types strategically. Here's the hybrid approach I recommend:"),
      block("Allocate 70% of your lead budget to aged leads. This is your pipeline foundation — high volume, low cost, consistent deal flow. Work these leads with a disciplined 7-touch cadence over 3-4 weeks."),
      block("Allocate 30% of your lead budget to real-time leads. These are your high-intent shots on goal. Make sure you have the systems in place to respond within 60 seconds. These leads should generate faster closes that keep your cash flow positive while your aged lead pipeline matures."),
      block("Track your cost per acquisition separately for each lead type. After 90 days, you'll have clear data on which source produces cheaper acquisitions for your specific business, scripts, and follow-up process. Adjust the allocation based on what the data tells you."),

      h2("The Competition Factor Nobody Talks About"),
      block("I want to emphasize something that gets overlooked in every aged-vs-real-time comparison: the psychological impact of competition on your conversations."),
      block("When you call a real-time lead, you're often the 3rd or 4th agent to reach them in the last 10 minutes. The consumer is overwhelmed, skeptical, and in comparison-shopping mode. They're evaluating you against the other agents simultaneously. The conversation is rushed and transactional — you're competing on price and speed, not on trust and expertise."),
      block("When you call an aged lead, you're typically the only agent reaching out. The consumer may not even remember filling out the form. Your conversation starts from a different place — curiosity rather than comparison. You have time to build rapport, ask questions, and position yourself as an advisor rather than a commodity. These conversations close at higher rates because the relationship dynamic is fundamentally different."),
      block("When I was at Quicken Loans, we dominated real-time leads because we had the technology and team to respond in seconds. For individual agents competing against companies like that, the competition dynamics of real-time leads are brutally unfair. Aged leads level the playing field because the advantage shifts from speed to skill."),

      h2("Total Cost of Acquisition: The Full Picture"),
      block("When you compare lead types, don't just look at lead cost and conversion rate. Factor in your time."),
      block("Real-time leads require you to be available the moment the lead comes in. That means structuring your day around lead delivery schedules, being tethered to your phone, and dropping whatever you're doing to make that instant call. The time cost is high and unpredictable."),
      block("Aged leads let you batch your outreach. Set aside 3-4 hours for calling, blast through your dial list, and then spend the rest of your day on appointments, client service, and personal development. The time cost is predictable and manageable."),
      block("If you value your time at $50/hour and spend 2 extra hours per week managing real-time lead delivery interruptions, that's $400/month in hidden time cost. Add that to your lead spend and the real-time lead ROI looks even worse."),

      h2("The Bottom Line"),
      block("For most agents and loan officers, aged leads deliver a lower cost per acquisition, a larger pipeline, more practice reps, and less competition — all on a smaller budget. Real-time leads have a role in a sophisticated lead strategy, but they're not the foundation most agents should build on."),
      block("Run the math for your own business. Use our Lead Cost Calculator to plug in your actual numbers. Compare your cost per acquisition across both lead types over 90 days. Let the data decide — I'm confident it'll confirm what 25 years of experience has taught me: aged leads are the best-kept secret in sales, and they're hiding in plain sight."),
    ],
  },

  // ── POST 3: Best Time to Call Aged Leads ──
  {
    _id: "post-best-time-call-aged-leads",
    _type: "post",
    title: "Best Time to Call Aged Insurance Leads (By Day and Hour)",
    slug: { _type: "slug", current: "best-time-to-call-aged-insurance-leads" },
    excerpt: "Data-backed calling windows for aged insurance leads by day and hour. Includes senior-specific timing for final expense and Medicare, plus a weekly schedule template.",
    publishedAt: "2026-03-20T10:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-scripts")],
    leadTypes: [ref("lt-insurance"), ref("lt-final-expense"), ref("lt-medicare")],
    seo: {
      metaTitle: "Best Time to Call Aged Insurance Leads (2026)",
      metaDescription: "Data-backed optimal calling times for aged insurance leads by day and hour. Senior-specific timing for final expense and Medicare, with a weekly schedule template.",
    },
    body: [
      block("When you call matters almost as much as what you say. I've analyzed calling data from campaigns targeting hundreds of thousands of aged leads, and the patterns are clear: call at the right time and your contact rate jumps 30-50%. Call at the wrong time and you're burning through leads with nothing to show for it."),
      block("This guide covers the optimal calling windows for aged insurance leads — broken down by day of the week, time of day, and audience type. I've also included a ready-to-use weekly calling schedule that you can start using today."),

      h2("The Science Behind Calling Times"),
      block("There's nothing magical about calling at 10:15 AM instead of 10:30 AM. What matters is understanding the behavioral patterns of your prospects. When are they at home? When are they relaxed and willing to talk? When are they distracted, busy, or annoyed by phone calls?"),
      block("For aged leads, timing matters even more than for real-time leads. With a real-time lead, the consumer just submitted a form — they expect a call regardless of the time. With an aged lead, the consumer may not remember filling out the form. You're essentially making an unexpected call to a warm-but-unaware prospect. The window between 'willing to answer an unknown number' and 'annoyed by a random call' is narrow."),
      block("The data I'm sharing comes from real campaigns across insurance, final expense, and Medicare — not theoretical studies. These are contact rates measured on actual aged lead dial sessions."),

      h2("Best Days to Call"),
      block("Not all weekdays are created equal. Here's how the days rank for aged lead contact rates, from best to worst."),

      h3("Tuesday, Wednesday, and Thursday: The Power Days"),
      block("These three days consistently produce the highest contact rates and the best conversation quality. Contact rates are typically 15-20% higher on Tuesday through Thursday compared to Monday or Friday."),
      block("Why? By Tuesday, people have settled into their week. The Monday chaos is behind them. They're in routine mode — answering phones, handling business, open to conversations. They haven't yet shifted into weekend-anticipation mode where they're mentally checked out."),
      block("If you can only call three days per week, make it Tuesday, Wednesday, and Thursday. Schedule your heaviest dial sessions on these days."),

      h3("Monday: The Slow Start"),
      block("Monday is the worst day for morning calls. People are catching up on emails, returning to work mode, and dealing with the week's first wave of tasks. Contact rates on Monday morning are typically 20-30% lower than Tuesday morning."),
      block("However, Monday afternoon (2-4 PM) can be decent. By then, people have cleared their morning backlog and are more available. If you call on Monday, push your dial session to the afternoon."),
      block("There's a useful Monday strategy for aged leads: use Monday morning to plan your week, organize your lead list, update your CRM, and prepare your calling environment. Then start dialing at 1 PM."),

      h3("Friday: The Early Exit"),
      block("Friday works in the morning (10 AM - 12 PM) but falls off a cliff after lunch. People mentally check out for the weekend by early afternoon. Contact rates drop 25-40% after 1 PM on Friday compared to the same time on Wednesday."),
      block("My recommendation: do your Friday calling between 10 AM and noon, then spend the afternoon on admin, follow-up emails, and planning for the next week. Don't waste leads on Friday afternoon dials — save them for Tuesday."),

      h2("Best Times of Day"),
      block("Within each day, there are two golden windows for reaching aged leads by phone. Everything outside these windows has significantly lower contact rates."),

      h3("Window 1: 10:00 AM - 12:00 PM"),
      block("This is the single best calling window across every demographic I've tested. By 10 AM, people who work are settled into their day. Retirees have finished breakfast and morning routines. Stay-at-home parents have dropped kids at school. Unemployed job seekers have finished their morning search session."),
      block("Contact rates in this window are typically 12-18% per dial. Conversation quality is high because people are alert, caffeinated, and haven't been worn down by the day yet."),
      block("If you're only going to call for one hour per day, make it 10-11 AM in the prospect's time zone. This single hour will produce more contacts than any other hour of the day."),

      h3("Window 2: 2:00 PM - 4:00 PM"),
      block("The afternoon window is the second-best calling time. Contact rates are typically 10-15% per dial — slightly lower than the morning window but still strong. The post-lunch slump works in your favor: people are at their desks or at home, less busy, and more willing to take a call than during the morning rush."),
      block("This window is especially effective for reaching working professionals. Many people take a mental break between 2-3 PM and are more receptive to conversations that aren't on their calendar."),

      h3("The Dead Zones"),
      block("Avoid calling between 8-9:30 AM (morning rush — commuting, school drop-off, opening emails), 12-1:30 PM (lunch — people don't want sales calls during their break), and after 5 PM unless you have explicit permission. Evening calls can work for certain demographics, but they're increasingly unpopular and can generate complaints."),
      block("Early morning calls (before 8 AM) are a hard no. Even if the lead is technically awake, calling that early feels intrusive and sets a negative tone for the conversation. I've seen agents torpedoed by 7:30 AM calls — the prospect answers annoyed and the conversation is dead before it starts."),

      h2("Senior-Specific Timing: Final Expense and Medicare"),
      block("If you're working final expense or Medicare aged leads, your audience skews 55-85 years old. This demographic has different daily patterns than working-age adults, and your calling schedule should reflect that."),

      h3("The Senior Sweet Spot: 9:30 AM - 11:30 AM"),
      block("Seniors tend to be early risers. By 9:30 AM, they've had breakfast, read the paper or watched morning news, and are ready to handle phone calls and errands. This window consistently produces the highest contact rates for the 60+ demographic — often 15-22% per dial."),
      block("What's interesting about calling seniors in this window is that many of them actually appreciate the call. They're often more isolated than working-age adults and welcome a conversation, even an unexpected one. If your approach is respectful and genuinely helpful, you'll find that seniors are the most receptive aged lead audience."),

      h3("The Senior Afternoon Window: 1:30 PM - 3:00 PM"),
      block("After lunch, many seniors settle in for the afternoon. This window works well but has a natural cutoff around 3 PM. After 3 PM, many seniors shift to evening preparation — dinner planning, evening medications, TV shows they follow. Contact rates drop noticeably after 3 PM for this demographic."),
      block("Avoid calling seniors during common doctor appointment hours (early morning and late morning). Many seniors have standing medical appointments that take them away from the phone between 8-9:30 AM several days per week."),

      h3("The Medicare Enrollment Window"),
      block("For Medicare leads specifically, timing is seasonal as well as daily. During Annual Enrollment Period (October 15 - December 7), contact rates spike because seniors are actively thinking about their coverage. An aged Medicare lead from early AEP is gold during late AEP — the consumer intended to review their options and may not have done it yet."),
      block("During the off-season (January - September), Medicare aged leads still work but require a softer approach: 'I wanted to make sure you got your Medicare questions answered' rather than 'Let me help you enroll.' Many seniors have coverage questions year-round even if they can't change plans outside AEP."),

      h2("Timezone Considerations"),
      block("If you're buying aged leads from multiple states, you're dealing with up to four US time zones. This can either be a hassle or an advantage, depending on how you plan your schedule."),
      block("Here's how I structure a multi-timezone calling day: Start at 10 AM Eastern by calling your Eastern time zone leads (it's 10 AM for them — perfect). At 11 AM Eastern, shift to Central time zone leads (it's 10 AM for them). At 12 PM Eastern, take a break — it's lunch hour in the East and 11 AM Central, which is fine, but your Eastern leads are at lunch. At 1 PM Eastern, start on Mountain time zone leads (it's 11 AM for them). At 2 PM Eastern, circle back to Eastern leads for the afternoon window. At 3 PM Eastern, hit Pacific time zone leads (it's noon for them — slightly early for the afternoon window, but workable)."),
      block("This approach lets you ride the 10 AM - noon golden window across four time zones by staggering your calls. One agent working 10 AM - 4 PM Eastern can effectively be calling during peak hours all day."),

      h2("Voicemail Timing Strategy"),
      block("When you hit voicemail (which will be 85-90% of the time), the timing of your voicemail affects whether it gets listened to and acted on."),
      block("Leave voicemails during the golden windows (10 AM - noon, 2-4 PM). Voicemails left during these times are more likely to be heard promptly because the prospect is near their phone and checking messages. A voicemail left at 10:30 AM might be heard by 11 AM and generate a callback within hours."),
      block("Avoid leaving voicemails during the dead zones. A voicemail left at 12:15 PM gets buried under afternoon calls and notifications. A voicemail left at 5:30 PM gets lost in the evening. The timing of the voicemail affects its perceived urgency — a morning voicemail feels timely and important; an evening voicemail feels like it can wait until tomorrow."),
      block("One tactic that works well: leave your first voicemail in the morning window, then follow up with a brief text message 2-3 hours later. 'Hi [Name], I left you a voicemail this morning about [topic]. Let me know if you have a few minutes to chat.' This double-touch increases callback rates by 30-40% compared to voicemail alone."),

      h2("Seasonal Considerations"),
      block("Beyond daily and weekly timing, there are seasonal patterns that affect aged lead contact rates."),
      block("January through March is typically the strongest quarter for insurance-related calls. People are making New Year's resolutions, filing taxes (which makes them think about finances), and are generally in a 'get things done' mindset. Contact rates are 10-15% higher than average during this period."),
      block("Summer (June through August) is the most challenging season. People are on vacation, outdoor activities compete for attention, and there's a general seasonal relaxation that makes people less responsive to phone calls. If you're calling during summer, lean heavily into the morning window — afternoon contact rates drop more in summer than any other season."),
      block("November through December is mixed. Early November is strong, but everything falls off during Thanksgiving week and December holidays. The exception is Medicare AEP, which runs through December 7 and keeps that specific audience highly engaged."),

      h2("Your Weekly Calling Schedule Template"),
      block("Here's the exact schedule I recommend for agents working aged insurance leads. This assumes 20-25 hours of calling per week — a full-time aged lead operation."),
      block("Monday: 1:00 PM - 4:00 PM — dial session (skip the morning, use it for planning and CRM updates). Tuesday: 10:00 AM - 12:00 PM — morning dial session. 2:00 PM - 4:00 PM — afternoon dial session. Wednesday: 10:00 AM - 12:00 PM — morning dial session. 2:00 PM - 4:00 PM — afternoon dial session. Thursday: 10:00 AM - 12:00 PM — morning dial session. 2:00 PM - 4:00 PM — afternoon dial session. Friday: 10:00 AM - 12:00 PM — morning dial session only. Afternoon for admin and planning."),
      block("This schedule gives you 21 hours of prime-time calling across 5 days. At 20-25 dials per hour, that's 420-525 dial attempts per week. With a 12-15% contact rate, you're looking at 50-79 conversations per week — more than enough to build a thriving insurance practice."),

      h2("Tracking and Optimizing Your Timing"),
      block("The benchmarks I've shared are averages across large datasets. Your specific audience might have different patterns. The only way to know is to track your results by time slot."),
      block("In your CRM or tracking spreadsheet, log the time of each dial alongside the outcome (no answer, voicemail, contact, conversation). After 200-300 dials, sort by time slot and calculate your contact rate for each hour. You'll start to see your own patterns emerge — maybe your specific audience is more responsive at 9:30 AM than 10:30 AM, or maybe Thursday afternoon is your best window."),
      block("Once you have your own data, adjust your schedule to double down on your best windows. The agents who consistently outperform are the ones who've personalized their schedule based on their data rather than relying on general benchmarks. Start with the schedule above, then make it your own."),
    ],
  },

  // ── POST 4: Aged Lead Scripts ──
  {
    _id: "post-aged-lead-scripts",
    _type: "post",
    title: "Aged Lead Scripts That Actually Work (With Examples)",
    slug: { _type: "slug", current: "aged-lead-scripts-that-work" },
    excerpt: "The complete aged lead script collection: openers, voicemails, emails, objection handlers, and closers tested across millions of leads. Copy-paste ready.",
    publishedAt: "2026-03-21T10:00:00Z",
    contentType: "pillar",
    isFeatured: true,
    author: ref("author-bill-rice"),
    categories: [ref("cat-scripts")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-final-expense")],
    seo: {
      metaTitle: "Aged Lead Scripts That Work (With Examples)",
      metaDescription: "Complete collection of aged lead scripts: openers, voicemails, emails, objection handling, and closers. Tested across millions of leads. Copy-paste ready.",
    },
    body: [
      block("Scripts are the most important tool in your aged lead toolkit — and the most misunderstood. Bad scripts sound robotic and get you hung up on. Great scripts sound natural, create curiosity, and guide conversations toward appointments and sales. After testing scripts across millions of aged lead calls, I've refined a collection that consistently outperforms everything else I've tried."),
      block("What I'm sharing here isn't theory. These are the exact scripts and frameworks my teams have used at scale. Every script includes context on when to use it, why it works, and how to adapt it for your specific product. I've included scripts for opening calls, leaving voicemails, sending emails, handling objections, and closing — the complete playbook."),
      block("One important note before we dive in: a script is a framework, not a teleprompter. Memorize the structure and key phrases, then deliver them in your own voice. The goal is to sound like a knowledgeable professional having a conversation, not a robot reading a screen."),

      h2("Opening Scripts: The First 15 Seconds"),
      block("The opening of an aged lead call is the most critical moment. You have about 15 seconds to establish who you are, why you're calling, and — most importantly — get them to keep listening. Here are three opening variants that work for different situations."),

      h3("Opener 1: The Helpful Check-In"),
      block("'Hi [Name], this is [Your Name] with [Company]. You explored some [insurance/mortgage/solar] options a while back, and I'm just following up to see if you were able to get everything taken care of. Did you end up finding what you were looking for?'"),
      block("Why it works: This opener is non-threatening and positions you as helpful rather than salesy. By asking 'did you end up finding what you were looking for,' you're inviting them to tell you their status. If they say 'No, I never got around to it,' you've just opened a sales conversation. If they say 'Yes, I'm all set,' you can politely end the call. Either way, you've started a dialogue instead of a monologue."),
      block("When to use it: This is your default opener for 60-180 day aged leads. It works across all verticals and is especially effective for insurance and mortgage because it acknowledges the time gap naturally."),

      h3("Opener 2: The Value Lead"),
      block("'Hi [Name], this is [Your Name] with [Company]. I'm reaching out because you looked into [product] a while back, and there have been some changes since then that could save you money. Do you have a quick minute?'"),
      block("Why it works: Leading with potential savings creates immediate interest. People will always give you a minute if they think there's money to be saved. The phrase 'changes since then' works for any time period — rates change, regulations change, incentives change. It's always true."),
      block("When to use it: This opener is best for mortgage leads (rates fluctuate), solar leads (incentive programs change), and auto insurance leads (rates vary by season and carrier). Use it when you have a genuine value proposition — if rates have actually dropped or new programs have launched. Don't fabricate savings claims."),

      h3("Opener 3: The Direct Approach"),
      block("'Hi [Name], this is [Your Name]. I help people in [City/State] with [product]. I noticed you explored some options online a while back, and I wanted to reach out directly to see if I can help. Are you still looking for [product]?'"),
      block("Why it works: Some prospects respond best to straightforward communication. No tricks, no clever angles — just a direct professional reaching out. The mention of their city or state adds a local, personal touch that differentiates you from national call centers."),
      block("When to use it: This works well for leads aged 30-60 days where the time gap is short enough that the prospect likely remembers their inquiry. It's also effective for agents who struggle to sound natural with more complex scripts — the simplicity makes it easy to deliver authentically."),

      h2("Voicemail Scripts: The 15-20 Second Rule"),
      block("You're going to hit voicemail on 85-90% of your calls. Your voicemail is working for you 24/7 — if it's good, it generates callbacks. If it's bad, your number gets blocked. Keep every voicemail between 15 and 20 seconds. Anything longer gets deleted before it's finished."),

      h3("Voicemail 1: The Curiosity Builder"),
      block("'Hi [Name], this is [Your Name] — I'm calling about the [insurance/mortgage] information you requested a while back. I have something that might be worth your time. Give me a call back at [Number]. Again, it's [Your Name] at [Number].'"),
      block("Why it works: 'I have something that might be worth your time' creates curiosity without being specific enough to dismiss. The prospect has to call back to find out what it is. Repeating your name and number ensures they can write it down. Total time: 15 seconds."),
      block("Callback rate: 3-5%. On 100 voicemails, that's 3-5 inbound calls from curious prospects who are warmed up and willing to talk. These callbacks close at 2-3x the rate of outbound-initiated conversations."),

      h3("Voicemail 2: The Helpful Follow-Up"),
      block("'Hi [Name], this is [Your Name]. You looked into [insurance/mortgage] options a while back, and I just wanted to check if you got everything handled. If you still need help, my number is [Number]. Again, [Your Name] at [Number]. Have a great day.'"),
      block("Why it works: This voicemail positions you as helpful and low-pressure. The phrase 'just wanted to check' feels caring rather than salesy. Ending with 'have a great day' leaves a positive impression. Some prospects call back specifically because the voicemail felt genuine and non-pushy."),
      block("Use this voicemail on your second or third attempt — after the curiosity builder hasn't generated a callback. Alternating voicemail styles increases your overall callback rate because different prospects respond to different tones."),

      h2("Email Templates: The Follow-Up Multiplier"),
      block("Email alone won't close aged leads, but email combined with phone outreach can increase your total contact rate by 20-30%. Send emails after leaving voicemails — the combination of 'I called and emailed' signals persistence and professionalism."),

      h3("Email Template 1: The Initial Outreach"),
      block("Subject: Quick question about your [insurance/mortgage] search. Body: 'Hi [Name], I tried calling you earlier today — I wanted to follow up on the [insurance/mortgage] information you requested. Are you still looking for options? If so, I'd love to spend a few minutes helping you find the best fit. You can reply here or call me at [Number]. [Your Name], [Title], [Company]'"),
      block("Why it works: The subject line creates curiosity with 'quick question' — one of the highest-open-rate subject lines in sales email. Referencing the phone call shows you've already made an effort. The email is short enough to be read in 10 seconds, which is about all you get."),

      h3("Email Template 2: The Value Email"),
      block("Subject: [Name], rates have changed since you last looked. Body: 'Hi [Name], I noticed you explored [insurance/mortgage] options recently. Since then, [specific change — rates have dropped / new programs are available / the market has shifted]. I ran a quick comparison and there are a few options that might save you money. Want me to send over the details? [Your Name], [Number]'"),
      block("Why it works: This email gives a specific reason to re-engage. 'I ran a quick comparison' implies you've already done work on their behalf, which creates reciprocity. The call to action — 'Want me to send over the details?' — is low-commitment and easy to say yes to."),

      h3("Email Template 3: The Last Touch"),
      block("Subject: Closing your file, [Name]. Body: 'Hi [Name], I've tried reaching you a few times about the [insurance/mortgage] options you were looking into. I don't want to be a bother, so this will be my last message. If your situation has changed and you'd like help, my door is always open — just reply here or call [Number]. Wishing you the best, [Your Name]'"),
      block("Why it works: 'Closing your file' is one of the highest-response subject lines in sales because it implies a loss — the prospect is about to lose access to something. The email itself is polite and respectful, which often prompts a reply from people who felt bad about ignoring your earlier outreach. I've seen this template generate a 5-8% reply rate on leads that had zero prior response."),

      h2("Objection Handling Scripts: The Big Five"),
      block("In my experience, 95% of objections on aged lead calls fall into five categories. If you have a practiced response for each of these, you'll navigate the vast majority of difficult conversations with confidence."),

      h3("Objection 1: 'I'm not interested.'"),
      block("Response: 'I completely understand — and I'm not here to hard-sell you on anything. A lot of people I talk to felt the same way until they saw how much they could actually save. Would it be okay if I took 60 seconds to show you what I mean? If it's not a fit, I'll respect that.'"),
      block("Why it works: Acknowledging their position ('I completely understand') disarms the reflex. Mentioning that others felt the same way normalizes their reaction. Asking for 60 seconds is a small, specific commitment that most people will grant. The key is delivering this with genuine warmth, not as a scripted comeback."),

      h3("Objection 2: 'I already have coverage / already found a lender.'"),
      block("Response: 'That's great — glad you got that taken care of. Out of curiosity, are you happy with what you're paying? A lot of folks I work with found they were overpaying once we did a side-by-side comparison. Would it be worth a quick look?'"),
      block("Why it works: Congratulating them removes the adversarial dynamic. 'Are you happy with what you're paying?' introduces doubt without being aggressive. Nobody is ever 100% sure they're getting the best deal, and this question taps into that universal uncertainty. The transition to 'quick look' is low-pressure."),

      h3("Objection 3: 'I never filled out any form.'"),
      block("Response: 'You know what, that happens sometimes — these forms pop up on different websites and it's easy to not remember clicking through. Either way, I'm just here to help if you have any questions about [product]. Is [product] something you've been thinking about at all?'"),
      block("Why it works: This objection is extremely common with aged leads — people genuinely forget they filled out a form 90 days ago. Dismissing the form entirely and pivoting to 'Is this something you've been thinking about?' moves past the memory issue and gets to the real question: does this person have a need?"),

      h3("Objection 4: 'Can you call me back later?'"),
      block("Response: 'Absolutely — when's a good time? I want to make sure I catch you when it's convenient. Would [suggest specific day/time] work for you?'"),
      block("Why it works: Always, always pin down a specific callback time. 'Call me back later' without a specific time is a polite dismissal — they hope you won't call again. But if you say 'Would Thursday at 2 PM work?' and they agree, you've created an appointment. Now when you call Thursday at 2, they expect you — and contact rates on scheduled callbacks are 60-80%."),

      h3("Objection 5: 'How did you get my number?'"),
      block("Response: 'You filled out an online form a while back requesting information about [product]. Your information came to us through that form. I know it's been a while — I just wanted to make sure you got the help you were looking for. Is [product] still on your radar?'"),
      block("Why it works: Transparency builds trust. Don't dodge this question. Explain clearly how you got their information, acknowledge the time gap, and redirect to their needs. Most people relax once they understand the origin. If they're unhappy, offer to remove their number — respecting their wishes protects your reputation and keeps you DNC-compliant."),

      h2("Industry-Specific Script Adaptations"),
      block("The frameworks above work across verticals, but small tweaks make them more effective for specific products. Here are the adjustments I recommend."),

      h3("Insurance Scripts"),
      block("For insurance aged leads, emphasize protection and peace of mind over price. Yes, people want to save money, but insurance is fundamentally about security. Replace 'save you money' with 'make sure you're properly covered' in your openers when appropriate."),
      block("Example adaptation: 'Hi [Name], this is [Your Name]. You looked into life insurance options a while back, and I wanted to make sure you and your family ended up getting the coverage you need. Did you get that taken care of?' Notice the shift from transactional ('save money') to emotional ('your family' and 'coverage you need'). Insurance is personal — your script should reflect that."),

      h3("Mortgage Scripts"),
      block("For mortgage aged leads, lead with rates and savings. Mortgage prospects are almost always rate-shopping, and they'll engage if they think rates have moved in their favor. Always know the current rate environment before you call so you can speak to it specifically."),
      block("Example adaptation: 'Hi [Name], this is [Your Name] with [Company]. You looked into mortgage rates a while back, and rates have moved since then — 30-year fixed is currently around [X.X%]. I wanted to see if a quick rate comparison might make sense for your situation. Do you have two minutes?' Leading with the specific current rate demonstrates expertise and gives them a number to react to."),

      h3("Final Expense Scripts"),
      block("For final expense aged leads, slow down your delivery, speak warmly, and emphasize simplicity. Your audience is typically 50-85 years old and may be intimidated by insurance jargon. Use plain language: 'burial insurance' or 'final expense coverage' instead of 'whole life policy with a graded benefit structure.'"),
      block("Example adaptation: 'Hi [Name], this is [Your Name]. I help families in [City] with affordable burial insurance plans. You looked into this a while back, and I just wanted to check in — did you ever find a plan that works for you?' The word 'families' resonates with the final expense audience because the product is ultimately about protecting loved ones from financial burden. 'Affordable' and 'check in' keep the tone friendly and accessible."),

      h2("Closing Scripts: Moving from Conversation to Commitment"),
      block("Getting to a live conversation is half the battle. Converting that conversation into an appointment or sale requires a clear closing script. Here's how to transition from dialogue to action."),

      h3("The Soft Close: Setting an Appointment"),
      block("'Based on what you've told me, I think there are a couple of options that could work really well for you. What I'd like to do is put together a quick comparison and walk you through it — it'll take about 15 minutes. Would [day] at [time] work for a quick call to go over everything?'"),
      block("Why it works: 'Put together a quick comparison' implies customized effort — you're going to do work on their behalf. Specifying '15 minutes' makes the commitment feel small. Suggesting a specific day and time forces a yes-or-no decision rather than a vague 'maybe later.' This close works for insurance, mortgage, and solar because everyone appreciates a personalized comparison."),

      h3("The Direct Close: For Ready Buyers"),
      block("'It sounds like this is exactly what you've been looking for. I can get you set up right now — it'll take about 10 minutes over the phone. Want to go ahead and get this taken care of today?'"),
      block("Why it works: When a prospect signals strong buying intent — asking about price, coverage details, or next steps — don't keep selling. Pivot to the close. 'Get this taken care of today' appeals to the desire for completion. Many aged lead prospects have been procrastinating for months; giving them permission to finally act can tip them over the edge."),

      h2("Follow-Up Scripts: The Fortune Is in the Follow-Up"),
      block("Most aged lead sales don't happen on the first conversation. They happen on the second or third contact — after the prospect has had time to think, check their current coverage, or discuss with a spouse. Your follow-up scripts should reference the prior conversation and move toward a decision."),

      h3("Follow-Up Call Script"),
      block("'Hi [Name], this is [Your Name] again — we spoke [day of week] about [product]. You mentioned you wanted to [think about it / check with your spouse / review your current policy]. I wanted to check back in and see where you landed. Did you have a chance to look into it?'"),
      block("Why it works: Referencing the specific prior conversation shows you're organized and attentive. Reminding them of what they said they'd do ('you mentioned you wanted to...') creates gentle accountability. This script works as a second, third, or fourth follow-up — just update the reference to the last conversation."),

      h3("Follow-Up Email After No Response"),
      block("Subject: Following up, [Name]. Body: 'Hi [Name], I wanted to circle back on our conversation about [product]. I know life gets busy, so no pressure at all. If you'd like to revisit the options we discussed, I'm here whenever you're ready. You can reply here, call me at [Number], or even just text me. Whatever's easiest. Best, [Your Name]'"),
      block("Why it works: This email is intentionally low-pressure because high-pressure follow-ups on aged leads backfire. 'No pressure at all' and 'whenever you're ready' respect their timeline. Offering multiple response channels (email, phone, text) increases the likelihood they'll respond through their preferred method."),

      h2("Door-Knocking Scripts: The In-Person Advantage"),
      block("I know door knocking sounds old school, but for aged leads with a physical address — especially in insurance and final expense — it can be remarkably effective. Many agents report that their highest close rates come from face-to-face conversations initiated by a door knock."),

      h3("The Door Knock Opener"),
      block("'Hi, are you [Name]? My name is [Your Name] — I'm a local [insurance agent / mortgage advisor] here in [City]. You requested some information about [product] a while back, and I happened to be in the neighborhood, so I wanted to stop by personally and see if I could help. Do you have a couple minutes?'"),
      block("Why it works: 'I happened to be in the neighborhood' is the critical phrase — it makes the visit feel incidental rather than targeted. Saying you're 'local' differentiates you from the phone agents and national carriers. The in-person element builds trust faster than any phone call. Make sure your appearance is professional and you have a business card in hand."),
      block("Timing matters for door knocking: Tuesday through Thursday, 10 AM - 3 PM, is optimal. Avoid early morning, dinner time, and weekends for unsolicited visits. For final expense leads targeting seniors, late morning (10-11:30 AM) is the sweet spot."),

      h2("Putting It All Together: The Complete Cadence"),
      block("Individual scripts are tools. The system is how you sequence them across multiple touches. Here's the complete 7-touch cadence I recommend for aged leads, with scripts mapped to each touchpoint:"),
      block("Day 1: Call (Opener 1 or 2) + Voicemail (Curiosity Builder) + Email (Initial Outreach). Day 3: Call (try a different opener variant) + Voicemail (Helpful Follow-Up if no callback from Day 1). Day 5: Email only (Value Email). Day 7: Call + Voicemail + Text message ('Hi [Name], I left you a voicemail about [product]. Let me know if you have questions — [Your Name]'). Day 10: Call (Direct Approach opener). Day 14: Email (Last Touch / Closing Your File). Day 21: Final call attempt + Final voicemail."),
      block("This cadence spaces out your contacts enough to avoid being annoying while maintaining enough frequency to catch the prospect when they're available. Agents who follow this complete cadence report 40-50% total contact rates — compared to 10-12% for agents who call once and move on."),
      block("These are the scripts I've tested across millions of leads. They work. But they work best when you practice them until they feel natural, personalize them with your own personality, and commit to the full cadence. The agents who succeed with aged leads aren't the ones with the best script — they're the ones who use a good script consistently and persistently."),
    ],
  },

  // ── POST 5: Voicemail for Aged Leads ──
  {
    _id: "post-voicemail-aged-leads",
    _type: "post",
    title: "How to Leave a Voicemail That Gets Callbacks from Aged Leads",
    slug: { _type: "slug", current: "how-to-leave-voicemail-aged-leads" },
    excerpt: "Why most voicemails fail and how to fix yours. Four complete voicemail scripts, tone guidance, callback benchmarks, and the 15-second rule for aged leads.",
    publishedAt: "2026-03-22T10:00:00Z",
    contentType: "cluster",
    isFeatured: false,
    author: ref("author-bill-rice"),
    categories: [ref("cat-scripts")],
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage")],
    seo: {
      metaTitle: "Voicemail Scripts for Aged Leads That Get Callbacks",
      metaDescription: "Why most voicemails fail and how to fix yours. Four voicemail scripts, tone guidance, callback benchmarks, and the 15-second rule for aged leads.",
    },
    body: [
      block("Here's a stat that should change how you think about voicemail: on a typical aged lead calling session, you'll reach voicemail on 85-90% of your dials. If you're dialing 50 leads per day, that's 42-45 voicemails. If each voicemail generates a 3-5% callback rate, that's 1-2 inbound calls per day from warm, curious prospects who are far easier to close than cold contacts."),
      block("But here's the catch — the 3-5% callback rate is for good voicemails. Bad voicemails get a callback rate of zero. Literally zero. The prospect listens for 3 seconds, hears a generic sales pitch, and deletes it. Your number might even get blocked. The difference between a voicemail that generates callbacks and one that gets deleted comes down to a handful of specific techniques that I've tested across millions of aged lead calls."),

      h2("Why Most Voicemails Fail"),
      block("I've listened to thousands of agent voicemails over the years, and the failures fall into the same three categories every time."),

      h3("Problem 1: Too Long"),
      block("The average failed voicemail is 30-45 seconds long. The agent introduces themselves, explains their company, describes the product, lists the benefits, and then finally gets around to leaving a phone number. By that point, the prospect has stopped listening."),
      block("Research on voicemail listening behavior shows that most people decide within the first 5 seconds whether to keep listening or delete. By 15 seconds, the decision is locked in. After 20 seconds, even interested listeners start tuning out. Your entire voicemail — from greeting to phone number — should be 15-20 seconds. That's it."),

      h3("Problem 2: Too Salesy"),
      block("'Hi, I'm calling from ABC Insurance and we have amazing rates on life insurance that could save you hundreds of dollars per year. We offer term life, whole life, universal life, and our customer satisfaction rating is...' Delete. Nobody calls back a sales pitch. Nobody has ever listened to a voicemail commercial and thought 'Let me call this person back immediately.'"),
      block("The best voicemails don't sound like sales messages at all. They sound like a real person checking in with genuine helpfulness. The shift from 'let me sell you something' to 'let me make sure you're taken care of' is the single biggest improvement most agents can make to their voicemail game."),

      h3("Problem 3: Too Fast"),
      block("Nerves make agents rush. They speak quickly, mumble their phone number, and hang up before the prospect can process what they heard. Even if the content is good, a rushed voicemail signals 'I'm calling from a boiler room and racing to hit my dial quota.' That's not the image that generates callbacks."),
      block("Slow down. Seriously — slower than feels natural. A voicemail is a performance, and the best performances have deliberate pacing. Speak at about 70% of your normal conversation speed. Pause for a beat before and after saying your phone number. The goal is to sound calm, confident, and unhurried — like someone worth calling back."),

      h2("The 15-20 Second Rule"),
      block("Every voicemail you leave on an aged lead should follow this structure and fit within 15-20 seconds:"),
      block("Seconds 1-3: Your name and a hook. 'Hi [Name], this is [Your Name]...' Seconds 4-10: The reason for your call — one sentence, maximum. 'I'm calling about the [product] information you requested...' Seconds 10-15: The callback prompt. 'Give me a call back at [Number]...' Seconds 15-18: Repeat your name and number. 'Again, it's [Your Name] at [Number].'"),
      block("That's the whole formula. Notice what's missing: your company name (they don't care), your credentials (they don't care yet), product details (not now), and a pitch (never in a voicemail). All of those things have a place in the conversation that happens after they call you back. The voicemail's only job is to generate the callback."),

      h2("Four Voicemail Scripts for Different Situations"),
      block("Here are four complete voicemail scripts that I've tested extensively. Each one is designed for a specific situation and emotional tone."),

      h3("Script 1: The Curiosity Hook"),
      block("'Hi [Name], this is [Your Name]. I'm calling about the [insurance/mortgage] information you requested a while back. I have something that might be worth your time. Call me back at [Number]. Again, [Your Name] at [Number].'"),
      block("When to use it: This is your first-voicemail script. Use it on your very first attempt with each lead. The phrase 'something that might be worth your time' is deliberately vague — it creates a knowledge gap that the prospect can only fill by calling back. This consistently generates the highest callback rates among all voicemail types because curiosity is a more powerful motivator than a specific offer."),
      block("Duration: 14 seconds. Tone: confident, slightly mysterious, friendly."),

      h3("Script 2: The Helpful Check-In"),
      block("'Hi [Name], it's [Your Name]. You looked into [insurance/mortgage] options a while back, and I just wanted to make sure you got everything taken care of. If you still need help, give me a call at [Number]. That's [Number]. Hope you're having a great day.'"),
      block("When to use it: Second or third attempt, after the curiosity hook hasn't generated a callback. This voicemail shifts the tone from intriguing to caring. Some prospects who didn't respond to curiosity will respond to genuine helpfulness. The closing 'hope you're having a great day' is a small touch that humanizes you and makes the voicemail feel personal."),
      block("Duration: 16 seconds. Tone: warm, genuine, unhurried."),

      h3("Script 3: The Social Proof"),
      block("'Hi [Name], this is [Your Name]. I work with a lot of folks in [City/Area] on their [insurance/mortgage] needs. You came across my desk and I wanted to reach out personally. Give me a call at [Number] when you get a chance. Looking forward to hearing from you.'"),
      block("When to use it: This works well for leads where you share a geographic area with the prospect. 'I work with a lot of folks in [City]' establishes social proof — you're not a random caller, you're a local professional with an established presence. 'Came across my desk' is intentionally casual — it feels less like you bought a lead list and more like an organic referral."),
      block("Duration: 15 seconds. Tone: professional, local, approachable."),

      h3("Script 4: The Final Attempt"),
      block("'Hi [Name], this is [Your Name]. I've tried you a few times — just wanted to try one more time about the [insurance/mortgage] options you were looking into. If you're still interested, call me at [Number]. If not, no worries at all. Take care.'"),
      block("When to use it: Your last voicemail attempt — typically the 5th or 6th dial. This voicemail uses a scarcity principle: 'one more time' implies the opportunity is closing. 'If not, no worries at all' is critically important — it gives the prospect permission to not call back, which paradoxically increases the chance they do. People are more likely to respond when they feel free to say no."),
      block("Duration: 16 seconds. Tone: relaxed, no-pressure, respectful."),

      h2("Tone and Pacing: How You Sound Matters More Than What You Say"),
      block("I can give you the perfect script, and if you deliver it in a flat, rushed, or overly enthusiastic tone, it won't work. Here's how to sound like someone worth calling back."),

      h3("Speak at 130-150 Words Per Minute"),
      block("Normal conversation pace is 150-180 words per minute. Voicemails should be slower — about 130-150 WPM. This slower pace signals confidence and importance. Think about how a doctor or a trusted advisor speaks — measured, deliberate, unhurried. That's the energy you want in a voicemail."),
      block("Practice by recording yourself. Listen back. If you sound rushed or breathless, slow down. If you sound bored or robotic, add a slight smile to your voice — literally smile while you talk. It sounds absurd, but the smile comes through in your vocal tone and makes you sound warmer and more approachable."),

      h3("Vary Your Pitch"),
      block("A monotone voicemail is a death sentence. Your voice should naturally rise and fall as you speak. Slightly raise your pitch on the hook ('I have something that might be worth your time') and lower it on the phone number (which signals authority and importance). Don't overdo it — you're not a radio DJ. Natural vocal variation is enough."),

      h3("Pause Before the Phone Number"),
      block("This is the most overlooked voicemail technique. Before you say your phone number, pause for a full second. The pause signals that important information is coming, which causes the listener to focus. Then say your number at an even slower pace than the rest of the message — digit by digit, with small pauses between groups. 'Give me a call at... five-five-five... one-two-three... four-five-six-seven.' Say it once, then repeat it."),

      h2("When NOT to Leave a Voicemail"),
      block("Counterintuitively, there are times when leaving a voicemail is the wrong move."),
      block("Don't leave a voicemail if the prospect has already told you they're not interested. Once someone explicitly declines, a voicemail becomes annoying and can generate complaints. Mark them as not interested and move on."),
      block("Don't leave a voicemail on every single attempt. If you're calling the same lead 7 times, leave voicemails on attempts 1, 3, 5, and 7. Call without leaving a voicemail on 2, 4, and 6. This prevents voicemail fatigue — if a prospect gets 7 voicemails in 3 weeks, they'll block your number. Four voicemails spaced across 3 weeks feels persistent but reasonable."),
      block("Don't leave a voicemail after 5 PM unless you know the prospect is in a time zone where it's still afternoon. Evening voicemails feel intrusive and slightly desperate. They get deleted without being fully heard."),

      h2("Callback Rate Benchmarks: What Good Looks Like"),
      block("Let's set realistic expectations so you can measure whether your voicemails are working."),
      block("A good callback rate on aged lead voicemails is 3-5%. That means for every 100 voicemails you leave, 3-5 people call you back. If you're below 2%, your script or delivery needs work. If you're above 5%, you're exceptional — keep doing what you're doing."),
      block("Here's what those numbers look like in practice: If you dial 50 leads per day and reach voicemail on 43 of them, a 4% callback rate gives you 1.7 callbacks per day. Over a 5-day calling week, that's 8-9 inbound calls from warm prospects. These callbacks are gold — the prospect has made an active choice to engage, which means they have some level of interest. Callback conversations convert to sales at 2-3x the rate of outbound-initiated conversations."),
      block("Track your callback rate weekly. Record it alongside which voicemail script you used, the time of day you called, and the day of the week. After a month, you'll have enough data to see which script generates the most callbacks and when your callbacks tend to come in. Most callbacks happen within 2-4 hours of the voicemail being left, with a smaller spike the next morning."),

      h2("Voicemail Drop Technology: The Efficiency Play"),
      block("Voicemail drop technology lets you pre-record a voicemail and 'drop' it into a prospect's voicemail box with a single click, bypassing the ringing altogether. This saves 20-30 seconds per voicemail and lets you leave a perfectly delivered message every time."),
      block("The pros are clear: consistency (every voicemail sounds polished), speed (you can move through your call list faster), and volume (more dials per hour). Tools like Slybroadcast, Drop Cowboy, and most power dialers include voicemail drop functionality."),
      block("The cons are worth considering. Voicemail drops can sound slightly different from a live voicemail — some systems create a faint click or the audio quality is subtly different. Savvy consumers may recognize the format. Additionally, some states have regulations around pre-recorded messages that may apply to voicemail drops. Check compliance requirements for your state and the states you're calling into."),
      block("My recommendation: use voicemail drop for volume efficiency, but make sure your recording sounds natural and warm. Re-record your drop messages every 2-3 weeks so they stay fresh. And always have a live voicemail option ready for your highest-value leads — a personally delivered voicemail for a premium lead can be worth the extra 20 seconds."),

      h2("The Follow-Up Sequence After a Voicemail"),
      block("A voicemail in isolation does very little. A voicemail as part of a coordinated follow-up sequence does a lot. Here's what to do after you leave a voicemail:"),
      block("Immediately after the voicemail (within 5 minutes): Send a text message. 'Hi [Name], this is [Your Name] — I just left you a voicemail about the [insurance/mortgage] options you were looking into. Feel free to text or call me back at this number.' The text serves two purposes: it reinforces the voicemail, and it opens a text channel for prospects who prefer texting over calling."),
      block("Within 2 hours of the voicemail: Send an email referencing both the call and the voicemail. 'Hi [Name], I tried calling and left you a quick voicemail about [product]. If it's easier, you can reply here.' The multi-channel approach increases your visibility — the prospect sees your name in their voicemail, their text messages, and their email inbox. One of those channels will match their preferred communication method."),
      block("24 hours later: If no callback, make another dial attempt without leaving a voicemail. You want to stay visible without becoming a nuisance. Call, let it ring, and if they don't answer, simply wait. Your voicemail from yesterday is still sitting in their inbox. Adding another one 24 hours later feels aggressive."),
      block("48-72 hours later: Leave a second voicemail using a different script than your first. If you used the Curiosity Hook first, use the Helpful Check-In this time. The tonal variety prevents your voicemails from blending together in the prospect's mind."),

      h2("Making Voicemail a System, Not an Afterthought"),
      block("Most agents treat voicemail as the consolation prize — they wanted a live conversation and got a voicemail instead. Flip that mindset. Voicemail is a marketing channel that reaches 85-90% of your leads and works for you while you're making your next call. Every voicemail is a mini commercial for your services that plays directly in your prospect's ear."),
      block("Write your voicemail scripts. Practice them until they're second nature. Record yourself and listen back. Time them — if they're over 20 seconds, cut words. If they're under 12 seconds, you're probably rushing. Aim for that 15-18 second sweet spot every time."),
      block("The agents who master voicemail have a massive competitive advantage over agents who treat it as an afterthought. In a channel where 85% of your touches are voicemails, getting 1% better at voicemails produces far more revenue than getting 1% better at live conversation. Do the math, then invest accordingly."),
    ],
  },
];

async function seed() {
  for (const post of posts) {
    const doc = { ...post, _type: "post" };
    const result = await client.createOrReplace(doc);
    console.log(`✔  ${result._id}  →  ${post.slug.current}`);
  }
  console.log(`\nDone — ${posts.length} posts published.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
