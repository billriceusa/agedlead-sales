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
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Already expanded in batch 1 (expand-glossary-mar18.mjs) — skip these:
const alreadyExpanded = new Set([
  "close-rate", "cold-calling", "contact-rate", "conversion-rate", "cost-per-lead",
  "crm", "data-hygiene", "dialer", "dnc-list", "door-knocking", "drip-campaign",
  "exclusive-lead", "follow-up-cadence", "lead-age", "lead-recycling", "lead-validation",
  "multi-channel-outreach", "objection-handling", "pipeline", "pre-qualification",
  "real-time-lead", "shared-lead", "speed-to-lead", "tcpa", "warm-lead",
]);

// Batch 2: remaining 52 glossary terms
const expansions = [
  {
    slug: "advance-commission",
    body: [
      h2("Understanding Advance Commission"),
      block("Advance commission is a financing arrangement where a third-party company pays an insurance agent a percentage of their expected future commission upfront, immediately after a policy is issued. Instead of waiting 30-90 days for the carrier to pay, agents receive 60-80% of the commission within days. The advance company then collects the full commission directly from the carrier when it pays out, keeping the difference as their fee."),
      block("This is not a loan in the traditional sense — it is a purchase of future receivables. The advance company assumes the risk that the policy might lapse or chargeback. That risk is why they keep 20-40% of the commission as their margin. For agents living deal to deal, advance commissions provide the cash flow needed to keep buying leads and running their business."),
      h2("How It Works in Practice"),
      block("Here is a typical scenario. You sell a final expense policy with a $1,200 first-year commission. Without an advance, you wait 45-60 days for the carrier to process and pay. With an advance company, you submit the policy details and receive $840 (70% advance rate) within 48 hours. The advance company collects the full $1,200 from the carrier and keeps $360 as their fee. Some companies advance at higher rates — 80-85% — for agents with strong persistency records and low chargeback histories."),
      h2("Why It Matters for Aged Leads"),
      block("Advance commissions are particularly relevant for aged lead agents because the aged lead model requires consistent cash flow to maintain lead volume. If you are buying 200-500 aged leads per week at $1-3 each, you need $200-1,500 flowing out weekly. Waiting 60 days for commissions creates a dangerous cash flow gap, especially in your first 90 days. Advances bridge that gap and let you reinvest in leads immediately. The trade-off is real — you are giving up 20-40% of your commission — so the goal should be to build enough cash reserves to eventually eliminate the need for advances. Most successful agents use advances for 6-12 months and then transition to direct carrier payments once their pipeline produces consistent weekly closings."),
    ],
  },
  {
    slug: "affiliate-marketing",
    body: [
      h2("Understanding Affiliate Marketing"),
      block("Affiliate marketing is a performance-based arrangement where one party earns a commission for referring customers or generating leads for another business. In the lead industry, this means someone drives traffic through content, ads, or email to a landing page where prospects fill out a form, and the affiliate earns a fee for each qualified submission. The lead is then sold to agents, brokers, or companies who work the prospect directly."),
      block("Most aged leads originated through some form of affiliate marketing. A network of publishers — running websites about life insurance comparisons, Medicare enrollment guides, or mortgage calculators — collect consumer information and sell it to lead aggregators. Those aggregators distribute leads in real-time and then re-sell them as aged leads once they pass the freshness window."),
      h2("How It Works in Practice"),
      block("A typical affiliate runs a website like 'BestLifeInsuranceQuotes2026.com' that ranks for search terms like 'affordable life insurance for seniors.' Visitors land on the site, read comparison content, and fill out a quote request form. The affiliate earns $8-25 per lead depending on the vertical and lead quality. High-volume affiliates generate thousands of leads per month across multiple verticals. The quality varies dramatically — some affiliates produce highly intentional leads from organic search, while others use aggressive advertising tactics that generate low-intent submissions."),
      h2("Why It Matters for Aged Leads"),
      block("Understanding the affiliate origin of your aged leads helps you set realistic expectations and tailor your outreach. Leads from content-driven affiliates tend to be higher quality — the prospect was researching, reading, and comparing before submitting their information. Leads from incentivized or co-registration sources (where the prospect checked a box while doing something else) are lower quality but cheaper. When you buy aged leads, ask your vendor about lead sourcing. Vendors who can tell you leads came from organic search forms outperform vendors who cannot explain their sourcing. The origin story shapes how you open the conversation — referencing their research gives you a stronger bridge than a generic follow-up call."),
    ],
  },
  {
    slug: "aged-lead",
    body: [
      h2("Understanding Aged Leads"),
      block("An aged lead is a sales prospect who originally expressed interest in a product or service but was not converted within the initial sales window — typically 0-30 days. Once a lead passes that freshness threshold, it enters the aged lead market where it is resold at a significant discount, often 80-95% below the original real-time price. A lead that cost $30 in real-time might sell for $1-3 as an aged lead depending on its age, vertical, and data quality."),
      block("The fundamental insight behind the aged lead model is that consumer intent does not expire on a fixed timeline. Someone who needed life insurance 60 days ago still needs life insurance. Someone who inquired about solar panels three months ago still has a high electric bill. The need persists even when the original vendor gave up. Aged leads represent the gap between how quickly most salespeople abandon prospects and how long those prospects actually remain in the market."),
      h2("How It Works in Practice"),
      block("Aged leads typically come in age bands: 30-60 days, 60-90 days, 90-180 days, and 180+ days. Fresher aged leads cost more and generally convert at higher rates. The sweet spot for most agents is the 30-90 day range, where leads are discounted enough to provide strong ROI but fresh enough that prospects still remember their inquiry. At scale, agents buying 200-500 aged leads per week at $1-2 each can generate 10-25 conversations and 2-5 sales per week — all for $200-1,000 in lead spend."),
      h2("Why It Matters for Aged Leads"),
      block("The aged lead model democratizes sales. Real-time leads price out new agents, small agencies, and budget-conscious operators. A new insurance agent cannot afford $25-35 per lead when they are still learning to close. But at $1-2 per lead, that same agent can practice on 500 prospects for the same cost as 15-20 real-time leads. The volume advantage is massive — more conversations, faster skill development, and a realistic path to profitability within 30-60 days rather than 6-12 months. For experienced agents, aged leads are a profit maximizer. They already have the skills, so they pour volume through their proven process and scale revenue without proportionally scaling cost."),
    ],
  },
  {
    slug: "annual-enrollment-period-aep",
    body: [
      h2("Understanding AEP"),
      block("The Annual Enrollment Period (AEP) runs from October 15 through December 7 each year. During this window, Medicare beneficiaries can make changes to their Medicare Advantage and Medicare Part D prescription drug plans. They can switch from one Medicare Advantage plan to another, drop Medicare Advantage and return to Original Medicare, join a Medicare Advantage plan for the first time, or change their Part D prescription drug plan. Changes made during AEP take effect on January 1 of the following year."),
      h2("How It Works in Practice"),
      block("AEP is the Super Bowl of Medicare sales. Agents spend 8 intense weeks helping beneficiaries review their current coverage, compare plan options, and make enrollment changes. The volume is enormous — over 65 million Americans are on Medicare, and roughly 30% make changes during AEP each year. Carriers ramp up marketing spend, lead generation explodes, and real-time Medicare leads can cost $25-50 each during peak AEP weeks. The competition is fierce, with national carriers, local agents, and call centers all fighting for the same prospects."),
      block("Smart agents begin AEP preparation in August. They review plan changes, update their certifications (AHIP training is required annually), and start pre-positioning with their book of business. During AEP itself, top agents complete 5-15 enrollments per week, focusing on efficiency and rapid turnaround."),
      h2("Why It Matters for Aged Leads"),
      block("Here is where aged leads become a strategic weapon during AEP. While everyone is paying $30-50 for real-time Medicare leads, you can purchase aged Medicare leads from the previous AEP or from the off-season at $1-3 each. These prospects were actively shopping for Medicare coverage — their need did not disappear. Many were overwhelmed by the volume of calls during their initial inquiry and never made a decision. Reaching them again during the current AEP, when they can actually make changes, catches them at the perfect moment. Agents who combine a core book of business with 500-1,000 aged Medicare leads during AEP consistently outperform agents relying solely on expensive real-time leads."),
    ],
  },
  {
    slug: "appointment-set-rate",
    body: [
      h2("Understanding Appointment Set Rate"),
      block("Appointment set rate measures the percentage of contacts that result in a scheduled meeting, presentation, or callback. If you speak with 40 prospects and schedule 8 appointments, your set rate is 20%. This metric sits between contact rate and close rate in your sales funnel — it tells you how effective you are at moving a conversation from initial contact to a committed next step."),
      block("Not every sale requires a formal appointment. Phone-only closers in auto insurance or term life may skip straight from contact to application. But for complex sales — final expense kitchen table presentations, solar site assessments, mortgage consultations, or Medicare plan reviews — the appointment is an essential intermediate step that dramatically increases close probability."),
      h2("How It Works in Practice"),
      block("Strong appointment set rates by vertical: final expense kitchen table 25-40% of contacts, Medicare in-home or phone review 20-35%, solar site assessment 15-25%, mortgage consultation 10-20%. These numbers assume you are calling aged leads with a proper script that leads to a specific ask. The key mistake agents make is having a great conversation but failing to ask for a specific time: 'Would Wednesday at 2 PM or Thursday at 10 AM work better for you?' Always offer two specific times rather than asking an open-ended 'When are you free?'"),
      h2("Why It Matters for Aged Leads"),
      block("Appointment set rate is where aged leads surprise people. Prospects who were bombarded by five agents within 30 seconds of submitting a real-time lead are often exhausted and defensive. Aged lead prospects, contacted weeks or months later when the initial chaos has passed, are frequently more willing to schedule a real conversation. They have had time to think about their need, the urgency of competing agents has faded, and your call feels like a thoughtful follow-up rather than an aggressive pitch. Track your appointment set rate separately from your overall close rate — if your set rate is strong but your close rate on appointments is weak, you have a presentation problem, not a lead problem."),
    ],
  },
  {
    slug: "book-of-business",
    body: [
      h2("Understanding Book of Business"),
      block("A book of business is the total collection of active clients, policies, or accounts that an agent or broker manages. In insurance, it represents all in-force policies where the agent earns renewal commissions. In mortgage, it refers to the roster of past clients and active referral relationships. Your book of business is the long-term asset you are building — it is what makes your career sustainable beyond the constant grind of new lead acquisition."),
      block("The book of business generates recurring revenue through renewals, repeat purchases, cross-sells, and referrals. A final expense agent with 200 active policies might earn $3,000-5,000 per month in renewal commissions alone. A P&C agent with 500 households can generate $80,000-120,000 annually in renewals. This recurring income creates a floor underneath your earnings that new business adds to."),
      h2("How It Works in Practice"),
      block("Building a book of business from aged leads follows a predictable curve. In months 1-3, you are investing heavily in leads with minimal renewal income. By month 6, early sales begin generating renewals. By month 12, renewal income can cover 30-50% of your lead costs. By month 24, a well-maintained book can cover all operating expenses, making every new sale pure profit. The math accelerates because aged lead customers tend to persist at rates comparable to real-time lead customers — 75-85% 13-month persistency for final expense, for example."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads are the fastest way to build a book of business because the economics allow high volume. An agent spending $1,000 per month on aged leads at $2 each works 500 prospects. At a 2% conversion rate, that is 10 new clients per month, 120 per year. The same $1,000 spent on real-time leads at $25 each yields 40 prospects and maybe 4-5 sales. The aged lead agent builds a book 2-3x faster at the same budget. After two years, the book generates enough recurring income to fund all future lead purchases, creating a self-sustaining growth engine. The agents who struggle are the ones who chase individual deals instead of building the book."),
    ],
  },
  {
    slug: "cac-customer-acquisition-cost",
    body: [
      h2("Understanding CAC"),
      block("Customer Acquisition Cost (CAC) is the total cost of acquiring a single paying customer, including lead cost, marketing spend, time, technology, and overhead. While cost per lead measures what you pay for a prospect, CAC measures what you actually pay per closed deal. The formula is straightforward: total sales and marketing expenses divided by the number of new customers acquired in that period."),
      block("CAC is the metric that separates profitable operations from unprofitable ones. An agent might celebrate a low cost per lead without realizing their CAC is unsustainable because their conversion rate is too low or their overhead is too high. Every business decision — which leads to buy, how much to spend on a dialer, whether to hire an assistant — should be evaluated through its impact on CAC."),
      h2("How It Works in Practice"),
      block("Here is a real CAC calculation for an aged lead insurance agent. Monthly costs: 400 aged leads at $2 each ($800), dialer subscription ($150), CRM ($50), phone line ($40). Total monthly spend: $1,040. Sales closed: 9 policies. CAC: $115.56 per customer. If the average first-year commission is $900, the agent earns $8,100 gross on a $1,040 investment — a 7.8x return. Compare that to a real-time lead agent: 40 leads at $30 each ($1,200), same dialer and CRM costs ($240). Total: $1,440. Sales closed: 5. CAC: $288. Even though the real-time agent converts at a higher rate (12.5% vs. 2.25%), the CAC is 2.5x higher."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads consistently produce the lowest CAC in the lead industry. The math is simple: when your input cost is $1-3 per lead instead of $15-50, your CAC stays low even with modest conversion rates. This low CAC creates breathing room — room to invest in better tools, room to survive slow weeks, and room to scale without external funding. Track your CAC monthly and by lead type. If your CAC on 30-day aged leads is $80 but your CAC on 90-day leads is $60, shift your budget toward the 90-day leads. Let the data drive your purchasing decisions rather than assumptions about freshness."),
    ],
  },
  {
    slug: "cms-guidelines",
    body: [
      h2("Understanding CMS Guidelines"),
      block("CMS stands for the Centers for Medicare and Medicaid Services, the federal agency that administers Medicare, Medicaid, and the Children's Health Insurance Program. CMS Guidelines are the rules that govern how Medicare products can be marketed, sold, and enrolled. Every agent selling Medicare Advantage, Medicare Supplement, or Part D plans must comply with CMS marketing regulations, and violations can result in fines, suspension, or permanent exclusion from selling Medicare products."),
      block("Key CMS rules include: you cannot make unsolicited contact with a Medicare beneficiary without their prior permission, you must complete annual AHIP certification, all marketing materials must be filed and approved by the plan carrier, you cannot use misleading language about benefits, you must provide a Scope of Appointment form before any sales presentation, and you cannot sell non-health products during a Medicare sales appointment."),
      h2("How It Works in Practice"),
      block("CMS compliance shapes every aspect of Medicare lead outreach. When calling aged Medicare leads, you need documentation that the prospect originally requested information — the opt-in from their initial form submission. You must present a Scope of Appointment (SOA) before discussing specific plan details. You cannot cold call Medicare prospects. You cannot offer gifts or incentives worth more than $15. Your scripts must be accurate and cannot promise benefits the plan does not provide. CMS conducts mystery shopping and responds to complaints, so violations get caught."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medicare leads actually simplify CMS compliance in one important way: the original lead submission serves as documented consent for contact. The prospect filled out a form requesting information about Medicare plans — that is your permission to call. Keep records of the lead source and original submission date for every aged Medicare lead you purchase. Work with vendors who can provide lead origin documentation. Agents who ignore CMS guidelines face real consequences — in 2024 alone, CMS suspended enrollment capabilities for multiple agents and agencies. The rules are strict, but they are straightforward once you build compliance into your workflow from day one."),
    ],
  },
  {
    slug: "chargeback",
    body: [
      h2("Understanding Chargeback"),
      block("A chargeback occurs when a carrier takes back commission that was already paid to an agent because a policy lapsed or was cancelled within a specified period, typically 6-12 months. If you earned a $1,000 first-year commission on a final expense policy and the client cancels in month four, the carrier will claw back a prorated portion — often $600-800 — from your future commission payments. Chargebacks are the hidden risk in insurance sales that can devastate an agent's cash flow if not managed carefully."),
      block("Chargeback rates vary by product and lead source. Final expense policies typically see 15-25% chargeback rates in the first year. Medicare Advantage plans average 10-15% rapid disenrollment. Term life chargebacks run 8-15%. The chargeback window and calculation method differ by carrier — some prorate, some charge back the full advance, and some use a declining scale where the clawback decreases each month the policy remains in force."),
      h2("How It Works in Practice"),
      block("Here is how chargebacks compound. An agent writes 15 final expense policies in a month with an average $800 first-year commission. They receive $12,000 in commission or advances. Over the next 6 months, 4 policies lapse — a 27% chargeback rate. The carrier claws back approximately $2,400. That is 20% of the original income gone, often deducted from current month commissions. If the agent has a slow sales month and a heavy chargeback month simultaneously, they can actually owe money to the carrier. This is why cash reserves and persistency monitoring are critical."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads and chargebacks have a complex relationship. Some agents worry that aged lead customers will lapse more often because they were not 'hot' buyers. The data tells a different story. Aged lead customers who complete a thorough needs analysis and make an informed decision often persist at rates equal to or better than impulse buyers from real-time leads. The key is the quality of the sale, not the age of the lead. Rushed real-time lead sales where the agent pressures a quick close actually produce higher chargebacks than consultative aged lead sales. To minimize chargebacks, focus on proper needs analysis, ensure the customer understands and can afford the premium, and establish a post-sale check-in routine at 30, 60, and 90 days."),
    ],
  },
  {
    slug: "consumer-intent",
    body: [
      h2("Understanding Consumer Intent"),
      block("Consumer intent is the level of motivation and readiness a prospect has to take action on a purchase or inquiry. High-intent consumers are actively shopping and ready to buy — they are comparing quotes, reading reviews, and seeking a solution to an immediate problem. Low-intent consumers may have a vague interest but no urgency — they clicked on an ad out of curiosity or filled out a form for a free resource without serious purchase intent."),
      block("Intent exists on a spectrum, not as a binary. A prospect who searches 'how much does life insurance cost' has moderate intent. A prospect who searches 'apply for $250,000 term life insurance policy online' has extremely high intent. The lead generation process captures prospects at every point on this spectrum, and the intent level at capture directly impacts conversion probability."),
      h2("How It Works in Practice"),
      block("Intent signals include the specificity of the search query, the number of form fields completed (more fields = higher intent), whether the prospect provided a real phone number and email, the time spent on the page before submitting, and whether they visited multiple pages on the site. High-intent leads from branded searches or detailed applications convert at 10-20%. Low-intent leads from sweepstakes-style forms or incentivized clicks convert at 0.5-2%. Most aged leads fall in the moderate-intent range because the prospect took a deliberate action but may not have been ready to buy immediately."),
      h2("Why It Matters for Aged Leads"),
      block("The entire aged lead model is built on a single insight: consumer intent persists longer than salespeople think. Research shows that 80% of sales happen after the 5th contact, but 44% of salespeople give up after one follow-up. Aged leads represent the massive pool of prospects who had genuine intent but were either never contacted or abandoned too quickly. When you call an aged lead, your job is to reconnect with that original intent. Ask about their situation, reference their initial inquiry, and listen for signs that the need still exists. In most cases it does — the prospect simply never found the right person to help them at the right time. That person can be you, months later, because the intent did not expire even if the original salesperson's patience did."),
    ],
  },
  {
    slug: "contingency-fee",
    body: [
      h2("Understanding Contingency Fee"),
      block("A contingency fee is a payment arrangement where a professional — typically an attorney — receives compensation only if the case is successful. The fee is a percentage of the settlement or award, usually 33-40% for personal injury cases. If the case is lost or no settlement is reached, the client pays nothing. This arrangement makes legal representation accessible to people who cannot afford to pay hourly attorney rates upfront."),
      block("In the lead generation context, contingency fee arrangements drive enormous demand for legal leads, particularly in personal injury, mass tort, Social Security Disability, and workers' compensation. Attorneys working on contingency are highly motivated lead buyers because their entire revenue depends on case volume — no cases, no income."),
      h2("How It Works in Practice"),
      block("A personal injury attorney's economics illustrate why legal lead buying is so aggressive. The average personal injury settlement is $20,000-50,000, and the attorney takes 33%, earning $6,600-16,500 per case. Even at $50-100 per real-time legal lead with a 2-5% conversion rate, the math works: 50 leads at $75 each costs $3,750, yielding 1-2 signed cases worth $6,600-33,000 in fees. The ROI justifies aggressive lead spending. For mass tort cases — defective products, harmful medications — a single case can be worth $100,000+, making lead costs almost irrelevant."),
      h2("Why It Matters for Aged Leads"),
      block("Aged legal leads represent a massive opportunity because of the contingency fee model. Attorneys who paid $75-150 for real-time legal leads worked them for 7-14 days and moved on. But personal injury statutes of limitations run 1-4 years depending on the state. A lead from 90 days ago is still well within the actionable window. MVA leads, slip-and-fall leads, and SSDI leads all have long relevance periods. Aged legal leads at $3-10 each allow attorneys and legal intake centers to build high-volume pipelines at a fraction of real-time costs. The key qualification question is simple: 'Have you already retained an attorney for this matter?' If not, the lead is still viable regardless of age."),
    ],
  },
  {
    slug: "cost-per-acquisition-cpa",
    body: [
      h2("Understanding CPA"),
      block("Cost Per Acquisition (CPA) measures the total cost to convert a prospect into a paying customer or completed transaction. Unlike cost per lead, which only counts the price of obtaining a name and contact information, CPA factors in the full cost of getting from lead to closed deal. The formula is total campaign cost divided by the number of acquisitions (sales, sign-ups, or enrolled policies). CPA is the bottom-line efficiency metric that determines whether your lead strategy is profitable."),
      h2("How It Works in Practice"),
      block("Consider two agents selling Medicare Advantage plans. Agent A buys 30 real-time Medicare leads at $35 each during AEP — $1,050 in lead costs. She converts 5, giving her a CPA of $210. Agent B buys 400 aged Medicare leads at $2 each — $800 in lead costs. He converts 10, giving him a CPA of $80. Agent B's conversion rate is lower (2.5% vs 16.7%), but his CPA is 62% lower because the input cost advantage overwhelms the conversion rate difference. Both agents are profitable since Medicare Advantage commissions run $400-600 per enrollment, but Agent B is making significantly more per dollar spent."),
      block("CPA varies widely by vertical. Insurance CPA benchmarks: final expense $50-150, Medicare $60-200, term life $80-250. Mortgage CPA benchmarks: purchase $200-500, refinance $150-400. Solar CPA: $150-400. These ranges reflect the full spectrum from aged leads (low end) to real-time exclusive leads (high end)."),
      h2("Why It Matters for Aged Leads"),
      block("CPA is the metric that proves the aged lead model works. Critics focus on conversion rate — 'only 2% convert!' — but conversion rate without cost context is meaningless. A 2% conversion rate at $2 per lead produces a $100 CPA. A 15% conversion rate at $40 per lead produces a $267 CPA. The aged lead CPA wins by nearly 3x. Track your CPA weekly, by lead source, by lead age band, and by vertical. This data tells you exactly where to allocate your next dollar of lead spend for maximum return. The agents who scale fastest are the ones who optimize for CPA, not conversion rate."),
    ],
  },
  {
    slug: "cross-selling",
    body: [
      h2("Understanding Cross-Selling"),
      block("Cross-selling is the practice of offering additional, complementary products or services to an existing customer. When a final expense agent also helps a client with their Medicare Supplement plan, that is cross-selling. When a mortgage loan officer refers a closed borrower to a home insurance agent, that is cross-selling. The strategy leverages the trust and relationship established during the initial sale to generate additional revenue without additional lead cost."),
      h2("How It Works in Practice"),
      block("Natural cross-sell combinations by vertical: final expense customers often need Medicare Supplement, Medicare Advantage, hospital indemnity, and dental/vision plans. Mortgage borrowers need homeowner's insurance, life insurance, and eventually refinancing or home equity products. Auto insurance customers need home insurance, umbrella policies, and life insurance. Solar customers need home battery storage, EV charging, and home warranty products. The most effective cross-sell happens at two moments — during the initial sale when the client's trust is highest, and at 30-90 day follow-up when the first product is delivering value."),
      block("Top-performing agents earn 30-50% of their income from cross-selling. A final expense agent who averages $800 per initial sale might add $400-600 in cross-sold products, increasing revenue per customer by 50-75% with zero additional lead cost. The key is asking discovery questions during the initial sale that naturally surface cross-sell opportunities: 'Do you have a Medicare plan you are happy with?' 'Is your prescription drug coverage handling your medications?'"),
      h2("Why It Matters for Aged Leads"),
      block("Cross-selling transforms aged lead economics from good to exceptional. Your CAC on aged leads is already low — $50-150 per customer. Every cross-sold product adds revenue to that same acquisition cost, effectively driving your per-product CAC even lower. An agent who acquires a customer for $100 through aged leads and then sells three products to that customer has a per-product CAC of $33. Cross-selling also increases customer retention — clients with multiple policies or products are 3-4x less likely to lapse or switch providers. Build cross-selling into your sales process from day one. Every aged lead customer is not just one sale — they are a potential portfolio of products and a future referral source."),
    ],
  },
  {
    slug: "denial-rate",
    body: [
      h2("Understanding Denial Rate"),
      block("Denial rate is the percentage of submitted applications that are rejected or declined by the underwriting entity — whether that is an insurance carrier, a mortgage lender, or a disability determination service. If you submit 20 final expense applications and 4 are declined, your denial rate is 20%. High denial rates waste time, damage morale, and inflate your true cost per acquisition because you invested selling effort in prospects who could never have been approved."),
      h2("How It Works in Practice"),
      block("Denial rates vary dramatically by product and how well the agent pre-qualifies. Final expense insurance denial rates: 10-20% for agents who use health questionnaires during the presentation, 30-40% for agents who skip pre-qualification. Mortgage denial rates: 15-25% overall, but as low as 5-10% for loan officers who use automated underwriting systems before taking full applications. SSDI claim denial rates are notoriously high — 60-70% at initial application — which is why SSDI leads often need multiple touches over 12-24 months as clients go through appeals."),
      block("The best agents treat denial rate as a controllable metric. They pre-screen for health conditions before writing final expense applications, pull soft credit before taking mortgage applications, and verify basic eligibility criteria before scheduling presentations. Every denied application represents 30-90 minutes of wasted time that could have been spent on a qualifiable prospect."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads require extra attention to denial rate because the prospect's circumstances may have changed since their original inquiry. A mortgage lead from 90 days ago might have taken on new debt, changed jobs, or experienced a credit event. An insurance lead might have developed new health conditions. Build qualification questions into your first conversation: 'Has anything changed with your health since you first looked into coverage?' 'Are you still at the same employer?' These questions take 60 seconds and can save you hours of wasted application work. A low denial rate means your sales time is being spent productively, and with aged leads where volume is the game, productivity per hour determines your income."),
    ],
  },
  {
    slug: "ftc-disclosure",
    body: [
      h2("Understanding FTC Disclosure"),
      block("FTC Disclosure refers to the Federal Trade Commission's requirements for transparency in advertising, endorsements, and lead generation. Any material connection between a promoter and a product must be clearly disclosed to the consumer. This includes affiliate relationships, paid sponsorships, financial incentives for reviews, and the commercial nature of lead generation forms. The FTC's Endorsement Guides and advertising rules require that consumers know when they are interacting with commercial content designed to sell them something."),
      h2("How It Works in Practice"),
      block("In lead generation, FTC disclosure requirements affect every step of the process. Websites that collect consumer information must clearly state how that information will be used, including that it may be shared with or sold to third parties like insurance agents, loan officers, or solar companies. Comparison sites that recommend specific products must disclose affiliate relationships. Testimonials must reflect genuine experiences and disclose any compensation. The fine print matters — buried disclosures in tiny gray text on a gray background do not meet FTC standards. Disclosures must be clear, conspicuous, and unavoidable."),
      block("The FTC has been increasingly aggressive about enforcement in the lead generation industry. In recent years, they have pursued actions against companies using fake news sites, misleading comparison tools, and deceptive lead forms that implied government affiliation. Penalties can reach millions of dollars."),
      h2("Why It Matters for Aged Leads"),
      block("When you buy aged leads, the FTC disclosure practices of the original lead generator affect your compliance posture. Leads generated from sites with proper disclosure — clear language about information sharing, transparent privacy policies, genuine opt-in consent — give you a solid foundation for outreach. Leads from deceptive sources create risk. Work with vendors who can demonstrate that their lead sources maintain proper FTC-compliant disclosures. This is not just legal protection — leads from transparent sources convert better because the prospect understood what they were signing up for and genuinely wanted to hear from a professional. Compliance and quality go hand in hand."),
    ],
  },
  {
    slug: "final-expense-insurance",
    body: [
      h2("Understanding Final Expense Insurance"),
      block("Final expense insurance is a type of whole life insurance designed to cover end-of-life costs including funeral and burial expenses, outstanding medical bills, and small debts. Policies typically range from $5,000 to $50,000 in face value with monthly premiums of $30-100. The product targets seniors aged 50-85, often with health conditions that would disqualify them from traditional life insurance. Simplified issue and guaranteed issue policies require no medical exam — just answers to a few health questions on the application."),
      h2("How It Works in Practice"),
      block("Final expense is one of the highest-volume aged lead verticals. The sales process often involves a kitchen table presentation — an in-home visit where the agent sits with the prospect, reviews their needs, and completes the application on the spot. Phone sales have grown significantly, with many agents now closing 100% by phone using screen-sharing tools to walk prospects through the application. Average first-year commission runs $500-1,200 per policy depending on the face amount and carrier. Top field agents write 15-25 policies per month; top phone agents write 20-40."),
      block("The final expense market is massive — roughly 2.8 million Americans turn 65 each year, and the average funeral cost exceeds $8,000. Most middle-income seniors are underinsured for end-of-life expenses, creating consistent demand regardless of economic conditions."),
      h2("Why It Matters for Aged Leads"),
      block("Final expense is arguably the best vertical for aged leads. The product solves a universal, emotional need that does not go away with time. A senior who requested information about burial insurance 90 days ago still needs burial insurance. The target demographic — seniors 50-85 — answers their phones at much higher rates than younger prospects, producing contact rates of 15-25% on aged leads. The low cost of aged final expense leads ($1-3) combined with strong commissions ($500-1,200) creates ROI that is hard to match in any other vertical. New agents routinely build profitable books of business within 60-90 days by working 300-500 aged final expense leads per month."),
    ],
  },
  {
    slug: "heloc",
    body: [
      h2("Understanding HELOC"),
      block("A HELOC — Home Equity Line of Credit — is a revolving credit line secured by the borrower's home equity. Unlike a traditional home equity loan that provides a lump sum, a HELOC works like a credit card: the borrower has a credit limit based on their available equity and can draw funds as needed during a draw period (typically 10 years), then repay during a repayment period (typically 20 years). Interest rates are usually variable, though some lenders offer fixed-rate options."),
      block("HELOCs have grown in popularity as home values have increased. With the average American homeowner sitting on over $300,000 in equity as of 2025, the addressable market is enormous. Common uses include home renovations, debt consolidation, education expenses, and emergency reserves. The interest may be tax-deductible when used for home improvements, adding to the product's appeal."),
      h2("How It Works in Practice"),
      block("HELOC lead generation targets homeowners with significant equity, good credit scores (typically 680+), and a demonstrated need for funds. Lead forms typically ask about property value, mortgage balance, desired loan amount, credit range, and intended use of funds. Real-time HELOC leads command $25-50 each because the market is competitive and the loan amounts (and corresponding originator compensation) are substantial. A $150,000 HELOC can generate $3,000-4,500 in originator compensation."),
      h2("Why It Matters for Aged Leads"),
      block("Aged HELOC leads are particularly valuable because the borrower's need for funds rarely disappears in 30-90 days. Someone planning a kitchen renovation, consolidating credit card debt, or setting up an emergency fund is still working on that goal months later. The home equity is still there. The key qualification on aged HELOC leads is verifying that the homeowner has not already obtained a HELOC elsewhere. A simple question — 'Have you already secured the funding you were looking for?' — separates active prospects from completed transactions. Aged HELOC leads at $2-5 each provide loan officers with a high-volume, low-cost pipeline that complements their real-time lead and referral channels."),
    ],
  },
  {
    slug: "indexed-universal-life-iul",
    body: [
      h2("Understanding IUL"),
      block("Indexed Universal Life (IUL) is a permanent life insurance product that builds cash value based on the performance of a stock market index, typically the S&P 500, without directly investing in the market. The policy has a floor (usually 0-1%) that protects against market losses and a cap (typically 8-14%) that limits gains in strong market years. IUL combines a death benefit with a tax-advantaged savings vehicle, making it popular for retirement supplementation, estate planning, and income replacement."),
      h2("How It Works in Practice"),
      block("IUL is one of the most complex insurance products to sell, which is why lead quality matters enormously. The target prospect typically earns $75,000+ annually, is 30-55 years old, has maxed out or is ineligible for traditional retirement accounts, and is looking for tax-advantaged growth with downside protection. Commissions on IUL policies are substantial — first-year premiums of $300-1,000 per month generate agent commissions of $3,000-12,000+. The complexity of the product means the sales cycle is longer, often requiring 2-3 meetings to educate the prospect and complete the application."),
      block("IUL sales require strong financial literacy and the ability to explain crediting strategies, cap rates, participation rates, and policy illustrations without overwhelming the prospect. Agents who focus on the concept — 'market upside without market risk, plus tax-free retirement income' — outsell agents who lead with the mechanics."),
      h2("Why It Matters for Aged Leads"),
      block("IUL leads are expensive in real-time — $30-75 each — because the commissions justify aggressive spending. Aged IUL leads at $3-8 each represent people who were exploring sophisticated financial strategies. These are not impulse buyers — they were researching, comparing, and evaluating. Many did not buy immediately because the product requires careful consideration. That deliberation window is your opportunity. Calling 90 days later with a patient, educational approach matches their buying style perfectly. IUL aged lead prospects often appreciate an agent who is not rushing them, who provides clear explanations, and who respects their need to make an informed decision."),
    ],
  },
  {
    slug: "kitchen-table-presentation",
    body: [
      h2("Understanding Kitchen Table Presentations"),
      block("The kitchen table presentation is a face-to-face sales meeting conducted in the prospect's home, typically at their kitchen or dining room table. This is the traditional method for selling final expense insurance, Medicare plans, and other products targeting seniors. The agent visits the home, sits down with the prospect (and often a spouse or family member), reviews their needs, presents options, and completes the application on the spot. Despite the growth of phone and digital sales, kitchen table presentations remain the highest-converting sales method in several insurance verticals."),
      h2("How It Works in Practice"),
      block("A strong kitchen table presentation follows a structured flow. The agent arrives on time, makes personal connection in the first 3-5 minutes, transitions to a needs analysis by asking about current coverage and concerns, presents 2-3 options at different price points (never just one), recommends the best fit, handles objections, and closes by completing the application. The entire process takes 30-45 minutes for a skilled agent. Close rates on kitchen table presentations run 50-70% for final expense and 40-60% for Medicare — dramatically higher than phone-only sales."),
      block("The economics require geographic density. An agent driving 30 minutes between appointments can run 4-6 appointments per day. An agent with a tight territory and clustered appointments can run 6-10. At 60% close rate, 6 appointments produce 3-4 sales per day. That is $2,400-4,800 in commission per day from aged leads that cost $1-3 each."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads and kitchen table presentations are a proven combination, particularly in final expense. You purchase aged leads filtered by zip code to build a dense local territory. At $1-2 per lead, you can afford to buy 200-400 leads in your target area and set 3-5 appointments per day of calling. The in-person meeting overcomes the primary objection to aged leads — trust. When you show up in person, dressed professionally, with materials in hand, the prospect sees a real human being, not just another phone call. The face-to-face format builds trust faster than any other channel, which is why kitchen table close rates are 3-4x higher than phone close rates on the same aged leads."),
    ],
  },
  {
    slug: "ltv-lifetime-value",
    body: [
      h2("Understanding LTV"),
      block("Lifetime Value (LTV) is the total revenue a customer generates over the entire duration of their relationship with you. For an insurance agent, LTV includes the first-year commission, all renewal commissions for as long as the policy remains in force, commissions from cross-sold products, and revenue from referrals the customer provides. LTV is the metric that transforms your view of each lead from a one-time transaction to a long-term investment."),
      h2("How It Works in Practice"),
      block("Here is how LTV compounds in final expense insurance. First-year commission: $800. Annual renewal commissions (years 2-10): $80/year x 9 years = $720. Cross-sold Medicare Supplement commission: $300 first year + $150/year renewals for 5 years = $1,050. One referral who becomes a client: another $800 first-year + renewals. Total LTV over 10 years: approximately $3,370 from a single initial sale. That original aged lead cost $2. For mortgage, LTV works differently — the initial loan generates a one-time commission of $3,000-8,000, but a retained client refinances every 5-7 years and provides 1-2 referrals per year."),
      block("The LTV calculation changes how you evaluate lead spend. An agent who only looks at first-year commission might balk at a $150 CAC. An agent who understands LTV recognizes that a $150 CAC on a $3,370 LTV customer is a 22:1 return — one of the best investments available anywhere."),
      h2("Why It Matters for Aged Leads"),
      block("LTV is the metric that justifies the aged lead model to skeptics. Yes, aged lead conversion rates are lower than real-time leads. But when you factor in the low CAC and the full LTV of each acquired customer, aged leads produce superior long-term returns. The agents who build the most valuable books of business are the ones who think in LTV, not transaction value. They invest in client relationships, follow up after the sale, cross-sell appropriately, and ask for referrals — all activities that multiply LTV from a single aged lead acquisition. Every $2 aged lead is potentially a $3,000+ relationship."),
    ],
  },
  {
    slug: "lead-source",
    body: [
      h2("Understanding Lead Source"),
      block("Lead source identifies where a lead originated — the specific channel, campaign, or platform that captured the prospect's information. Common lead sources include organic search (someone found your website through Google), paid search (they clicked an ad), social media (Facebook or Instagram forms), referral (an existing client sent them), direct mail response, inbound phone calls, and purchased leads from a vendor. Tracking lead source is fundamental to understanding which channels produce the best results and deserve more investment."),
      h2("How It Works in Practice"),
      block("In the aged lead market, lead source information from the original capture matters enormously. Leads from organic search — where someone actively searched for 'life insurance quotes' or 'solar panel cost' — consistently outperform leads from social media advertising where the prospect was interrupted while scrolling. Leads from multi-field forms (name, phone, email, address, specific product interest) outperform leads from single-field forms because the additional effort signals higher intent. Ask your aged lead vendor about sourcing. The best vendors can tell you: 'These leads came from organic search forms on comparison websites' or 'These are from Facebook lead ads targeting homeowners aged 30-55.'"),
      block("Not all lead sources are equal. Search-intent leads (Google, Bing) generally convert 2-3x better than interruption leads (Facebook, display ads). Referral leads convert 3-5x better than any paid channel. Inbound phone calls convert highest of all — 20-40% — because the prospect picked up the phone and called you."),
      h2("Why It Matters for Aged Leads"),
      block("When you buy aged leads, you are typically buying from a mix of sources. Understanding that mix helps you set expectations and tailor your approach. If your vendor provides high-intent search leads, use a consultative approach that references their research. If the leads came from social media, expect that some prospects may not clearly remember submitting a form — lead with value and context rather than assuming they remember their inquiry. Track your conversion rates by lead vendor and, if possible, by lead source within each vendor. This data becomes your competitive advantage — it tells you exactly where your next dollar of lead spend should go."),
    ],
  },
  {
    slug: "lead-vendor",
    body: [
      h2("Understanding Lead Vendors"),
      block("A lead vendor is a company that generates, aggregates, or resells consumer leads to sales professionals. In the aged lead ecosystem, vendors fall into three categories: generators (companies that run their own websites and ad campaigns to capture leads), aggregators (companies that buy leads from multiple generators and resell them), and marketplaces (platforms where generators and buyers transact directly). The vendor you choose directly impacts the quality, exclusivity, and compliance of the leads you work."),
      h2("How It Works in Practice"),
      block("Evaluating aged lead vendors requires asking the right questions. Where do the leads originate — owned websites, affiliate networks, or unknown sources? How many times has each lead been sold? What data fields are included — name, phone, email, address, product interest, health information? What is the return policy for bad data (disconnected numbers, wrong contact info)? How old are the leads — 30 days or 300 days? Do they filter for DNC compliance? Can they provide the original opt-in language and lead source documentation?"),
      block("Pricing varies widely among vendors. Expect to pay $0.50-2 for 90-180 day old leads, $2-5 for 30-60 day leads, and $5-10 for 7-30 day leads. Volume discounts are common — buying 1,000 leads typically costs 20-40% less per lead than buying 100. Start with a small test order (100-200 leads) before committing to large purchases. Track conversion rates, contact rates, and bad data rates for each vendor separately."),
      h2("Why It Matters for Aged Leads"),
      block("Your lead vendor is your supply chain. A bad vendor wastes your time and money; a good vendor becomes your competitive advantage. The best vendors maintain clean data, remove known bad numbers, scrub against the DNC list, and can document the opt-in source for every lead. Build relationships with 2-3 vendors and continuously test. Do not put all your volume with one vendor — diversification protects you from data quality drops and ensures you always have a reliable lead supply. The agents who succeed long-term treat vendor management as a core business skill, not an afterthought."),
    ],
  },
  {
    slug: "loan-officer",
    body: [
      h2("Understanding the Loan Officer Role"),
      block("A loan officer (LO) is a licensed professional who helps borrowers navigate the mortgage process from application through closing. They evaluate financial qualifications, recommend loan products (conventional, FHA, VA, USDA, jumbo), lock interest rates, coordinate with underwriting, and guide borrowers through the documentation requirements. Loan officers work at banks, credit unions, mortgage companies, and as independent brokers. Their compensation comes from origination fees and/or lender-paid commission, typically 0.5-2.75% of the loan amount — $1,500-11,000+ per closed loan."),
      h2("How It Works in Practice"),
      block("Loan officers live and die by their pipeline. A typical LO needs 4-6 closed loans per month to earn a solid income, which requires 15-25 applications in the pipeline at any given time, accounting for fallout from denials, rate lock expirations, and borrowers who choose a competitor. Lead generation is the constant challenge — the most successful LOs use a combination of referral partnerships (real estate agents, financial planners, builders), digital marketing, past client databases, and purchased leads. The average LO closes 2-4 loans per month; top producers close 10-20+."),
      h2("Why It Matters for Aged Leads"),
      block("Aged mortgage leads are a natural fit for loan officers because the mortgage decision cycle is inherently long. A borrower who inquired about refinancing 90 days ago may still be evaluating options — mortgage decisions involve significant financial commitment and naturally take weeks or months. Aged purchase leads catch borrowers still house-hunting who may have been pre-approved but not yet under contract. Aged refinance leads reach homeowners who are still monitoring rates for the right opportunity. At $2-5 per aged mortgage lead versus $25-75 for real-time, loan officers can build massive prospecting databases. The key is persistence and multi-channel outreach — call, email, text (with consent), and direct mail. LOs who work aged leads consistently report that 60-70% of their closings come from leads aged 30 days or more, proving that speed-to-lead is not the only path to production."),
    ],
  },
  {
    slug: "loan-to-value-ltv",
    body: [
      h2("Understanding Loan-to-Value Ratio"),
      block("Loan-to-Value (LTV) ratio is the percentage of a property's appraised value that is financed by a loan. If a home is worth $400,000 and the mortgage balance is $320,000, the LTV is 80%. LTV is one of the most important metrics in mortgage lending because it measures the lender's risk — higher LTV means more risk because the borrower has less equity cushioning the loan. LTV determines loan eligibility, interest rates, mortgage insurance requirements, and refinancing options."),
      h2("How It Works in Practice"),
      block("LTV thresholds drive key lending decisions. Below 80% LTV: no private mortgage insurance required, best interest rates available, maximum refinance options. 80-95% LTV: private mortgage insurance required (adds $50-200/month), slightly higher rates, still eligible for conventional loans. 95-96.5% LTV: FHA territory, higher insurance costs, limited to FHA products. 97-100% LTV: VA and USDA loans only, zero or minimal down payment programs. Above 100% LTV: the borrower is 'underwater' — they owe more than the home is worth and cannot refinance through conventional channels."),
      block("For HELOC and home equity lending, LTV is equally critical. Most lenders cap combined LTV (first mortgage plus HELOC) at 80-90%. On a $500,000 home with a $300,000 first mortgage (60% LTV), the borrower might qualify for a HELOC up to $100,000-150,000, bringing combined LTV to 80-90%."),
      h2("Why It Matters for Aged Leads"),
      block("Understanding LTV helps you qualify aged mortgage leads quickly. A prospect who inquired about refinancing 90 days ago may have seen their home value increase in that time — potentially improving their LTV and qualifying them for better terms than when they first inquired. This is actually a selling point: 'Home values in your area have gone up since you last looked at this — you may qualify for even better terms now.' For aged HELOC leads, LTV determines available equity and directly impacts whether the prospect qualifies. Asking about approximate home value and current mortgage balance in your first conversation lets you quickly identify viable prospects and avoid wasting time on borrowers who do not have sufficient equity."),
    ],
  },
  {
    slug: "mva-motor-vehicle-accident",
    body: [
      h2("Understanding MVA Leads"),
      block("MVA stands for Motor Vehicle Accident, and MVA leads are prospects who have been involved in a car accident and may need legal representation for a personal injury claim. MVA leads are one of the highest-volume and most valuable lead types in the legal vertical. There are approximately 6 million car accidents in the U.S. annually, with about 3 million resulting in injuries. Each of those injured individuals is a potential client for a personal injury attorney working on contingency."),
      h2("How It Works in Practice"),
      block("MVA leads are generated through multiple channels: online search (people googling 'car accident lawyer near me'), hospital and clinic referrals, police report mining services, Facebook ads targeting accident victims, and television advertising. Real-time MVA leads cost $50-150 each because the average personal injury settlement for car accidents is $20,000-30,000, generating attorney fees of $6,600-10,000 per case. The intake process involves verifying the accident occurred, confirming injuries exist, checking that no attorney has been retained, and determining liability (who was at fault)."),
      block("Timing matters with MVA leads because statutes of limitations vary by state — typically 2-4 years from the accident date. Insurance companies pressure accident victims to settle quickly and cheaply, often within the first 30 days. Reaching an MVA lead before they accept a lowball settlement is the key to case acquisition."),
      h2("Why It Matters for Aged Leads"),
      block("Aged MVA leads are exceptionally valuable because the statute of limitations window is long. A lead from 90 or even 180 days ago is well within the actionable period in every state. Many accident victims do not immediately seek legal help — they are dealing with medical treatment, insurance paperwork, and recovery. By the time they realize they need an attorney, the original lead vendor has moved on. Aged MVA leads at $5-15 each reach these prospects during the consideration phase, when they have had time to understand the full impact of their injuries and are more motivated to take legal action. The qualification question is simple and direct: 'Have you already hired an attorney for your accident?' If the answer is no, the lead is live."),
    ],
  },
  {
    slug: "medicare-advantage",
    body: [
      h2("Understanding Medicare Advantage"),
      block("Medicare Advantage (Medicare Part C) is an alternative to Original Medicare offered by private insurance carriers approved by CMS. Instead of the traditional fee-for-service Medicare, beneficiaries enroll in a managed care plan that bundles Part A (hospital), Part B (medical), and usually Part D (prescription drugs) into a single plan. Many Medicare Advantage plans offer additional benefits not covered by Original Medicare, including dental, vision, hearing, fitness memberships, and over-the-counter allowances. Monthly premiums range from $0 to $50 for many plans, making them attractive to cost-conscious seniors."),
      h2("How It Works in Practice"),
      block("Medicare Advantage enrollment has grown dramatically — over 30 million Americans are now enrolled, representing about 50% of all Medicare beneficiaries. Agents earn $600+ for each new enrollment during AEP, with renewal commissions of $300+ each subsequent year. The enrollment process requires CMS compliance: Scope of Appointment documentation, accurate plan presentation, proper disclaimers, and the use of carrier-approved marketing materials. Agents can sell during AEP (October 15 - December 7), OEP (January 1 - March 31), and during Special Enrollment Periods triggered by qualifying life events."),
      h2("Why It Matters for Aged Leads"),
      block("Medicare Advantage is one of the most profitable aged lead verticals because of the combination of high commissions, recurring renewals, and strong demand. Seniors who inquired about Medicare plans 60-90 days ago often did not make a decision — they were overwhelmed by the volume of calls and mailings from competing agents. Reaching them after the initial frenzy subsides puts you in a consultative position rather than a competitive one. You are not the 12th agent calling in the same afternoon — you are the one agent following up weeks later when they are ready to have a thoughtful conversation. Aged Medicare leads at $2-4 each, combined with $600+ per enrollment and multi-year renewals, produce some of the strongest ROI in the entire lead industry. Build a book of 200+ Medicare Advantage clients and you have a six-figure renewal income stream that grows every year."),
    ],
  },
  {
    slug: "medicare-supplement-medigap",
    body: [
      h2("Understanding Medicare Supplement"),
      block("Medicare Supplement insurance, commonly called Medigap, is a private insurance policy that helps pay for out-of-pocket costs not covered by Original Medicare — including deductibles, copayments, coinsurance, and excess charges. Unlike Medicare Advantage, which replaces Original Medicare, Medigap works alongside it. The beneficiary keeps Original Medicare and adds a Medigap policy to cover the gaps. Plans are standardized by letter (Plan A through Plan N), with Plan G and Plan N being the most popular since the elimination of Plan F for new enrollees in 2020."),
      h2("How It Works in Practice"),
      block("Medigap premiums range from $100-300+ per month depending on the plan, carrier, location, and the beneficiary's age. Agent commissions are typically 20-25% of the first-year premium and 5-10% on renewals. A Plan G policy at $180/month generates approximately $430 in first-year commission and $100-180 in annual renewals. The sales process involves comparing premiums across carriers since the benefits are standardized — a Plan G from Mutual of Omaha covers the same things as a Plan G from Aetna. The differentiator is price, carrier financial strength, and rate increase history."),
      block("The Medigap Open Enrollment Period starts when a beneficiary turns 65 and enrolls in Medicare Part B. During this 6-month window, they cannot be denied coverage or charged higher premiums due to pre-existing conditions. Outside this window, carriers can use medical underwriting to decline applications or charge rated premiums."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medigap leads are valuable because the purchase decision is ongoing, not limited to a single enrollment period like Medicare Advantage. Beneficiaries can buy Medigap at any time if they can pass underwriting, and they frequently shop for lower premiums as their current rates increase. An aged lead from someone turning 65 three months ago may still be in their Open Enrollment Period, making them a guaranteed-issue prospect. The key question is their Medicare Part B effective date — if they are within 6 months, they cannot be declined. Aged Medigap leads combined with rate comparison tools make for a straightforward sales conversation: 'Let me show you what the same coverage costs with a different carrier.'"),
    ],
  },
  {
    slug: "net-metering",
    body: [
      h2("Understanding Net Metering"),
      block("Net metering is an energy billing arrangement where solar panel owners receive credit from their utility company for excess electricity their system generates and sends back to the grid. When your solar panels produce more electricity than your home uses during the day, the surplus flows to the grid and your meter literally runs backward. At night or on cloudy days when your panels produce less than you need, you draw from the grid and use those credits. At the end of the billing period, you pay only for the net energy consumed — the difference between what you used and what you generated."),
      h2("How It Works in Practice"),
      block("Net metering policies vary significantly by state and utility. In strong net metering states (California until NEM 3.0, New Jersey, Massachusetts), credits are valued at the full retail electricity rate — $0.15-0.35 per kilowatt-hour. This means every excess kilowatt your system produces saves you the full retail price. In weaker net metering states, credits may be valued at the wholesale or avoided-cost rate — $0.03-0.08 per kWh — making solar less financially attractive. Some states have eliminated net metering entirely or transitioned to net billing, where exported energy is compensated at a lower rate."),
      block("For solar sales, net metering policy is the single biggest factor in the financial pitch. In strong net metering markets, a homeowner with a $200 monthly electric bill can often reduce it to $0-20 with a properly sized solar system. In weak or no net metering markets, the savings are more modest — 40-60% reduction rather than 80-100%."),
      h2("Why It Matters for Aged Leads"),
      block("When working aged solar leads, understanding the local net metering policy is essential for a credible conversation. Prospects who inquired months ago may have received confusing or outdated information about savings potential. Providing clear, accurate net metering details for their specific utility builds trust and differentiates you from the aggressive solar salespeople who oversold the savings. Ask which utility serves their home, look up the current net metering policy, and present realistic savings projections. Honesty about what net metering delivers in their area — even if the news is less exciting than they hoped — creates the trust that closes deals."),
    ],
  },
  {
    slug: "open-enrollment-period-oep",
    body: [
      h2("Understanding OEP"),
      block("The Open Enrollment Period (OEP) for Medicare runs from January 1 through March 31 each year. During OEP, Medicare Advantage enrollees can make one change to their coverage: they can switch from one Medicare Advantage plan to another, or they can drop Medicare Advantage and return to Original Medicare (with the option to add a standalone Part D plan). OEP is sometimes called the Medicare Advantage Open Enrollment Period to distinguish it from AEP. Importantly, OEP does not allow people on Original Medicare to join a Medicare Advantage plan — that can only be done during AEP or a Special Enrollment Period."),
      h2("How It Works in Practice"),
      block("OEP is the cleanup period after AEP. Beneficiaries who made a hasty decision during AEP, chose the wrong plan, or had buyer's remorse have a second chance to adjust. Volume is lower than AEP — roughly 10-15% of AEP activity — but the prospects are often highly motivated because they are actively dissatisfied with their current plan choice. Agent commissions during OEP are the same as AEP: $600+ per new Medicare Advantage enrollment."),
      block("The strategic play during OEP is reaching out to beneficiaries who enrolled in competing agents' plans during AEP. If a prospect chose a plan with a narrow provider network and just discovered their doctor is not in-network, they are a highly motivated OEP prospect. This makes OEP an excellent time for competitive prospecting."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medicare leads from AEP become OEP gold. Leads from October through December that went uncontacted or unconverted are now 30-90 day aged leads — right in the sweet spot for aged lead economics. The prospect was actively shopping during AEP, and now during OEP they may either be unhappy with their choice or still have not made any change. Purchasing AEP-era aged leads during January-March gives you a curated pool of Medicare-shopping seniors at $2-4 per lead instead of the $30-50 they cost during AEP. The timing is perfect, the intent is verified, and the price is right."),
    ],
  },
  {
    slug: "opt-in",
    body: [
      h2("Understanding Opt-In"),
      block("An opt-in is the explicit action a consumer takes to give permission for a company to contact them. In lead generation, this means the prospect filled out a form, checked a box, clicked a button, or otherwise actively requested information or contact. The opt-in is the legal foundation of the entire lead industry — without it, contacting the prospect may violate TCPA, CAN-SPAM, state privacy laws, and FTC regulations. The opt-in is also the moral foundation: it represents a real person saying 'Yes, I want to hear from you.'"),
      h2("How It Works in Practice"),
      block("Not all opt-ins are created equal. A single opt-in occurs when someone fills out a form and clicks submit — one action. A double opt-in adds a confirmation step, typically an email asking the person to click a link to verify their interest. Double opt-in leads are higher quality (30-50% higher contact rates) but lower volume. The opt-in language matters enormously. A form that says 'By clicking submit, you agree to be contacted by up to 4 insurance agents by phone, email, or text' creates a legitimate basis for outreach. A form buried in a terms-of-service page with no visible consent language creates legal risk."),
      block("Since the FCC's one-to-one consent ruling, lead sellers increasingly need to show that the prospect consented to be contacted by specific, named companies rather than a generic category of sellers. This shift is making documented opt-in provenance more valuable than ever."),
      h2("Why It Matters for Aged Leads"),
      block("Every aged lead started with an opt-in. That opt-in is your permission to call, your opening line, and your proof of legitimacy. When you contact an aged lead, you are not cold calling — you are following up on their request. Always reference the opt-in in your opening: 'You filled out a request for life insurance information a few months ago.' This immediately establishes that you have a reason to call and that they initiated the contact. Ask your lead vendor about the opt-in language and source for every batch of leads. Vendors who can provide original form screenshots or opt-in documentation are protecting both your compliance and your conversion rate. Leads with strong, verifiable opt-ins consistently outperform leads with questionable sourcing."),
    ],
  },
  {
    slug: "p-and-c-insurance",
    body: [
      h2("Understanding P&C Insurance"),
      block("Property and Casualty (P&C) insurance covers two broad categories: property insurance protects physical assets like homes, cars, and businesses against damage or loss, while casualty insurance covers liability — your legal responsibility when your actions or property cause harm to others. The major P&C product lines include homeowner's insurance, auto insurance, renter's insurance, commercial property, general liability, and umbrella policies. P&C is the largest segment of the insurance industry, with over $700 billion in annual premiums in the U.S."),
      h2("How It Works in Practice"),
      block("P&C agents typically earn 10-20% commission on new policies and 8-15% on renewals. Unlike life insurance or Medicare, P&C policies renew annually, creating a stable recurring revenue stream. An auto insurance policy with a $1,200 annual premium generates $144-180 in new business commission and $96-180 in annual renewal commission. The compounding effect is powerful — an agent writing 15 new auto and home policies per month builds to $50,000-80,000 in annual renewal income within 3-4 years. Multi-line agents who bundle auto, home, and umbrella see 60-70% retention rates versus 40-50% for single-line."),
      h2("Why It Matters for Aged Leads"),
      block("Aged P&C leads are among the cheapest in the industry — auto insurance leads that cost $8-20 in real-time sell for $0.50-2 as aged leads. The volume opportunity is enormous. The P&C buying cycle is driven by renewal dates — most consumers shop when their current policy is up for renewal, which happens every 6 or 12 months. An aged lead from someone who was shopping auto insurance 90 days ago may be approaching their next renewal window or still shopping for a better rate. The perpetual nature of P&C demand makes aged leads a natural fit — the prospect always needs insurance, and rates change constantly. An agent who builds a calling system around aged P&C leads at high volume can set 5-10 quotes per day and close 2-4, building a massive book of business at minimal lead cost."),
    ],
  },
  {
    slug: "persistency-rate",
    body: [
      h2("Understanding Persistency Rate"),
      block("Persistency rate measures the percentage of policies or accounts that remain active and in-force over a specific period, typically 13 months for the insurance industry. If you write 100 policies and 82 are still active after 13 months, your persistency rate is 82%. Carriers track persistency closely because it affects their profitability, and they often set minimum persistency requirements for agents — typically 80-85%. Falling below these thresholds can result in reduced commission levels, loss of bonus tiers, or contract termination."),
      h2("How It Works in Practice"),
      block("Persistency is affected by multiple factors: the quality of the initial sale, the appropriateness of the product for the client's needs, affordability of the premium, the agent's post-sale relationship, and external factors like job loss or health changes. Industry benchmarks: final expense 13-month persistency averages 75-80%, with top agents achieving 85-90%. Medicare Advantage persistency (measured as the percentage not disenrolling during OEP) runs 85-90%. Term life persistency is 85-92%. Auto insurance retention rates are 80-88%."),
      block("The financial impact of poor persistency is severe. Each lapsed policy triggers a chargeback (in the advance period), eliminates future renewal income, and removes a potential cross-sell and referral source. A 10% improvement in persistency — from 75% to 85% — can increase an agent's income by 30-40% over five years through preserved renewals and avoided chargebacks."),
      h2("Why It Matters for Aged Leads"),
      block("The common misconception is that aged lead customers have lower persistency than real-time lead customers. The data does not consistently support this. Persistency is primarily determined by the quality of the sale, not the origin of the lead. An agent who conducts a thorough needs analysis, ensures the premium is affordable, and follows up after the sale will maintain strong persistency regardless of whether the lead was real-time or aged. In fact, aged lead customers who went through a longer, more deliberate decision process sometimes persist at higher rates than impulse buyers from real-time leads. The key is selling the right product to the right person at the right price — not rushing to close before the lead 'goes cold.'"),
    ],
  },
  {
    slug: "personal-injury-lead",
    body: [
      h2("Understanding Personal Injury Leads"),
      block("A personal injury lead is a prospect who has been injured due to someone else's negligence and may have a legal claim for compensation. Personal injury encompasses a broad range of cases: motor vehicle accidents, slip-and-fall incidents, medical malpractice, product liability, workplace injuries, dog bites, and wrongful death. These leads are generated when injured individuals search for legal help online, respond to TV or radio advertising, or fill out intake forms on legal referral websites."),
      h2("How It Works in Practice"),
      block("Personal injury is the highest-value lead vertical in the legal industry. Average case values range from $15,000 for minor auto accidents to millions for catastrophic injuries or wrongful death. Attorney contingency fees of 33-40% make the economics aggressive: a $50,000 settlement generates $16,500-20,000 in fees. This revenue potential supports real-time lead costs of $100-200+ per lead. Aged personal injury leads sell for $10-30 depending on case type and age."),
      block("The intake and qualification process for personal injury leads involves several critical questions: What type of accident or injury occurred? When did it happen (statute of limitations check)? Have you sought medical treatment? Was another party at fault? Have you already retained an attorney? Is there insurance coverage (auto insurance, homeowner's, commercial)? Each answer helps determine case viability and potential value."),
      h2("Why It Matters for Aged Leads"),
      block("Personal injury aged leads are uniquely valuable because of the long statute of limitations — 2-4 years in most states. A lead from 90-180 days ago is a fraction of the way through the actionable window. Many injury victims do not immediately seek legal help — they focus on medical treatment first and only later realize they need an attorney to deal with insurance companies. Aged leads catch these prospects during the transition from medical recovery to legal action. At $10-30 per aged lead versus $100-200+ in real-time, legal intake centers and attorneys can build massive screening pipelines. The conversion rate is lower, but the math works: 200 aged leads at $20 each ($4,000) yielding 5-8 signed cases worth $15,000+ each in fees."),
    ],
  },
  {
    slug: "power-purchase-agreement-ppa",
    body: [
      h2("Understanding Power Purchase Agreements"),
      block("A Power Purchase Agreement (PPA) is a solar financing arrangement where a third-party company installs, owns, and maintains a solar panel system on a homeowner's roof at no upfront cost. The homeowner agrees to purchase the electricity generated by the panels at a predetermined rate, typically 10-30% below their current utility rate. The PPA provider owns the system for the duration of the agreement — usually 20-25 years — and is responsible for all maintenance, monitoring, and repairs."),
      h2("How It Works in Practice"),
      block("Here is a typical PPA scenario. A homeowner currently pays $200/month for electricity. A solar company installs a system on their roof at zero cost. The PPA rate is set at $0.12/kWh versus the utility rate of $0.16/kWh — a 25% savings. The homeowner's new solar electricity bill is approximately $150/month, saving $50/month or $600/year. Over 25 years, the homeowner saves $15,000+ while the PPA provider earns a steady return on their investment. Some PPAs include annual rate escalators of 1-3%, so the savings may decrease over time if utility rates do not increase proportionally."),
      block("PPAs are most common in states with high electricity rates and strong solar irradiance: California, Arizona, New Jersey, Massachusetts, and Connecticut. They are particularly attractive to homeowners who want solar savings but cannot or prefer not to pay $20,000-40,000 upfront for a system purchase."),
      h2("Why It Matters for Aged Leads"),
      block("Aged solar leads from homeowners who explored PPAs are strong prospects because the zero-cost entry point removes the biggest objection to solar — upfront price. These prospects were already interested in reducing their electricity costs without a large investment. The reason they did not convert from the first inquiry is often information overload, not lack of interest. Multiple solar companies bombarding them with quotes and high-pressure sales tactics drove them to pause. Reaching them 60-90 days later with a calm, educational approach — explaining exactly how the PPA works, what the savings are, and what the commitment involves — gives them the clarity they need to make a decision. Aged solar leads at $2-5 each are a fraction of the $25-50 real-time cost, and the PPA conversation is simpler than loan or purchase conversations because there is no credit qualification or down payment to discuss."),
    ],
  },
  {
    slug: "purchase-lead",
    body: [
      h2("Understanding Purchase Leads"),
      block("A purchase lead in the mortgage industry is a prospect who is looking to buy a home, as opposed to refinancing an existing mortgage. Purchase leads are generated when consumers fill out pre-qualification forms, search for mortgage rates on home purchases, inquire through real estate websites, or respond to advertising from lenders. These leads include information like desired purchase price, down payment amount, credit score range, property location, and timeline to purchase."),
      h2("How It Works in Practice"),
      block("Purchase leads are typically more valuable than refinance leads because the transaction is time-bound — the borrower is actively looking to buy a home and needs financing to complete the purchase. Real-time purchase leads cost $30-75 each, reflecting the high competition among loan officers for active buyers. The sales cycle for purchase leads varies from days to months depending on where the buyer is in their home search. Early-stage buyers may be 3-6 months from making an offer, while buyers under contract need to close in 30-45 days."),
      block("The loan officer's role with purchase leads is to qualify the borrower (income, credit, debt-to-income ratio, down payment), issue a pre-approval letter, and then be ready when they find a property and go under contract. Building a relationship during the search phase is critical because buyers often work with whatever lender is responsive and helpful when they finally need to move fast on an offer."),
      h2("Why It Matters for Aged Leads"),
      block("Aged purchase leads are exceptionally well-suited to the aged lead model because home buying is a lengthy process. The average home buyer searches for 3-6 months before making an offer. A lead from someone who started their home search 60-90 days ago is likely still actively looking — they may even be closer to buying now than when they first inquired. Aged purchase leads at $3-8 each give loan officers a cost-effective way to fill their pipeline with active buyers. The key outreach question is: 'Are you still looking for a home?' If yes, offer a pre-approval or rate update. If they already found a home, ask about their financing — they may be unhappy with their current lender and open to switching before closing."),
    ],
  },
  {
    slug: "roi-return-on-investment",
    body: [
      h2("Understanding ROI"),
      block("Return on Investment (ROI) measures the profitability of an expenditure by comparing the gain from an investment to its cost. The formula is: (Revenue - Cost) / Cost x 100. If you spend $500 on aged leads and generate $4,000 in commissions, your ROI is 700% — meaning you earned $7 for every $1 invested. ROI is the ultimate scorecard for your lead strategy because it accounts for both the cost inputs and revenue outputs in a single number."),
      h2("How It Works in Practice"),
      block("Here is a real-world ROI comparison between lead strategies. Aged lead campaign: 500 leads at $2 each ($1,000), 10 sales at $800 average commission ($8,000). ROI: 700%. Real-time lead campaign: 40 leads at $30 each ($1,200), 6 sales at $800 average commission ($4,800). ROI: 300%. Both campaigns are profitable, but the aged lead campaign delivers more than double the ROI. Even if you account for additional time spent on aged leads (more dials needed per contact), the economic advantage is substantial."),
      block("ROI should be calculated monthly, by lead type, and by vendor. A positive ROI does not mean you should stop optimizing. If your ROI on 30-day aged leads is 500% but your ROI on 90-day aged leads is 800% because of the lower cost, shifting budget toward 90-day leads improves your overall return. Track the full picture: lead cost, dialer cost, CRM cost, time invested, and total revenue generated including renewals and cross-sells."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads consistently produce the highest ROI of any lead type in the industry. The reason is simple arithmetic: when your cost input is 80-95% lower than real-time leads, you do not need anywhere near the same conversion rate to achieve superior returns. An agent who understands this math stops worrying about conversion rate as an isolated metric and starts managing ROI as the primary business metric. The shift from 'How many of these convert?' to 'How much do I earn per dollar spent?' is the mindset change that separates profitable aged lead operations from agents who try it for a month and quit."),
    ],
  },
  {
    slug: "rate-lock",
    body: [
      h2("Understanding Rate Lock"),
      block("A rate lock is a commitment from a mortgage lender to hold a specific interest rate for a borrower for a defined period, typically 30-60 days, while the loan is processed and closed. Once a rate is locked, the borrower is protected from market rate increases during the lock period. If rates go up by 0.5% the day after locking, the borrower still gets the locked rate. Rate locks are free for standard periods (30-45 days) but may cost 0.25-0.5% of the loan amount for extended locks of 60-90+ days."),
      h2("How It Works in Practice"),
      block("Rate lock strategy is one of the most important decisions in a mortgage transaction. Lock too early and rates might drop further. Wait too long and rates might spike. On a $350,000 mortgage, a 0.25% rate difference equals $52/month or $18,720 over 30 years. Loan officers advise borrowers based on market conditions, economic indicators, and the borrower's risk tolerance. In volatile rate environments, locking quickly is generally recommended. In declining rate markets, floating (not locking) with a lock trigger point can save money."),
      block("Lock expirations create urgency in the mortgage process. If a 30-day lock expires before closing, the borrower must either extend the lock (at additional cost) or re-lock at current market rates, which may be higher. Lock management is a core loan officer skill — delays in appraisals, inspections, or underwriting can push a file past its lock expiration."),
      h2("Why It Matters for Aged Leads"),
      block("Rate lock dynamics make aged mortgage leads more interesting than most agents realize. A prospect who inquired about refinancing 90 days ago was looking at different rates. If rates have dropped since then, you have a compelling reason to call: 'Rates have improved since you last looked — you may qualify for better terms now.' If rates have increased, the prospect who did not act may have missed their window and should lock quickly before further increases. Either scenario creates a conversation opportunity. Rate environment changes are your opening line on aged mortgage leads — they give you a timely, relevant reason to reach out that feels like a service, not a sales call."),
    ],
  },
  {
    slug: "refinance-lead",
    body: [
      h2("Understanding Refinance Leads"),
      block("A refinance lead is a homeowner who has expressed interest in replacing their current mortgage with a new one, typically to secure a lower interest rate, reduce monthly payments, shorten the loan term, switch from an adjustable to a fixed rate, or tap into home equity through a cash-out refinance. Refinance leads are generated when homeowners fill out rate comparison forms, respond to lender advertising, or search for refinancing information online."),
      h2("How It Works in Practice"),
      block("Refinance volume is heavily influenced by interest rates. When rates drop 0.5-1% below prevailing mortgage rates, refinance demand surges as homeowners rush to lock in savings. A homeowner with a $400,000 mortgage at 7% who refinances to 6% saves $267/month or $3,200/year. The break-even on closing costs ($5,000-10,000) is typically 18-36 months. Loan officers earn 0.5-2% origination on refinances, making a $400,000 refinance worth $2,000-8,000 in compensation."),
      block("The refinance lead qualification process involves checking current rate versus available rates, estimating equity (for LTV requirements), reviewing credit, and calculating the break-even period. The strongest refinance prospects have significant rate reduction potential (0.75%+ improvement), strong credit scores (740+), sufficient equity (less than 80% LTV), and plan to stay in the home long enough to recoup closing costs."),
      h2("Why It Matters for Aged Leads"),
      block("Aged refinance leads are uniquely well-suited to the aged lead model because the refinance decision is rarely urgent. Homeowners shop for rates, compare lenders, and often procrastinate for weeks or months. A refinance lead from 60-90 days ago is frequently still in the consideration phase. Rate changes since their original inquiry give you a natural reason to re-engage: 'I see you were looking at refinance rates a few months ago. Rates have moved since then, and I wanted to give you an updated picture.' Aged refinance leads at $2-5 each allow loan officers to build large prospect databases and drip on them over time. Many LOs report that their best refinance production comes from leads they contacted 3-5 times over 60-90 days — exactly the cadence that aged leads enable at a fraction of real-time lead cost."),
    ],
  },
  {
    slug: "reverse-mortgage",
    body: [
      h2("Understanding Reverse Mortgages"),
      block("A reverse mortgage is a loan product for homeowners aged 62 and older that allows them to convert home equity into cash without selling their home or making monthly mortgage payments. The most common type is the Home Equity Conversion Mortgage (HECM), insured by the FHA. Instead of the borrower paying the lender each month, the lender pays the borrower — through a lump sum, monthly payments, a line of credit, or a combination. The loan balance grows over time and is repaid when the homeowner sells, moves out, or passes away."),
      h2("How It Works in Practice"),
      block("Reverse mortgage eligibility requires: age 62+, sufficient home equity (typically 50%+ equity), the property is the primary residence, and the borrower must complete HUD-approved counseling before closing. Available proceeds depend on the borrower's age (older = more), current interest rates (lower = more), and home value (capped at $1,149,825 for 2024 HECMs). A 72-year-old with a $400,000 home and no existing mortgage might access $200,000-240,000 through a reverse mortgage."),
      block("Originator compensation on reverse mortgages is substantial — typically $5,000-15,000 per loan depending on the loan amount and fee structure. The sales cycle is longer than traditional mortgages (45-90 days) because of the mandatory counseling requirement and the deliberative nature of the decision. Prospects are often researching for months before committing."),
      h2("Why It Matters for Aged Leads"),
      block("Reverse mortgage leads are one of the best aged lead verticals because the decision cycle is inherently long. Seniors considering a reverse mortgage are making a major financial decision that affects their home, their estate, and their retirement. They research extensively, discuss with family members, and often take weeks or months to decide. A prospect who requested reverse mortgage information 90 days ago is typically still in the decision process. Aged reverse mortgage leads at $3-8 each reach these prospects during their extended consideration window, when they are educated, motivated, and ready for a thoughtful conversation with a knowledgeable loan officer. The key is patience and education — reverse mortgage prospects respond to consultative expertise, not high-pressure sales tactics."),
    ],
  },
  {
    slug: "seo",
    body: [
      h2("Understanding SEO"),
      block("Search Engine Optimization (SEO) is the practice of improving a website's visibility in organic (unpaid) search engine results. When someone searches 'best life insurance for seniors' or 'how to refinance my mortgage,' the websites that appear on page one earned those positions through SEO — a combination of relevant content, technical site optimization, backlinks from other websites, and user experience signals. SEO drives the highest-intent web traffic because the user is actively searching for information or solutions, making SEO-generated leads among the most valuable in any industry."),
      h2("How It Works in Practice"),
      block("For lead generation companies, SEO is the foundation of lead quality. Organic search leads convert 2-3x better than paid advertising leads because the prospect initiated the search, read the content, and chose to submit their information. The cost per lead from SEO is typically lower than paid channels once the content and technical investment is established — a well-ranking article can generate leads for years without ongoing ad spend. The trade-off is time: SEO results take 3-12 months to materialize, while paid advertising delivers leads immediately."),
      block("For agents buying leads, understanding SEO matters because it tells you about lead quality. Leads generated from SEO-driven content (someone searched, found an article, and filled out a form) are fundamentally different from leads generated through paid social media ads (someone was scrolling Facebook and clicked an ad). The intent level is higher, the information is usually more complete, and the prospect remembers submitting the form."),
      h2("Why It Matters for Aged Leads"),
      block("When evaluating aged lead vendors, ask about their lead sourcing. Vendors who generate leads through SEO-driven websites tend to provide higher-quality aged leads than vendors who rely primarily on paid social or display advertising. The reason is simple: SEO leads had active intent at the time of submission. That intent-based origin makes the aged lead more responsive to follow-up because the prospect genuinely wanted information, not just a free download or a chance to win a gift card. For agents building their own brand, investing in SEO — even a simple website with helpful content about your specialty — generates inbound leads that cost nothing per lead and convert at rates that dwarf any purchased lead source."),
    ],
  },
  {
    slug: "sga-substantial-gainful-activity",
    body: [
      h2("Understanding SGA"),
      block("Substantial Gainful Activity (SGA) is a threshold set by the Social Security Administration that determines whether a person's work activity is significant enough to disqualify them from receiving Social Security Disability Insurance (SSDI) benefits. For 2026, the SGA limit is approximately $1,550/month for non-blind individuals and $2,590/month for blind individuals. If a disability claimant earns above the SGA threshold, the SSA considers them capable of substantial work and their claim will likely be denied."),
      h2("How It Works in Practice"),
      block("SGA is one of the first things the SSA evaluates in a disability claim — it is Step 1 of the 5-step sequential evaluation process. If the claimant is currently working above SGA, the claim stops at Step 1 without evaluating the medical condition. For SSDI lead generation and intake, the SGA question is a critical qualifier. An intake specialist needs to determine: Is the prospect currently working? If so, how much are they earning? Are their earnings below SGA? Have they reduced their hours or income due to disability? The SGA threshold applies to gross earnings and includes some self-employment income."),
      block("SGA also matters for beneficiaries who want to attempt returning to work. The Trial Work Period allows SSDI recipients to test their ability to work for up to 9 months without losing benefits, regardless of earnings. After the trial period, the Extended Period of Eligibility provides an additional 36 months where benefits continue for any month earnings fall below SGA."),
      h2("Why It Matters for Aged Leads"),
      block("For SSDI aged leads, SGA is your first qualification question. Many SSDI prospects are in a gray area — they may be working part-time, earning sporadic income, or unsure whether their earnings disqualify them. Aged SSDI leads from 60-90 days ago may have experienced changes in their work situation: they may have stopped working due to worsening disability, reduced their hours below SGA, or exhausted their savings and now need to file. A simple question — 'Are you currently working, and if so, approximately how much are you earning per month?' — immediately tells you whether the prospect clears the SGA threshold. Prospects below SGA are viable claims; prospects above SGA need to reduce work activity before filing."),
    ],
  },
  {
    slug: "ssdi",
    body: [
      h2("Understanding SSDI"),
      block("Social Security Disability Insurance (SSDI) is a federal insurance program that provides monthly income to individuals who cannot work due to a qualifying medical condition expected to last at least 12 months or result in death. SSDI benefits are based on the claimant's work history and earnings — they must have paid into Social Security through payroll taxes and earned enough work credits (typically 20 credits in the last 10 years). Monthly SSDI benefits average $1,500-1,800 and can reach $3,800+ depending on the claimant's earnings history."),
      h2("How It Works in Practice"),
      block("The SSDI application process is notoriously difficult. Initial applications are denied approximately 65-70% of the time. Many claimants need professional help — disability attorneys or advocates who guide them through the process, gather medical evidence, and represent them at hearings. Attorneys typically work on contingency, earning 25% of back-pay benefits up to a maximum of $7,200. The entire process from initial application to final hearing can take 12-36 months, creating a long sales cycle for legal intake centers."),
      block("SSDI lead generation targets people who have disabling conditions and are unable to work. Common qualifying conditions include back injuries, heart disease, depression, anxiety disorders, autoimmune diseases, and chronic pain. Lead forms ask about the type of disability, current work status, medical treatment history, and whether they have already filed a claim."),
      h2("Why It Matters for Aged Leads"),
      block("SSDI is one of the strongest aged lead verticals because the need is chronic and the decision timeline is long. A person who inquired about disability benefits 90 days ago is almost certainly still disabled and still in need of help. The condition did not improve — most SSDI-qualifying conditions are progressive or permanent. Aged SSDI leads at $2-5 each reach claimants who may have been overwhelmed by the process, filed and been denied, or procrastinated on applying. Your outreach catches them at a moment when their financial situation has likely worsened, making them more motivated to act. The qualification process is straightforward: Are you currently unable to work due to a medical condition? Have you already filed? Have you retained an attorney? A 'no' to the last two questions means the lead is viable regardless of its age."),
    ],
  },
  {
    slug: "scope-of-appointment-soa",
    body: [
      h2("Understanding Scope of Appointment"),
      block("A Scope of Appointment (SOA) is a CMS-required document that a Medicare beneficiary must sign before an agent can discuss or present specific Medicare product types. The SOA identifies which product categories the beneficiary has agreed to discuss — Medicare Advantage, Medicare Supplement, Part D prescription drug plans, dental/vision/hearing, or other ancillary products. The agent cannot discuss products outside the agreed scope, and the SOA must be obtained at least 48 hours before an in-person appointment (phone and online appointments can be documented immediately)."),
      h2("How It Works in Practice"),
      block("The SOA process works as follows: the agent contacts a prospect, confirms interest in discussing Medicare options, identifies which product types the beneficiary wants to review, sends or presents the SOA form for signature, waits 48 hours for in-person meetings, and then conducts the appointment only discussing the products listed on the SOA. If during the appointment the beneficiary asks about a product type not on the SOA, the agent must obtain a new SOA before discussing it. SOA records must be retained for 10 years."),
      block("CMS enforces SOA compliance through audits, mystery shopping, and complaint investigations. Agents who conduct presentations without proper SOA documentation risk compliance actions from the carrier and CMS, including suspension of enrollment ability. Carriers have automated SOA tools and portals that simplify the documentation process."),
      h2("Why It Matters for Aged Leads"),
      block("When working aged Medicare leads, the SOA is your procedural checkpoint that also serves as a quality filter. Requesting an SOA over the phone or via email before your presentation accomplishes two things: it satisfies CMS compliance requirements, and it confirms that the prospect is genuinely interested in discussing Medicare options. A prospect who willingly signs an SOA is engaged and committed to the conversation. One who refuses is saving you time that would have been wasted on an uninterested party. Build SOA collection into your aged lead workflow immediately after making contact and confirming interest. Electronic SOA tools make this seamless — send a link via text or email, the prospect signs digitally, and you have compliant documentation before the appointment."),
    ],
  },
  {
    slug: "solar-itc",
    body: [
      h2("Understanding the Solar ITC"),
      block("The Solar Investment Tax Credit (ITC) is a federal tax credit that allows homeowners and businesses to deduct a percentage of the cost of a solar energy system from their federal income taxes. As of 2026, the residential solar ITC is 30% for systems installed through 2032, stepping down to 26% in 2033 and 22% in 2034. On a $30,000 solar installation, the 30% ITC provides a $9,000 tax credit — a dollar-for-dollar reduction in federal taxes owed, not just a deduction from taxable income."),
      h2("How It Works in Practice"),
      block("The ITC is the centerpiece of the solar sales pitch. Without it, the payback period on a residential solar system might be 12-15 years. With the 30% ITC, the effective cost drops and the payback period shortens to 6-9 years in most markets. The credit is claimed on the homeowner's federal tax return for the year the system is placed in service. If the full credit exceeds the homeowner's tax liability, the excess can be carried forward to future tax years. For the credit to apply, the homeowner must own the system — leased systems and PPAs do not qualify the homeowner for the ITC (the system owner claims the credit)."),
      block("A key sales qualification question is whether the prospect has sufficient federal tax liability to use the credit. A homeowner who pays $5,000/year in federal income taxes can fully utilize a $5,000 credit in year one. A homeowner with a $9,000 credit and only $4,000 in annual tax liability will need to carry forward the remaining $5,000, which affects cash flow projections."),
      h2("Why It Matters for Aged Leads"),
      block("The solar ITC creates a built-in urgency that makes aged solar leads valuable: the credit is scheduled to step down in 2033, giving prospects a financial incentive to act within a known timeframe. An aged solar lead from 90 days ago is now 90 days closer to potential step-downs and is still eligible for the full 30% credit. Your follow-up message writes itself: 'You were looking into solar a few months ago — the 30% federal tax credit is still available, but the clock is ticking on these incentive levels.' Pairing the ITC with current utility rate data and updated equipment pricing gives aged solar leads a fresh, timely reason to re-engage with the buying process."),
    ],
  },
  {
    slug: "special-enrollment-period-sep",
    body: [
      h2("Understanding Special Enrollment Periods"),
      block("A Special Enrollment Period (SEP) is a window outside of the Annual Enrollment Period (AEP) and Open Enrollment Period (OEP) during which Medicare beneficiaries can make changes to their coverage based on specific qualifying life events. SEPs are triggered by events like moving to a new area where your current plan is not available, losing employer-sponsored coverage, gaining Medicaid eligibility, being released from incarceration, experiencing a natural disaster, or qualifying for Extra Help (Low Income Subsidy). Each SEP has its own duration and allowable changes."),
      h2("How It Works in Practice"),
      block("SEPs create year-round enrollment opportunities for Medicare agents. While AEP and OEP dominate the enrollment calendar, SEPs generate consistent business throughout the year. The most common SEPs are the Dual Eligible/LIS SEP (available quarterly for beneficiaries with Medicaid or Extra Help), the ICEP (Initial Coverage Election Period for new Medicare enrollees), and the move-based SEP (allowing plan changes when moving to a new service area). Each SEP allows 60-90 days for the beneficiary to make changes."),
      block("For agents, identifying SEP-eligible prospects requires asking the right questions: 'Have you recently moved?' 'Have you lost your employer coverage?' 'Do you qualify for Medicaid or Extra Help?' 'Did you recently turn 65 and enroll in Medicare?' These questions surface enrollment opportunities that most agents miss because they focus exclusively on AEP."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medicare leads become year-round inventory when you understand SEPs. A lead from AEP that you did not reach can become a SEP prospect if the beneficiary has experienced a qualifying event since their original inquiry. A lead from someone turning 65 two months ago is in the middle of their ICEP — a golden enrollment window. Dual-eligible beneficiaries have quarterly SEPs, meaning they can make changes throughout the year. When calling aged Medicare leads outside of AEP and OEP, your qualification question shifts from 'Do you want to compare plans?' to 'Has anything changed in your life recently that might affect your Medicare coverage?' This question opens the door to SEP-eligible enrollments that competitors are not even looking for."),
    ],
  },
  {
    slug: "statute-of-limitations",
    body: [
      h2("Understanding Statute of Limitations"),
      block("The statute of limitations is the legally defined time period within which a person must file a lawsuit or legal claim. Once the statute expires, the right to sue is lost regardless of the merits of the case. Statutes vary by state and by claim type. Personal injury: 1-6 years (2-3 years in most states). Medical malpractice: 1-3 years. Product liability: 2-4 years. Workers' compensation: 1-3 years. Contract disputes: 3-10 years. Understanding these deadlines is essential for anyone generating, selling, or working legal leads."),
      h2("How It Works in Practice"),
      block("The statute of limitations clock typically starts on the date of injury or the date the injury was discovered (the 'discovery rule'). For an MVA case in a state with a 2-year statute, a prospect injured on March 15, 2024 must file suit by March 15, 2026. Some states toll (pause) the statute for minors, incapacitated individuals, or when the defendant leaves the state. Legal lead intake must always verify the incident date and cross-reference it against the applicable state statute."),
      block("As the statute expiration approaches, urgency increases dramatically. An attorney who signs a client 6 months before expiration has time for thorough case preparation. An attorney who signs a client 30 days before expiration faces a frantic rush to file, which can result in errors and weaker case positioning. This urgency dynamic affects lead value — leads with approaching statute deadlines are paradoxically both urgent and undervalued by the market."),
      h2("Why It Matters for Aged Leads"),
      block("The statute of limitations is what makes aged legal leads viable for months or years, not just days. A personal injury lead from 6 months ago in a 3-year statute state still has 2.5 years of actionable time remaining. An SSDI lead has no statute of limitations for the initial application. A workers' compensation lead may have 1-2 years remaining. When you buy aged legal leads, always check the incident date against the applicable statute — this tells you whether the lead is still actionable and how much urgency to apply in your outreach. Leads approaching their statute deadline are highly motivated prospects: they are running out of time and they know it. Frame your outreach accordingly: 'I wanted to make sure you are aware that there are time limits for pursuing your case.'"),
    ],
  },
  {
    slug: "t65-lead",
    body: [
      h2("Understanding T65 Leads"),
      block("A T65 lead is a prospect who is turning 65 years old and becoming eligible for Medicare. The 'T' stands for 'turning.' T65 leads are among the most valuable in the Medicare industry because these prospects must make critical healthcare coverage decisions — they are enrolling in Medicare for the first time and need to choose between Original Medicare with a Medigap supplement or a Medicare Advantage plan. Every American turning 65 needs Medicare guidance, creating predictable, year-round demand."),
      h2("How It Works in Practice"),
      block("Approximately 11,000 Americans turn 65 every day — roughly 4 million per year. Each one enters their Initial Enrollment Period (IEP), which begins 3 months before their 65th birthday month and extends 3 months after. During this 7-month window, they can enroll in Medicare Parts A and B and make their initial coverage choices. T65 prospects are also in their Medigap Open Enrollment Period, which begins when they enroll in Part B — the only guaranteed-issue window for Medigap policies."),
      block("Real-time T65 leads command premium pricing — $25-50+ each — because of the high lifetime value of a Medicare client. An agent who enrolls a T65 client in Medicare Advantage earns $600+ in first-year commission plus $300+ annually in renewals for as long as the client stays enrolled. A Medigap enrollment generates ongoing renewal commissions and cross-sell opportunities for Part D, dental, vision, and hospital indemnity plans."),
      h2("Why It Matters for Aged Leads"),
      block("Aged T65 leads are strategically valuable because the enrollment window is 7 months long. A T65 lead from 60-90 days ago is likely still within their Initial Enrollment Period — they are mid-decision, not post-decision. Many T65 prospects are overwhelmed by the volume of mailers, calls, and advertisements that hit them as their 65th birthday approaches. By the time they receive an aged lead follow-up, the noise has subsided and they are ready for a calm, informative conversation. At $2-5 per aged T65 lead versus $25-50+ in real-time, you can build a substantial T65 pipeline year-round. The key is verifying their birthday and Part B effective date to confirm they are still in an enrollment window."),
    ],
  },
  {
    slug: "term-life-insurance",
    body: [
      h2("Understanding Term Life Insurance"),
      block("Term life insurance provides a death benefit for a specified period — the 'term' — typically 10, 15, 20, or 30 years. If the insured person dies during the term, the beneficiary receives the face amount (death benefit). If the insured survives the term, the policy expires with no payout and no cash value. Term life is the simplest, most affordable type of life insurance, making it the most commonly purchased form of life insurance in America. A healthy 35-year-old can get a $500,000 20-year term policy for $25-40 per month."),
      h2("How It Works in Practice"),
      block("Term life insurance is a needs-based sale driven by income replacement, debt coverage, and family protection. The typical buyer is 25-55 years old with dependents, a mortgage, or other financial obligations that would burden their family if they died. The agent's job is to identify the coverage gap — the difference between what the family would need and what existing coverage provides. Common rules of thumb suggest 10-15x annual income for coverage amount, though a proper needs analysis accounts for specific debts, future education costs, and surviving spouse income."),
      block("Agent commissions on term life vary by carrier and policy size. First-year commissions typically run 50-100% of the annual premium. A $500,000 20-year term policy with a $500 annual premium generates $250-500 in first-year commission. Renewal commissions are modest — 2-5% of annual premium in years 2-10. The real value in term life sales is volume and conversion to permanent insurance at the term's end."),
      h2("Why It Matters for Aged Leads"),
      block("Aged term life leads are undervalued by many agents who chase final expense and IUL commissions. But term life leads represent younger, healthier prospects with growing families and active financial lives. These are not one-sale clients — they are the foundation of a long-term client relationship. The term life sale opens the door to auto insurance, homeowner's insurance, disability income, and eventually permanent life insurance conversion. Aged term life leads at $1-3 each provide a high-volume pipeline of younger prospects who need coverage and respond well to educational outreach. The key is moving beyond price-only conversations and positioning yourself as their ongoing insurance advisor, not just a quote provider."),
    ],
  },
  {
    slug: "utm-parameters",
    body: [
      h2("Understanding UTM Parameters"),
      block("UTM (Urchin Tracking Module) parameters are tags added to a URL that allow you to track the source, medium, campaign, content, and term that drove a visitor to your website. When someone clicks a link with UTM parameters, those tags are captured by Google Analytics (or other analytics platforms), letting you see exactly which marketing efforts generated each visit, lead, or sale. The five standard UTM parameters are: utm_source (where the traffic came from), utm_medium (the marketing channel), utm_campaign (the specific campaign name), utm_content (which ad or link variant), and utm_term (the keyword, for paid search)."),
      h2("How It Works in Practice"),
      block("A properly tagged URL looks like this: yoursite.com/quote?utm_source=facebook&utm_medium=paid_social&utm_campaign=final_expense_jan&utm_content=testimonial_ad. When a prospect clicks this link and fills out a form, you know they came from Facebook, through a paid social campaign for final expense in January, clicking on the testimonial ad variant. Without UTM parameters, you would only know someone visited your site — not which of your 20 marketing initiatives actually drove the visit."),
      block("UTM data powers critical business decisions. If your Facebook final expense campaign generates leads at $12 each but your Google search campaign generates leads at $8 each, you know where to shift budget. If your testimonial ad variant converts at 4% but your comparison ad converts at 2%, you know which creative to scale. Without UTM tracking, you are making these decisions based on guesswork instead of data."),
      h2("Why It Matters for Aged Leads"),
      block("If you generate your own leads through a website, social media, or advertising, UTM parameters are essential for understanding which channels produce the best prospects — not just the most clicks. Track your UTMs all the way through to closed deals and you will discover that some traffic sources produce leads that close at 2x the rate of others. This data also matters if you become a lead seller — aged lead buyers want to know the origin of leads, and UTM data provides transparent sourcing documentation. For agents buying aged leads, ask your vendor whether they can provide lead source data that maps back to UTM-level detail. Vendors who track this data can offer filtered lead products — 'organic search leads only' or 'Facebook leads from specific campaigns' — giving you more control over lead quality."),
    ],
  },
  {
    slug: "underwriting",
    body: [
      h2("Understanding Underwriting"),
      block("Underwriting is the process by which an insurance company or lender evaluates the risk of insuring a person or approving a loan. The underwriter reviews the applicant's information — health history, financial status, credit, property details, driving record — and determines whether to approve the application, what terms to offer, and what price to charge. Underwriting is the gatekeeper between your sales effort and the actual policy or loan issuance. No matter how good your sales process is, the application must pass underwriting."),
      h2("How It Works in Practice"),
      block("Underwriting processes differ by product. Life insurance underwriting can range from simplified issue (just health questions, no exam) to full medical underwriting (blood work, physical exam, medical records review) depending on the policy type and face amount. Mortgage underwriting evaluates income, assets, credit history, employment stability, debt-to-income ratio, and property appraisal. Auto insurance underwriting considers driving record, vehicle type, location, and credit score. The underwriting timeline ranges from instant (automated decision engines) to 4-8 weeks (complex life insurance cases requiring medical records)."),
      block("Pre-qualification before formal application submission is the best way to avoid underwriting surprises. In insurance, asking the right health questions before submitting avoids declines. In mortgage, running automated underwriting systems (DU or LP) before taking a full application identifies potential issues early. The best salespeople are skilled pre-underwriters — they know the guidelines and filter out unqualifiable prospects before investing time in a full application."),
      h2("Why It Matters for Aged Leads"),
      block("When working aged leads, underwriting awareness is your time-saving superpower. Every aged lead conversation should include qualification questions that mirror what the underwriter will evaluate. For insurance: 'In the last two years, have you been hospitalized or diagnosed with any new conditions?' For mortgage: 'Has your employment or income changed since you first inquired?' These questions take 2-3 minutes and prevent you from spending 45 minutes on a presentation and application for a prospect who will be declined. With aged leads, where volume is the strategy, efficiency per lead determines your hourly income. Pre-qualifying against underwriting guidelines ensures your time is spent on closeable prospects."),
    ],
  },
  {
    slug: "voicemail-drop",
    body: [
      h2("Understanding Voicemail Drop"),
      block("Voicemail drop (also called ringless voicemail or pre-recorded voicemail) is a technology that delivers a pre-recorded audio message directly to a prospect's voicemail box without the phone ringing. The prospect sees a missed voicemail notification and listens at their convenience. This differs from traditional voicemail, which requires calling, waiting for the phone to ring, and leaving a message after the beep. Voicemail drop technology allows agents to deliver hundreds of messages per hour, dramatically increasing touchpoints without proportional time investment."),
      h2("How It Works in Practice"),
      block("A voicemail drop campaign works like this: the agent records a 30-45 second message, uploads it to a voicemail drop platform, loads their aged lead list, and initiates the campaign. The system delivers the pre-recorded message to each prospect's voicemail. The prospect sees a voicemail notification, listens, and if interested, calls back. Callback rates from voicemail drops typically run 2-5% — modest per message but powerful at scale. Dropping 500 voicemails generates 10-25 callbacks, and these are inbound calls from interested prospects, which close at higher rates than outbound dials."),
      block("Best practices for voicemail drop messages: keep it under 40 seconds, sound natural (not scripted), reference their inquiry, include a clear callback number, and create mild urgency without being pushy. Example: 'Hi, this is [name]. I am following up on the life insurance information you requested a while back. I have some options that might work for you. Give me a call back at [number] when you have a minute.'"),
      h2("Why It Matters for Aged Leads"),
      block("Voicemail drop is one of the most efficient tools in the aged lead arsenal. When you have 500 aged leads to contact, individually calling each one and leaving a personal voicemail takes 50+ hours. A voicemail drop campaign reaches all 500 in minutes. Use it as the first touch in a multi-channel sequence: drop a voicemail on day one, follow up with a live call on day two, send an email or text on day three. The voicemail drop primes the prospect — when you call the next day, they have already heard your name and know why you are calling. Note: voicemail drop compliance varies by state and interpretation of TCPA. Consult with a compliance attorney and ensure your lead data includes proper opt-in consent before using this technology."),
    ],
  },
  {
    slug: "yellow-letter",
    body: [
      h2("Understanding Yellow Letters"),
      block("A yellow letter is a handwritten-style direct mail piece on a yellow legal pad background, designed to look like a personal note rather than a mass-produced marketing piece. The letter uses a handwriting font, blue ink simulation, and conversational language to create the impression that a real person sat down and wrote a personal letter to the prospect. Yellow letters achieve significantly higher open rates than standard direct mail because they stand out in a mailbox full of white envelopes and printed postcards."),
      h2("How It Works in Practice"),
      block("Yellow letter campaigns for aged leads follow a proven format. The letter opens with a personal reference to the prospect's original inquiry: 'Hi [Name], I understand you were looking into life insurance options a while back.' The body acknowledges the time gap and offers help: 'I know things get busy, and I wanted to reach out personally to see if you ever found what you were looking for. If not, I would love to help.' The close includes a phone number and a simple call to action: 'Give me a call at [number] or I will try to reach you in the next few days.'"),
      block("Yellow letters typically cost $1.50-3.00 each including printing and postage. Response rates run 3-8% — dramatically higher than the 0.5-2% typical of standard direct mail. For a 500-piece campaign at $2 per letter ($1,000 total), you can expect 15-40 responses. These are warm inbound calls from prospects who read your letter and chose to pick up the phone — high-quality conversations that close at 15-25%."),
      h2("Why It Matters for Aged Leads"),
      block("Yellow letters solve the biggest challenge with aged leads: getting the prospect to engage. Many aged lead prospects have been called multiple times and stopped answering unknown numbers. A yellow letter bypasses call screening entirely — it arrives in their physical mailbox, gets noticed because of the handwritten appearance, and gets read because it looks personal. The combination of a yellow letter followed by a phone call 3-5 days later is one of the highest-converting aged lead strategies. The prospect has seen your name, read your message, and understands you are following up on their original request. When you call and say 'I sent you a letter a few days ago,' the connection is immediate. Yellow letters add cost per lead, but the dramatically higher contact and close rates typically produce a lower overall cost per acquisition."),
    ],
  },
];

async function run() {
  // Fetch all glossary terms with body content to check which need expansion
  console.log("Fetching existing glossary terms...\n");
  const terms = await client.fetch(
    '*[_type == "glossaryTerm"]{_id, "slug": slug.current, term, "bodyLength": length(body)}'
  );
  const slugToId = {};
  const slugToBodyLength = {};
  for (const t of terms) {
    slugToId[t.slug] = t._id;
    slugToBodyLength[t.slug] = t.bodyLength || 0;
  }

  console.log(`Found ${terms.length} glossary terms in Sanity.\n`);

  // Filter out already-expanded terms and terms with sufficient body content
  const toExpand = expansions.filter((e) => {
    if (alreadyExpanded.has(e.slug)) {
      console.log(`  — Skipping "${e.slug}" (expanded in batch 1)`);
      return false;
    }
    if (!slugToId[e.slug]) {
      console.log(`  — Skipping "${e.slug}" (not found in Sanity)`);
      return false;
    }
    if (slugToBodyLength[e.slug] >= 3) {
      console.log(`  — Skipping "${e.slug}" (already has ${slugToBodyLength[e.slug]} blocks)`);
      return false;
    }
    return true;
  });

  console.log(`\n=== Expanding ${toExpand.length} glossary terms with rich body content ===\n`);

  let success = 0;
  let failed = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < toExpand.length; i++) {
    const e = toExpand[i];
    const id = slugToId[e.slug];
    try {
      await client.patch(id).set({ body: e.body }).commit();
      console.log(`  ✓ ${e.slug} (${id})`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${e.slug} (${id}): ${err.message}`);
      failed++;
    }

    // Small delay between updates to avoid rate limiting
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < toExpand.length) {
      console.log(`  ... pausing 2s after batch of ${BATCH_SIZE} ...`);
      await sleep(2000);
    }
  }

  console.log(`\nDone! Expanded ${success} terms, ${failed} failed.`);
}

run().catch(console.error);
