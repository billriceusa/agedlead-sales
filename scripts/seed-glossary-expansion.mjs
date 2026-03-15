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
function k() { return Math.random().toString(36).slice(2, 10); }

// New industry-specific terms unique to our vertical specialist positioning
const newTerms = [
  { term: "Kitchen Table Presentation", slug: "kitchen-table-presentation", definition: "An in-person insurance sales presentation conducted at the prospect's home, typically at their kitchen or dining table. The most effective closing format for final expense and senior market insurance.", category: "sales" },
  { term: "Scope of Appointment (SOA)", slug: "scope-of-appointment", definition: "A CMS-required form that must be signed before a Medicare sales appointment. Documents which types of plans will be discussed. Must be collected 48+ hours before the meeting.", category: "compliance" },
  { term: "Book of Business", slug: "book-of-business", definition: "The total collection of active policies or clients managed by an agent. In Medicare, your book grows through renewals — each year's enrollments compound as recurring commission.", category: "insurance" },
  { term: "Persistency Rate", slug: "persistency-rate", definition: "The percentage of insurance policies that remain active after a given period (usually 6 or 12 months). High persistency means policyholders keep their coverage and the agent retains commissions.", category: "insurance" },
  { term: "Advance Commission", slug: "advance-commission", definition: "Receiving future commission payments upfront when a policy is issued, typically 6-9 months of commission paid immediately. Common in final expense and life insurance. Subject to chargeback if the policy lapses.", category: "insurance" },
  { term: "Chargeback", slug: "chargeback", definition: "When an insurance company claws back advance commission because a policy cancelled or lapsed within the chargeback period (typically 6-12 months). A significant risk when working high-volume aged leads.", category: "insurance" },
  { term: "SGA (Substantial Gainful Activity)", slug: "sga", definition: "The income threshold set by the Social Security Administration that determines disability eligibility. If a claimant earns above SGA (currently ~$1,550/month), they generally cannot qualify for SSDI benefits.", category: "legal" },
  { term: "Denial Rate", slug: "denial-rate", definition: "The percentage of initial SSDI applications that are denied. Currently around 60-70% nationally. High denial rates create opportunity for disability attorneys working aged leads to help with appeals.", category: "legal" },
  { term: "Solar ITC", slug: "solar-itc", definition: "The Solar Investment Tax Credit — a federal tax credit for installing solar energy systems. Currently 30% of installation costs. A primary motivator for homeowners and a key hook when calling aged solar leads.", category: "finance" },
  { term: "Net Metering", slug: "net-metering", definition: "A billing arrangement where solar panel owners receive credit for excess electricity they send back to the grid. A key selling point when working aged solar leads — it determines the homeowner's actual savings.", category: "finance" },
  { term: "Power Purchase Agreement (PPA)", slug: "power-purchase-agreement", definition: "A financing arrangement where a solar company installs panels on a homeowner's roof at no upfront cost, and the homeowner buys the electricity at a fixed rate. Lowers the barrier to entry for solar prospects.", category: "finance" },
  { term: "Rate Lock", slug: "rate-lock", definition: "A mortgage lender's guarantee that a specific interest rate will be available for a set period (typically 30-60 days). When rates are volatile, rate lock urgency is a powerful hook for calling aged mortgage leads.", category: "mortgage" },
  { term: "Loan-to-Value (LTV)", slug: "loan-to-value", definition: "The ratio of a mortgage loan amount to the appraised property value. LTV determines eligibility, rates, and whether private mortgage insurance (PMI) is required. Key qualification metric for aged mortgage leads.", category: "mortgage" },
  { term: "Yellow Letter", slug: "yellow-letter", definition: "A handwritten or handwritten-style letter on yellow legal pad paper, commonly used in direct mail campaigns for aged leads. Yellow letters have significantly higher open rates than printed mailers, especially with seniors.", category: "marketing" },
  { term: "Voicemail Drop", slug: "voicemail-drop", definition: "Technology that delivers a pre-recorded voicemail directly to a prospect's voicemail box without ringing the phone. Compliance considerations vary by state — consult legal counsel before using with aged leads.", category: "marketing" },
  { term: "Data Hygiene", slug: "data-hygiene", definition: "The process of cleaning and maintaining lead data quality — removing duplicates, updating disconnected numbers, verifying addresses, and scrubbing against DNC lists. Essential before working any batch of aged leads.", category: "lead-generation" },
  { term: "Lead Recycling", slug: "lead-recycling", definition: "Re-working leads that weren't contacted or didn't convert on the first attempt. Aged leads can be recycled through different channels (phone → mail → email) or re-attempted after 30-60 days with a different approach.", category: "lead-generation" },
  { term: "Appointment Set Rate", slug: "appointment-set-rate", definition: "The percentage of contacted leads that agree to a formal appointment or presentation. In final expense door knocking, a 30-40% appointment set rate from contacts is considered strong.", category: "sales" },
  { term: "T65 Lead", slug: "t65-lead", definition: "A consumer turning 65 — the age of Medicare eligibility. T65 leads are among the most valuable Medicare leads because these consumers are entering Medicare for the first time and need guidance on plan selection.", category: "insurance" },
  { term: "Special Enrollment Period (SEP)", slug: "special-enrollment-period", definition: "A time outside the standard enrollment period when someone can sign up for Medicare or change plans due to a qualifying life event (moving, losing coverage, etc.). Creates year-round opportunities for aged Medicare leads.", category: "insurance" },
];

