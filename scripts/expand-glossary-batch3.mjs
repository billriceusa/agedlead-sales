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
function k() { return Math.random().toString(36).slice(2, 10); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const expansions = [
  {
    id: "glossary-annual-enrollment-period",
    title: "Annual Enrollment Period (AEP)",
    body: [
      h2("Understanding Annual Enrollment Period"),
      block("The Annual Enrollment Period (AEP) is the federally mandated window — October 15 through December 7 each year — during which Medicare beneficiaries can change their Medicare Advantage or Part D prescription drug plan. Beneficiaries can switch plans, return to Original Medicare, or enroll in Medicare Advantage for the first time. Any changes made during AEP take effect January 1 of the following year. Outside of AEP, most beneficiaries are locked into their current plan unless they qualify for a Special Enrollment Period."),
      block("AEP is distinct from the Medicare Open Enrollment Period (OEP), which runs January 1 through March 31 and allows only limited changes — specifically, switching from one Medicare Advantage plan to another or dropping Medicare Advantage to return to Original Medicare. AEP is the primary enrollment window and drives the majority of Medicare plan changes each year."),
      h2("How It Works in Practice"),
      block("AEP is the highest-volume period in Medicare sales. Over 65 million Americans are enrolled in Medicare, and roughly 30 percent evaluate their options during this eight-week window. Real-time Medicare leads spike to $30-50 each during peak AEP weeks. Carriers flood the market with advertising, and agents compete intensely for every prospect. Top-performing agents complete 8-15 enrollments per week during AEP by pre-loading their pipeline in September, reviewing plan changes, and completing AHIP certification early. The agents who win AEP are the ones who start outreach before October 15 — warming up their book of business and pre-scheduling reviews."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medicare leads are the single best arbitrage play during AEP. While competitors pay $35-50 for real-time leads during AEP, you can purchase aged Medicare leads — from the prior AEP or from off-season inquiries — at $1-3 each. These prospects actively researched Medicare coverage. Many were overwhelmed by the flood of calls during their original inquiry and never made a decision. Contacting them during the current AEP catches them at the exact moment they can take action. Agents who blend 200-500 aged Medicare leads per week alongside their existing book consistently generate 5-10 additional enrollments during AEP at a fraction of the cost. The math is clear: 500 aged leads at $2 each is $1,000 in spend. Even a 2 percent close rate produces 10 enrollments worth $3,000-5,000 in first-year commission."),
    ],
  },
  {
    id: "glossary-cac",
    title: "CAC (Customer Acquisition Cost)",
    body: [
      h2("Understanding Customer Acquisition Cost"),
      block("Customer Acquisition Cost (CAC) is the total cost of acquiring a new paying customer, calculated by dividing all sales and marketing expenses by the number of new customers gained during a specific period. CAC includes every dollar spent to get someone from stranger to buyer — lead costs, advertising spend, sales team compensation, CRM software, dialer subscriptions, marketing materials, and any other cost directly tied to customer acquisition. If you spend $5,000 in a month across all acquisition channels and close 20 customers, your CAC is $250."),
      block("CAC is different from cost per lead (CPL). CPL measures what you pay for each prospect. CAC measures what you pay for each customer who actually buys. CAC is always higher than CPL because not every lead converts. Understanding the gap between CPL and CAC reveals how efficiently your sales process converts prospects into revenue."),
      h2("How It Works in Practice"),
      block("Consider a final expense insurance agent who buys 400 aged leads per week at $2 each — that is $800 in lead costs. Add $200 for a dialer subscription, $100 for CRM software, and allocate $400 for your time based on an hourly rate. Total weekly acquisition spend is $1,500. If you close 8 policies that week, your CAC is $187.50 per customer. Compare that to an agent buying 50 real-time leads at $25 each ($1,250) with the same overhead ($700). If they close 5 policies, their CAC is $390 per customer. The aged lead agent acquires customers at less than half the cost while producing more total policies."),
      h2("Why It Matters for Aged Leads"),
      block("CAC is the metric that proves the aged lead model works. Real-time leads have lower CPL-to-conversion ratios, but their high upfront cost inflates CAC to levels that make profitability difficult — especially for newer agents still developing their close rate. Aged leads flip the equation. The CPL is so low ($1-3) that even modest conversion rates produce attractive CAC numbers. An agent converting aged leads at 1.5 percent with a $2 CPL has a CAC around $133 per customer. That same agent would need a 12 percent conversion rate on $25 real-time leads to match that CAC. Track your CAC monthly and by lead source. When you see aged leads producing a CAC under $200 while real-time leads sit above $350, the reinvestment decision makes itself. Scale what produces the lowest CAC with acceptable volume."),
    ],
  },
  {
    id: "glossary-cost-per-acquisition",
    title: "Cost Per Acquisition (CPA)",
    body: [
      h2("Understanding Cost Per Acquisition"),
      block("Cost Per Acquisition (CPA) measures the total cost to acquire a completed action — typically a sale, enrollment, or signed contract. While sometimes used interchangeably with Customer Acquisition Cost, CPA in the lead industry more often refers to the advertising or marketing cost to generate a specific conversion event. In lead generation, CPA is the price an advertiser pays per completed lead form submission, per booked appointment, or per closed deal depending on the pricing model. A CPA model means the lead buyer only pays when a defined action occurs, shifting risk from the buyer to the seller."),
      block("CPA pricing is the gold standard for lead buyers because it eliminates waste. You do not pay for impressions, clicks, or form abandons — you pay for results. However, CPA leads typically cost more per unit because the vendor absorbs the conversion risk. A click-based lead might cost $15, while a CPA-based lead from the same source might cost $35 because the vendor is guaranteeing a completed submission."),
      h2("How It Works in Practice"),
      block("In practice, CPA shows up in two main ways for insurance and mortgage professionals. First, when evaluating lead vendors, compare their effective CPA — not just their stated CPL. If Vendor A sells leads at $20 each but only 60 percent have valid contact information, your effective CPA for a contactable lead is $33.33. If Vendor B sells at $28 each but 90 percent are contactable, your effective CPA is $31.11. The seemingly cheaper leads are actually more expensive when measured by usable acquisition. Second, track your own CPA across channels. If aged leads cost $2 each and you convert 2 percent, your CPA is $100. If real-time leads cost $30 each and you convert 10 percent, your CPA is $300."),
      h2("Why It Matters for Aged Leads"),
      block("CPA is the great equalizer between aged and real-time leads. Skeptics point to lower conversion rates on aged leads, but CPA tells the real story. Because aged leads cost 85-95 percent less than real-time leads, conversion rates can be significantly lower and still produce a superior CPA. The math consistently favors aged leads: even at one-fifth the conversion rate of real-time leads, aged leads deliver a lower CPA because the cost difference is so dramatic. Smart agents track CPA weekly by lead source and age band. The data almost always shows that 30-90 day aged leads produce the best CPA in any vertical — fresh enough to convert but discounted enough to generate margin."),
    ],
  },
  {
    id: "glossary-indexed-universal-life",
    title: "Indexed Universal Life (IUL)",
    body: [
      h2("Understanding Indexed Universal Life Insurance"),
      block("Indexed Universal Life (IUL) is a permanent life insurance product that builds cash value based on the performance of a market index — typically the S&P 500 — without directly investing in the market. IUL policies offer a floor (usually 0-1 percent) that protects against market losses and a cap (typically 8-12 percent) that limits upside when the index performs well. The policyholder gets death benefit protection plus a cash accumulation component that participates in market gains without market risk. IUL products are designed for consumers who want permanent coverage with growth potential but cannot stomach the volatility of variable life insurance."),
      block("IUL is one of the more complex insurance products to sell because it requires explaining crediting strategies, cap rates, participation rates, and the difference between illustrated and guaranteed values. Carriers project attractive illustrations, but actual performance depends on index returns, cap rate changes, and policy charges over time."),
      h2("How It Works in Practice"),
      block("A typical IUL sale involves a client in their 30s or 40s seeking both permanent death benefit and a tax-advantaged savings vehicle. A $500,000 death benefit IUL with $500 monthly premium might illustrate $350,000 in cash value by age 65, assuming a 7 percent average credited rate. First-year commissions on IUL products range from 80-110 percent of target premium — a $6,000 annual premium generates $4,800-6,600 in first-year commission. That commission structure makes IUL one of the highest-paying products in the life insurance space, which is why agents actively pursue IUL prospects."),
      h2("Why It Matters for Aged Leads"),
      block("IUL prospects are among the most valuable aged leads you can work. Someone who inquired about indexed universal life is a financially aware consumer with income, savings goals, and sophistication. These prospects do not make impulsive decisions — they research, compare, and deliberate. That deliberation period is exactly why they become aged leads. They filled out a form, got overwhelmed by aggressive sales calls, and paused to think. An aged IUL lead at 60-90 days is often further along in their decision process than when they first inquired. They have had time to read, research, and clarify their needs. A consultative approach — asking what they have learned since their initial inquiry — opens conversations that real-time agents never get because they are too focused on urgency. At $2-4 per aged IUL lead versus $30-50 real-time, you can afford to take a consultative, multi-touch approach that matches how IUL buyers actually purchase."),
    ],
  },
  {
    id: "glossary-loan-to-value",
    title: "Loan-to-Value (LTV)",
    body: [
      h2("Understanding Loan-to-Value Ratio"),
      block("Loan-to-Value (LTV) ratio is a financial metric used by lenders to assess risk by comparing the loan amount to the appraised value of the property being used as collateral. It is calculated by dividing the mortgage amount by the property value and expressing it as a percentage. A $240,000 mortgage on a $300,000 home produces an 80 percent LTV. The higher the LTV, the more risk the lender assumes because the borrower has less equity in the property. Most conventional mortgages require private mortgage insurance (PMI) when LTV exceeds 80 percent."),
      block("LTV matters at origination and throughout the life of the loan. As borrowers make payments and property values change, the LTV shifts. Homeowners seeking HELOCs, refinances, or second mortgages are evaluated on their current LTV — called Combined Loan-to-Value (CLTV) when multiple loans exist against the property."),
      h2("How It Works in Practice"),
      block("LTV directly determines which loan programs a borrower qualifies for and at what rate. A borrower at 95 percent LTV pays a higher interest rate and PMI compared to a borrower at 75 percent LTV on the same property. FHA loans allow up to 96.5 percent LTV. Conventional loans typically cap at 97 percent for first-time buyers but offer the best rates at 80 percent or below. For refinances, most programs require 80-90 percent LTV or lower. HELOC products — a growing market — generally require a CLTV of 85-90 percent. These thresholds create distinct prospect segments that respond differently to outreach timing and messaging."),
      h2("Why It Matters for Aged Leads"),
      block("LTV context transforms how you work aged mortgage and HELOC leads. A prospect who inquired about a refinance 90 days ago may have seen their LTV improve as property values increased — making them a better candidate now than when they first inquired. When working aged mortgage leads, reference current market conditions: 'When you reached out three months ago, rates were at X — and your home may have appreciated since then, giving you better equity position.' This reframes the aged lead from a stale contact into a timely opportunity. Aged HELOC leads are particularly strong because homeowners with equity have a persistent need — home improvements, debt consolidation, education funding. That need does not expire after 30 days. It often intensifies as they continue thinking about it."),
    ],
  },
  {
    id: "glossary-ltv",
    title: "LTV (Lifetime Value)",
    body: [
      h2("Understanding Lifetime Value"),
      block("Lifetime Value (LTV) measures the total revenue a business earns from a single customer over the entire duration of that relationship. In insurance, LTV includes initial commissions, renewal commissions, cross-sell revenue, and referral value over the years a client remains on the books. A final expense client who pays $80 per month on a policy paying 100 percent first-year commission and 5 percent renewals generates roughly $960 in first-year commission and $48 per year in renewals. Over a 10-year policy life, that client is worth approximately $1,392 in total commission — plus any additional policies you sell them."),
      block("LTV is the counterweight to Customer Acquisition Cost. When LTV significantly exceeds CAC, you have a profitable and scalable business model. When CAC approaches or exceeds LTV, you are losing money on every customer even if individual transactions feel profitable."),
      h2("How It Works in Practice"),
      block("Calculate LTV by multiplying average revenue per customer by average customer lifespan in years. For a Medicare Supplement agent, a client who stays 6 years at $300 per year in renewal commission has an LTV of $1,800 — plus the $600-900 first-year commission. Total LTV is approximately $2,400-2,700. For mortgage loan officers, LTV includes the original loan commission plus refinance probability and referral generation. A $300,000 loan generating $3,000 in commission with a 30 percent chance of refinance within 5 years and one referral over the relationship has an LTV approaching $5,000-6,000. Knowing your LTV by product line tells you exactly how much you can afford to spend acquiring each customer."),
      h2("Why It Matters for Aged Leads"),
      block("LTV is what makes the aged lead math so compelling. When you know your LTV is $2,000 per customer and your CAC on aged leads is $150, you are generating 13x return on acquisition spend. That ratio gives you enormous room to invest in volume. Buy more leads, hire callers, invest in better CRM tools — every dollar of infrastructure investment is leveraged across that LTV multiple. The mistake most agents make is evaluating aged leads on first-transaction revenue alone. A $960 first-year commission minus $150 CAC looks decent. But when you factor in $1,400 in lifetime value beyond that first year, the return becomes extraordinary. Track LTV by lead source and you will almost certainly find that aged lead customers have comparable LTV to real-time lead customers — because product retention and referral rates are driven by service quality, not lead freshness."),
    ],
  },
  {
    id: "glossary-medicare-supplement",
    title: "Medicare Supplement (Medigap)",
    body: [
      h2("Understanding Medicare Supplement Insurance"),
      block("Medicare Supplement insurance, commonly called Medigap, is private insurance that covers the gaps in Original Medicare — specifically the deductibles, copayments, and coinsurance that Medicare Parts A and B do not pay. Medigap policies are standardized by the federal government into lettered plans (A, B, C, D, F, G, K, L, M, N), with each letter offering a specific set of benefits. Plan G has become the most popular since Plan F was closed to new enrollees after January 1, 2020. Unlike Medicare Advantage, Medigap does not restrict provider networks — any doctor or hospital that accepts Medicare accepts Medigap."),
      block("Medigap is sold by private insurers but regulated at both federal and state levels. During the Medigap Open Enrollment Period — the six months after a beneficiary turns 65 and enrolls in Medicare Part B — insurers must accept applicants regardless of health status. Outside that window, medical underwriting applies in most states, making it significantly harder to qualify."),
      h2("How It Works in Practice"),
      block("Medigap sales follow a different rhythm than Medicare Advantage. While MA sales concentrate during AEP, Medigap sales happen year-round because beneficiaries can enroll anytime (subject to underwriting outside their open enrollment window). Plan G premiums range from $100-250 per month depending on age, location, and carrier. Agent commissions typically run 20-25 percent of first-year premium — a $150 monthly premium generates $360-450 in first-year commission with 5-8 percent renewals ongoing. Top Medigap agents build substantial renewal books, generating $50,000-100,000 per year in passive renewal income after 5-7 years of production."),
      h2("Why It Matters for Aged Leads"),
      block("Aged Medicare Supplement leads are uniquely valuable because Medigap shopping is a deliberate, research-heavy decision. Beneficiaries compare plans, premiums, carrier ratings, and rate increase histories before buying. That research takes time — often 30-90 days from initial inquiry to purchase. This makes aged leads perfectly aligned with the Medigap buying cycle. A prospect who inquired 60 days ago is not a cold lead — they are mid-decision. They have likely been quoted by 2-3 agents, done their own research, and are close to a decision. Reaching them with a straightforward comparison and a no-pressure approach often closes the sale because you are arriving at the right moment. At $1-3 per aged Medicare lead versus $25-40 real-time, you can build a 500-lead weekly pipeline and systematically work the entire Medigap buying cycle."),
    ],
  },
  {
    id: "glossary-mva",
    title: "MVA (Motor Vehicle Accident)",
    body: [
      h2("Understanding MVA Leads"),
      block("MVA stands for Motor Vehicle Accident, and in the lead generation industry, MVA leads are prospects who have been involved in a car accident and may need legal representation, medical treatment, or insurance claim assistance. MVA leads are among the most valuable in the legal lead generation space because personal injury cases from auto accidents generate significant contingency fees — typically 33 percent of the settlement. A $100,000 settlement produces $33,000 in attorney fees, making each legitimate MVA lead potentially worth thousands of dollars in revenue for a law firm."),
      block("MVA leads are generated through multiple channels: online advertising (PPC campaigns targeting terms like 'car accident lawyer near me'), hospital and chiropractor referral networks, police report mining services, and digital lead aggregators. The quality and sourcing method dramatically impact conversion rates and case value."),
      h2("How It Works in Practice"),
      block("Real-time MVA leads sell for $50-200 each depending on geography, accident severity filters, and exclusivity. A mid-size personal injury firm might spend $10,000-20,000 per month on MVA leads, signing 15-25 cases. Not every signed case results in a payout — some claims are denied, some clients drop off, and some accidents produce minimal damages. Firms typically see 60-70 percent of signed MVA cases reach settlement, with average settlements ranging from $15,000-75,000 depending on injury severity and jurisdiction. The math works at scale: $15,000 monthly lead spend producing 20 signed cases, 14 settling at an average of $40,000, generating $184,800 in fees."),
      h2("Why It Matters for Aged Leads"),
      block("Aged MVA leads are a massive opportunity that most personal injury firms overlook. The statute of limitations for personal injury claims ranges from one to six years depending on the state — meaning a 90-day-old MVA lead is still early in the legal timeline. Many accident victims do not immediately seek representation. They focus on medical treatment first, deal with their own insurance company, and only realize they need an attorney when the at-fault carrier lowballs their claim or denies it entirely. That realization often happens 30-120 days after the accident. Aged MVA leads at $5-15 each versus $100-200 real-time represent extraordinary value. A firm buying 200 aged MVA leads per month at $10 each ($2,000) needs only one signed case settling at $50,000 to generate $16,500 in fees — an 8x return on lead spend."),
    ],
  },
  {
    id: "glossary-open-enrollment-period",
    title: "Open Enrollment Period (OEP)",
    body: [
      h2("Understanding Open Enrollment Period"),
      block("The Open Enrollment Period (OEP) for Medicare runs from January 1 through March 31 each year. During OEP, Medicare beneficiaries who are already enrolled in a Medicare Advantage plan can make one plan change — they can switch to a different Medicare Advantage plan or drop their Medicare Advantage plan and return to Original Medicare with or without a Part D prescription drug plan. OEP is more limited than AEP: beneficiaries cannot use OEP to enroll in Medicare Advantage for the first time if they are currently on Original Medicare, and they can only make one change during the entire period."),
      block("OEP is sometimes confused with AEP, but they serve different purposes. AEP (October 15 - December 7) is the primary enrollment window where most plan changes happen. OEP exists as a correction window — it gives beneficiaries who made an AEP decision they regret a chance to make one adjustment. The healthcare industry also uses 'open enrollment' more broadly to describe employer-sponsored health insurance enrollment windows, typically in November, which is a separate concept entirely."),
      h2("How It Works in Practice"),
      block("OEP volume is significantly lower than AEP — typically 15-25 percent of the activity level. But the prospects who act during OEP are highly motivated. They are dissatisfied with a choice they made during AEP or have experienced a problem with their current plan (provider not in network, medication not covered, unexpected costs). This makes OEP leads highly intentional. Real-time Medicare leads during OEP cost $20-35 — lower than AEP but still substantial. Agents who work OEP effectively focus on two groups: dissatisfied MA enrollees looking to switch and beneficiaries who want to return to Original Medicare plus a Medigap policy."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads from AEP that did not convert are perfect OEP prospects. These are beneficiaries who were actively shopping during AEP but did not make a decision — or made a hasty decision they now regret. Reaching them in January with a simple message — 'You have until March 31 to make a change if your current plan is not working' — resonates because it addresses a real and immediate concern. The cost advantage is dramatic: aged AEP leads purchased at $1-3 in January are essentially OEP leads at a 90-95 percent discount. Agents who stockpile unconverted AEP leads and systematically rework them during OEP add 10-20 additional enrollments per quarter at virtually no incremental lead cost."),
    ],
  },
  {
    id: "glossary-power-purchase-agreement",
    title: "Power Purchase Agreement (PPA)",
    body: [
      h2("Understanding Power Purchase Agreements"),
      block("A Power Purchase Agreement (PPA) is a financial arrangement in the solar energy industry where a third-party developer installs, owns, and maintains a solar panel system on a homeowner's or business's property at no upfront cost. The property owner agrees to purchase the electricity generated by the system at a fixed per-kilowatt-hour rate, typically 10-30 percent below the local utility rate. The agreement usually lasts 20-25 years, with the developer retaining ownership of the equipment and claiming the federal tax credits and depreciation benefits. PPAs make solar accessible to homeowners who cannot afford the $20,000-35,000 upfront cost of purchasing a system outright."),
      block("PPAs differ from solar leases in a key way: with a PPA, you pay for the electricity produced; with a lease, you pay a fixed monthly amount regardless of production. Both eliminate upfront costs, but PPAs better align the homeowner's payments with actual energy generation. PPAs also differ from direct purchase and solar loans, where the homeowner owns the system and captures the tax benefits directly."),
      h2("How It Works in Practice"),
      block("A typical PPA scenario: a homeowner with a $200 monthly electric bill installs a 8kW solar system under a PPA. The system generates most of their electricity, and they pay the PPA provider $0.12 per kWh versus the utility's $0.16 per kWh. Their combined energy cost drops to $140-160 per month. The PPA rate typically escalates 1-3 percent annually, while utility rates historically increase 3-5 percent annually, so savings tend to grow over time. Solar lead generation for PPAs targets homeowners with high electric bills ($150+ monthly), good roof condition, and adequate sun exposure. Real-time solar leads cost $20-40 each."),
      h2("Why It Matters for Aged Leads"),
      block("Solar PPA leads are exceptionally well-suited for aged lead strategies. The solar buying cycle is long — homeowners typically research for 2-6 months before committing. A prospect who inquired about solar 90 days ago has not lost interest; they are mid-research. Many initial solar inquiries result in aggressive sales tactics that turn homeowners off. They get bombarded with calls, receive confusing proposals, and retreat. An aged lead approach — reaching out 60-90 days later with a clear, pressure-free comparison of PPA versus purchase versus lease — arrives when the homeowner has done their homework and is ready for a straightforward conversation. At $3-5 per aged solar lead versus $25-40 real-time, you can build a pipeline of 200+ prospects per week and nurture them through the naturally long solar decision cycle."),
    ],
  },
  {
    id: "glossary-roi",
    title: "ROI (Return on Investment)",
    body: [
      h2("Understanding Return on Investment"),
      block("Return on Investment (ROI) measures the profitability of an investment relative to its cost, expressed as a percentage. The formula is straightforward: (Revenue Generated minus Cost of Investment) divided by Cost of Investment, multiplied by 100. If you spend $1,000 on aged leads and generate $5,000 in commission revenue, your ROI is 400 percent. ROI is the universal metric for evaluating whether a marketing channel, lead source, or business strategy is worth continuing, scaling, or cutting. In sales, ROI answers the fundamental question: for every dollar I spend, how many dollars do I get back?"),
      block("ROI should be calculated net of all costs — not just lead spend. A true ROI calculation includes lead costs, dialer fees, CRM subscriptions, time invested (valued at your effective hourly rate), and any overhead allocated to your sales operation. Gross ROI on lead spend alone can be misleading if your operational costs are high."),
      h2("How It Works in Practice"),
      block("Here is a real-world aged lead ROI calculation. An insurance agent spends $2,000 per month on aged leads (1,000 leads at $2 each). Monthly operational costs: $150 dialer, $75 CRM, $50 phone line — $275 total. Time investment: 160 hours at a $25 per hour opportunity cost equals $4,000. Total investment: $6,275. Results: 15 policies sold at an average $800 first-year commission equals $12,000 in revenue. ROI: ($12,000 - $6,275) / $6,275 = 91 percent. That is a strong ROI. For comparison, the same agent buying 100 real-time leads at $30 each ($3,000 lead spend) with the same overhead and time investment needs to close 10+ policies to match — requiring a 10 percent close rate versus the 1.5 percent close rate on aged leads."),
      h2("Why It Matters for Aged Leads"),
      block("ROI is where aged leads consistently outperform every other lead source when measured honestly. The primary driver is cost asymmetry — aged leads cost 85-95 percent less than real-time leads, so even significantly lower conversion rates produce superior ROI. An agent generating 200 percent ROI on aged leads and 80 percent ROI on real-time leads should obviously shift budget toward aged leads. Yet many agents do the opposite because they focus on conversion rate rather than ROI. A 10 percent conversion rate on real-time leads feels better than a 1.5 percent rate on aged leads — until you run the ROI calculation. Track ROI monthly by lead source, age band, and vertical. Let the numbers dictate your budget allocation. In my experience, agents who rigorously track ROI end up with 60-80 percent of their lead budget in aged leads within six months."),
    ],
  },
  {
    id: "glossary-scope-of-appointment",
    title: "Scope of Appointment (SOA)",
    body: [
      h2("Understanding Scope of Appointment"),
      block("A Scope of Appointment (SOA) is a CMS-required document that must be signed by a Medicare beneficiary before an agent can discuss specific Medicare product types during a sales appointment. The SOA specifies which product categories — Medicare Advantage, Medicare Supplement, Part D prescription drug plans, dental/vision/hearing — the beneficiary has agreed to discuss. Agents cannot present products outside the scope defined in the signed document. The SOA must be obtained at least 48 hours before an in-person appointment, though telephonic appointments allow same-day SOA completion in most circumstances."),
      block("SOA requirements exist to protect Medicare beneficiaries from unsolicited sales tactics. CMS implemented these rules to ensure beneficiaries control what topics are discussed during Medicare sales interactions. Failure to obtain a proper SOA before a sales presentation is a compliance violation that can result in agent decertification, carrier termination, and CMS enforcement action. Every Medicare agent must take this requirement seriously — it is not a formality."),
      h2("How It Works in Practice"),
      block("The SOA workflow for Medicare agents typically involves three steps. First, during initial contact, the agent explains they need permission to discuss specific Medicare topics. Second, the agent sends or presents the SOA form listing the product categories. Third, the beneficiary signs and dates the form, and the agent retains it for a minimum of 10 years. For phone sales, agents use electronic SOA platforms that record verbal consent or capture e-signatures. Most CRM systems designed for Medicare sales include built-in SOA workflows. Efficient agents build SOA completion into their initial call script so it becomes a natural part of the conversation rather than an awkward compliance hurdle."),
      h2("Why It Matters for Aged Leads"),
      block("SOA management is a critical workflow consideration when working aged Medicare leads at volume. When you are calling 50-100 aged Medicare leads per day, you need a streamlined SOA process or you will create a compliance bottleneck that kills your production pace. Build SOA completion into your first meaningful conversation — do not schedule a callback to do it separately. Use an e-signature platform that lets you text or email the SOA during the call and get it signed in real-time. For aged leads specifically, the SOA conversation actually serves as a rapport-building moment: 'Before we review your options, Medicare requires me to get your permission to discuss specific topics. This protects you and ensures I only cover what you are interested in.' That framing positions you as a compliant professional — a contrast to the aggressive callers who bombarded them when their lead was fresh."),
    ],
  },
  {
    id: "glossary-sga",
    title: "SGA (Substantial Gainful Activity)",
    body: [
      h2("Understanding Substantial Gainful Activity"),
      block("Substantial Gainful Activity (SGA) is the income threshold used by the Social Security Administration to determine whether a person is eligible for disability benefits. If an individual's earnings exceed the SGA limit, they are generally considered able to work and are not eligible for Social Security Disability Insurance (SSDI) benefits. For 2026, the SGA limit is approximately $1,620 per month for non-blind individuals and $2,700 for blind individuals. These thresholds are adjusted annually based on the national average wage index. SGA applies to both initial disability determinations and ongoing eligibility reviews."),
      block("SGA is distinct from the income limits for Supplemental Security Income (SSI), which is a needs-based program with different rules. SSDI eligibility requires both meeting the SGA threshold and having a qualifying medical condition expected to last at least 12 months or result in death. Understanding SGA is essential for anyone generating or working disability-related leads because it defines the fundamental eligibility criteria prospects must meet."),
      h2("How It Works in Practice"),
      block("When a person applies for SSDI, the SSA first checks whether their current earnings exceed the SGA limit. If they are earning above SGA, the claim is typically denied at the initial step regardless of medical condition. For someone who has stopped working due to a disability, SGA becomes relevant again during Trial Work Period reviews — SSDI recipients can test their ability to work for up to 9 months without losing benefits, but if they consistently earn above SGA after the trial period, benefits may be terminated. Disability attorneys and advocates often help claimants navigate SGA rules during appeals. The initial SSDI denial rate is approximately 65-70 percent, meaning most claimants need to appeal — and many need legal representation."),
      h2("Why It Matters for Aged Leads"),
      block("Disability leads are one of the most underworked verticals in the aged lead space, and understanding SGA helps you identify and qualify prospects efficiently. When working aged SSDI leads, the first qualification question is whether the prospect's earnings are below SGA — this determines basic eligibility before investing time in the conversation. Aged disability leads are particularly strong because the SSDI application process is notoriously slow. Initial applications take 3-6 months for a decision, and appeals take 12-18 months. A prospect who inquired 90 days ago is likely still waiting for their initial determination or processing a denial. Their need for legal representation or advocacy has not diminished — it has often intensified. At $2-5 per aged disability lead versus $30-60 real-time, firms and advocates can build large pipelines and nurture prospects through the lengthy SSDI timeline."),
    ],
  },
  {
    id: "glossary-special-enrollment-period",
    title: "Special Enrollment Period (SEP)",
    body: [
      h2("Understanding Special Enrollment Period"),
      block("A Special Enrollment Period (SEP) is a window outside of the standard Annual Enrollment Period during which Medicare beneficiaries can make changes to their coverage based on qualifying life events. SEPs are triggered by specific circumstances: moving to a new service area, losing employer coverage, qualifying for Medicaid or Extra Help (Low Income Subsidy), experiencing a plan violation or misrepresentation, or being released from incarceration. Each qualifying event opens a specific enrollment window, typically 60 days before or after the event, during which the beneficiary can enroll in, switch, or drop a Medicare Advantage or Part D plan."),
      block("SEPs are significant because they create enrollment opportunities throughout the entire year — not just during AEP and OEP. For agents, this means Medicare sales are truly a 12-month business when you understand and leverage SEP qualifying events. The most common SEP triggers are relocation (moving to a new county or state), loss of employer group coverage (retirement or job change), and dual-eligible status changes (gaining or losing Medicaid)."),
      h2("How It Works in Practice"),
      block("An agent who understands SEPs can identify prospects year-round. A 66-year-old who just retired loses their employer health coverage — that triggers a SEP allowing Medicare enrollment. A 70-year-old who moved from Michigan to Florida needs a new Medicare Advantage plan that includes local providers — another SEP. A beneficiary who qualifies for the Low Income Subsidy can change plans once per quarter. Each of these scenarios creates an immediate, time-sensitive need for an agent's help. The key is identifying these events quickly. Monitoring retirement announcements, relocation patterns, and Medicaid eligibility changes in your market gives you a pipeline of SEP-eligible prospects that most agents miss entirely."),
      h2("Why It Matters for Aged Leads"),
      block("SEP awareness transforms how you work aged Medicare leads during the off-season. Most agents stop working Medicare leads after AEP and OEP, creating a vacuum from April through September. But aged Medicare leads generated during any period may contain prospects who qualify for SEPs right now. When calling aged Medicare leads outside enrollment periods, your qualifying question shifts to: 'Have you experienced any changes recently — a move, a change in employer coverage, or a change in your Medicaid status?' If yes, they may have a SEP, and you can help them immediately. This approach turns supposedly dead off-season aged leads into active sales opportunities. Agents who systematically screen aged Medicare leads for SEP eligibility during the off-season add 3-8 enrollments per month that competitors leave on the table — all from leads purchased at $1-3 each that other agents consider worthless until the next AEP."),
    ],
  },
];

async function main() {
  console.log(`Expanding ${expansions.length} glossary terms (batch 3)...\n`);

  for (const term of expansions) {
    try {
      await client
        .patch(term.id)
        .set({ body: term.body })
        .commit();
      console.log(`✓ ${term.id} — "${term.title}"`);
    } catch (err) {
      console.error(`✗ ${term.id} — ${err.message}`);
    }
    await sleep(300);
  }

  console.log("\nDone.");
}

main();