// Enriched body content for high-value existing terms
const enrichments = [
  {
    id: "glossary-aged-lead",
    body: [
      h2("How Aged Leads Work"),
      block("When a consumer fills out an online form requesting information about insurance, mortgage, solar, or other services, that form submission becomes a 'lead.' The lead is initially sold in real-time to sales professionals for $15-$60+. After 30+ days without a sale, that same record becomes an 'aged lead' and is resold at 80-95% less — typically $0.25-$5 per record."),
      block("The consumer's need doesn't expire when the lead ages. Someone who requested mortgage information 90 days ago still needs a mortgage. Someone who inquired about final expense insurance 120 days ago still needs coverage. Aged leads work because human needs persist long after the initial inquiry."),
      h2("Why Sales Professionals Use Aged Leads"),
      block("The economics are straightforward: a $500 budget buys roughly 15-20 real-time leads or 250-1,000 aged leads. Even with a lower conversion rate (1-5% vs 5-15%), the volume advantage typically produces more total sales and higher ROI. Aged leads also eliminate the speed-to-call competition that makes real-time leads stressful and unpredictable."),
    ],
  },
  {
    id: "glossary-contact-rate",
    body: [
      h2("Contact Rates by Channel"),
      block("Phone contact rates for aged leads typically range from 5-18% depending on industry and lead age. Final expense and Medicare leads tend to have higher contact rates (12-18%) because seniors are more likely to be home and answer their phones. Mortgage and insurance leads tend toward 8-12%."),
      block("Door knocking dramatically improves contact rates — 35-50% for local aged leads. Direct mail has a different kind of 'contact rate': open rates of 40-60% for personalized letters, though response rates are lower (2-5%). Email reaches inboxes but open rates for cold outreach are typically 15-25%."),
      h2("How to Improve Your Contact Rate"),
      block("Call during optimal windows: Tuesday-Thursday, 10 AM-12 PM and 2-4 PM local time. Use caller ID that shows your real number and area code. Leave voicemails — 20-30% of prospects call back. Send a direct mail piece before calling so your name is familiar. Use multi-channel outreach: prospects who don't answer the phone may respond to email or mail."),
    ],
  },
  {
    id: "glossary-conversion-rate",
    body: [
      h2("Conversion Rates by Industry"),
      block("Aged lead conversion rates vary significantly by vertical. Final expense: 2-5% (higher with door knocking). Insurance (P&C): 1-3%. Mortgage: 1-2%. Solar: 1-3%. Medicare: 2-4% (spikes during AEP). SSDI: 3-5% (high because the need persists for years). MVA: 2-4%. These rates assume consistent multi-touch follow-up over 10-14 days."),
      h2("The Volume Advantage"),
      block("A 2% conversion rate sounds low until you do the math. At $1 per lead, 500 leads cost $500. At 2% conversion, that's 10 sales. If your average deal is $1,000, that's $10,000 in revenue from $500 in lead spend — a 1,900% ROI. Compare that to 20 real-time leads at $25 each ($500) converting at 10% = 2 sales = $2,000 revenue. Same budget, 5x more sales with aged leads."),
    ],
  },
  {
    id: "glossary-follow-up-cadence",
    body: [
      h2("The Recommended Aged Lead Cadence"),
      block("Day 1: Direct mail — send a personal letter or yellow letter to prime the prospect. Day 3: First phone call using the Honest Follow-Up script. Leave a voicemail if no answer. Day 4: Personal email — plain text, no HTML, reference your call. Day 7: Second phone call at a different time of day. Day 10: Door knock (if local) or second email with specific value. Day 14: Final phone attempt. After 14 days with no contact, move to a passive drip or recycle the lead in 60 days."),
      h2("Why Multi-Touch Matters"),
      block("80% of sales require 5-7 contact attempts, but 44% of salespeople give up after one follow-up. With aged leads, persistence is everything. Each touch reinforces the previous one — the prospect sees your letter, hears your voicemail, reads your email. By touch 3-4, you're a familiar name, not a cold caller. The agents who make the most money with aged leads are the most consistent, not the most talented."),
    ],
  },
  {
    id: "glossary-final-expense-insurance",
    body: [
      h2("Why Final Expense Is the Top Aged Lead Vertical"),
      block("Final expense insurance is a uniquely strong fit for aged leads because of the senior market's buying behavior. Seniors take longer to make decisions, prefer personal relationships, and respond well to patient, empathetic outreach. They often don't buy from the first agent who calls — they buy from the agent who follows up."),
      block("The product itself is simple: a small whole life policy ($5,000-$50,000) that covers funeral costs, medical bills, and other end-of-life expenses. No medical exam required for most policies. Premiums range from $20-$100/month. This simplicity makes it easy to sell at the kitchen table in a 10-15 minute presentation."),
      h2("Working Final Expense Aged Leads"),
      block("The most effective channel for final expense aged leads is door knocking, with conversion rates 2-5x higher than phone calls. Direct mail (personal letters, not brochures) is the second-best channel. Phone calling works but requires a warm, personal tone — seniors hang up on anything that sounds scripted or salesy. The combination of mail + phone + door knock produces the highest conversion rates in the industry."),
    ],
  },
];

async function run() {
  console.log("=== Adding new glossary terms ===\n");

  for (const t of newTerms) {
    try {
      await client.createOrReplace({
        _id: `glossary-${t.slug}`,
        _type: "glossaryTerm",
        term: t.term,
        slug: { _type: "slug", current: t.slug },
        definition: t.definition,
        category: t.category,
      });
      console.log(`  ✓ ${t.term}`);
    } catch (err) {
      console.error(`  ✗ ${t.term}: ${err.message}`);
    }
  }

  console.log(`\n=== Enriching ${enrichments.length} existing terms with body content ===\n`);

  for (const e of enrichments) {
    try {
      await client.patch(e.id).set({ body: e.body }).commit();
      console.log(`  ✓ ${e.id}`);
    } catch (err) {
      console.error(`  ✗ ${e.id}: ${err.message}`);
    }
  }

  console.log(`\nDone! Added ${newTerms.length} terms, enriched ${enrichments.length} terms.`);
}

run().catch(console.error);
