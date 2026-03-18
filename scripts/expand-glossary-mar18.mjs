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

// 25 glossary terms to expand with 300-400 word body content
const expansions = [
  {
    slug: "close-rate",
    body: [
      h2("Understanding Close Rate"),
      block("Close rate measures the percentage of prospects who become paying customers out of the total number you contact or present to. If you contact 100 aged leads and close 3, your close rate is 3%. This metric tells you how effective your sales process is once you actually reach a prospect and begin a conversation."),
      block("Close rate differs from conversion rate in an important way. Conversion rate tracks the entire funnel from lead purchase to sale, while close rate specifically measures your effectiveness after making contact. An agent might have a 2% conversion rate on 500 leads but a 15% close rate on the 65 people they actually spoke with. Both numbers matter, but close rate tells you about your sales skill, while conversion rate tells you about the full system."),
      h2("How It Works in Practice"),
      block("Benchmarks vary by industry. In final expense insurance, strong agents close 25-35% of kitchen table presentations. Phone-only close rates for aged insurance leads run 5-15%. Mortgage close rates on aged leads are typically 3-8% of contacted prospects. Solar runs 5-12% of presentations. The key insight is that aged lead close rates are often comparable to real-time leads because the prospect has had time to think and is often more ready to commit."),
      h2("Why It Matters for Aged Leads"),
      block("Your close rate is the lever that determines profitability. At $1 per aged lead and a 2% close rate, you need 50 leads per sale. If your average commission is $500, that is a $50 cost of acquisition — a 10:1 return. Improving your close rate from 2% to 4% cuts your cost per acquisition in half. Track close rate by lead type, lead age, and outreach channel to identify what is working. Most agents who struggle with aged leads have a contact rate problem, not a close rate problem — they are giving up before reaching enough people."),
    ],
  },
  {
    slug: "cold-calling",
    body: [
      h2("Understanding Cold Calling"),
      block("Cold calling is the practice of contacting prospects who have had no prior interaction with you or your company. The caller has no relationship, no referral, and no previous expression of interest from the prospect. Traditional cold calling means dialing from a purchased list of people who never asked to hear from you."),
      block("This is a critical distinction for aged lead professionals: calling aged leads is not cold calling. Every aged lead filled out a form, clicked an ad, or otherwise expressed interest in a product or service. That intent may be weeks or months old, but it existed. This makes aged lead outreach fundamentally different from true cold calling, where no intent signal exists at all."),
      h2("How It Works in Practice"),
      block("True cold calling typically produces contact rates of 2-5% and conversion rates well under 1%. Aged lead calling produces contact rates of 8-18% and conversion rates of 1-5% — dramatically higher because the prospect remembers expressing interest, even if they do not remember the specific form. When you reference their original inquiry, you are re-warming a lead, not cold calling. Your opening should always acknowledge their prior interest: 'You requested information about life insurance coverage a few months ago — I am following up to see if you still need help with that.'"),
      h2("Why It Matters for Aged Leads"),
      block("The cold calling stigma causes many new agents to hesitate before calling aged leads. They expect hostility and rejection. In reality, aged lead prospects are significantly more receptive than cold prospects because they raised their hand at some point. Understanding this distinction changes your mindset, your tone, and your results. You are not interrupting strangers — you are following up with people who asked for help. Agents who internalize this shift consistently report higher confidence and better close rates within their first week of calling."),
    ],
  },
  {
    slug: "contact-rate",
    body: [
      h2("Understanding Contact Rate"),
      block("Contact rate is the percentage of leads where you successfully reach the prospect and have a live conversation. The formula is simple: contacts divided by total attempts, multiplied by 100. If you dial 200 aged leads and speak with 30 people, your contact rate is 15%. Contact rate is the single most important metric in aged lead sales because nothing else matters if you cannot reach people."),
      h2("How It Works in Practice"),
      block("Contact rates vary dramatically by channel. Phone calling produces 8-18% contact rates on aged leads, with final expense and Medicare leads on the higher end because seniors answer their phones more often. Door knocking delivers 35-50% contact rates for local aged leads — far higher than any other channel. Direct mail gets a different kind of contact: 40-60% open rates for personalized letters, but only 2-5% response rates. Email open rates run 15-25% for aged lead outreach. SMS achieves 30-45% read rates but must comply with TCPA requirements."),
      block("To improve phone contact rates, call during optimal windows — Tuesday through Thursday, 10 AM to noon and 2 PM to 4 PM in the prospect's local time zone. Use a local area code on your caller ID. Leave voicemails on every attempt — 20-30% of prospects call back from a good voicemail. Send a direct mail piece before calling so your name is already familiar."),
      h2("Why It Matters for Aged Leads"),
      block("Most agents who fail with aged leads blame lead quality when the real problem is contact rate. If your contact rate is 8% and you only buy 50 leads, you will talk to 4 people. That is not enough volume to produce consistent results. The solution is either improving contact rate through better timing, multi-channel outreach, and persistence, or increasing volume to compensate. The best aged lead agents achieve 15-20% phone contact rates by combining strategic call timing with voicemail drops, direct mail, and email touches."),
    ],
  },
  {
    slug: "conversion-rate",
    body: [
      h2("Understanding Conversion Rate"),
      block("Conversion rate measures the percentage of total leads purchased that result in a sale, regardless of whether you contacted them. This is different from close rate, which only measures prospects you actually spoke with. If you buy 500 aged leads and make 8 sales, your conversion rate is 1.6%. Conversion rate is your bottom-line performance metric — it accounts for contact rate, close rate, and everything in between."),
      h2("How It Works in Practice"),
      block("Here is the funnel math for a typical aged lead campaign. You buy 500 leads at $1 each — $500 total investment. Your contact rate is 12%, so you reach 60 people. Your close rate is 10% of contacts, so you close 6 deals. That gives you a 1.2% conversion rate on total leads purchased. If your average commission is $600 per deal, you earn $3,600 from a $500 investment — a 620% ROI. The math works because volume compensates for the lower per-lead conversion rate."),
      block("Conversion rates by vertical: final expense aged leads convert at 2-5%, Medicare at 2-4%, mortgage at 1-2%, solar at 1-3%, auto insurance at 1-3%, and SSDI at 3-5%. These benchmarks assume consistent multi-touch follow-up over 10-14 days with at least 5 contact attempts per lead."),
      h2("Why It Matters for Aged Leads"),
      block("Conversion rate is where aged leads prove their value. Real-time leads convert at higher rates individually — 5-15% — but cost 10-50x more per lead. When you calculate cost per acquisition, aged leads almost always win. A 2% conversion rate at $1 per lead means $50 per customer acquired. A 10% conversion rate at $30 per lead means $300 per customer acquired. Tracking conversion rate by lead age, lead type, and outreach method lets you optimize your spend and focus on the combinations that produce the best returns."),
    ],
  },
  {
    slug: "cost-per-lead",
    body: [
      h2("Understanding Cost Per Lead"),
      block("Cost per lead (CPL) is the total cost to acquire a single lead, calculated by dividing your total lead spend by the number of leads received. CPL is the starting point for all lead economics — it determines how many prospects your budget can reach and directly impacts your cost per acquisition. In the aged lead market, CPL ranges from $0.25 to $5 per record, compared to $15 to $75 for real-time leads depending on the vertical."),
      h2("How It Works in Practice"),
      block("Real-time lead pricing by vertical: final expense $12-25, Medicare $15-35, mortgage $20-75, solar $20-50, auto insurance $8-20, SSDI $15-40. Aged lead pricing for the same verticals: final expense $0.50-3, Medicare $1-4, mortgage $1-5, solar $1-4, auto insurance $0.25-2, SSDI $1-3. The discount increases with lead age — 30-day leads cost more than 90-day leads, and 90-day leads cost more than 180-day leads."),
      block("The real calculation is cost per acquisition (CPA), not cost per lead. CPA equals your CPL divided by your conversion rate. At $1 CPL and 2% conversion, your CPA is $50. At $25 CPL and 10% conversion, your CPA is $250. Even though real-time leads convert at 5x the rate, their 25x higher cost means aged leads produce a lower CPA in most scenarios."),
      h2("Why It Matters for Aged Leads"),
      block("CPL controls your ability to scale. A $500 monthly budget buys 15-20 real-time leads or 250-1,000 aged leads. More leads mean more conversations, more practice, and more chances to close. For new agents especially, the low CPL of aged leads provides the volume needed to develop skills without risking large budgets. Experienced agents use low CPL to maximize ROI — they know their conversion rate, so they can calculate exactly how much lead spend produces a target income."),
    ],
  },
  {
    slug: "crm",
    body: [
      h2("Understanding CRM"),
      block("A CRM (Customer Relationship Management) system is software that organizes your leads, tracks your interactions, and manages your sales pipeline. For aged lead professionals, a CRM is not optional — it is the difference between organized follow-up that produces sales and chaotic dialing that wastes leads. Without a CRM, you cannot track which leads you have called, when to follow up, or where each prospect stands in your pipeline."),
      h2("How It Works in Practice"),
      block("When you purchase a batch of aged leads, you import them into your CRM. The system should track: lead source and purchase date, every call attempt with date, time, and outcome, every email and text sent, the prospect's current status (new, contacted, interested, appointment set, quoted, sold, dead), scheduled follow-up dates, and notes from each conversation. Popular CRMs for aged lead professionals include Close, GoHighLevel, Salesforce, HubSpot, and Zoho. Many dialers like Mojo and PhoneBurner include basic CRM functionality."),
      block("Set up your CRM with pipeline stages that match your sales process: New Lead, Contact Attempted, Contacted, Appointment Set, Quoted or Presented, Closed Won, Closed Lost, and Recycle. Move leads through stages as you work them. Set automated reminders for follow-up so no lead falls through the cracks."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads require more touches than real-time leads — typically 5-7 attempts over 10-14 days. Without a CRM tracking each attempt, you will lose track of where you are with each prospect. You will call people twice in one day and miss others entirely. You will forget what a prospect told you and sound unprofessional when you call back. A CRM turns a pile of leads into a systematic, repeatable sales process. Agents who use a CRM consistently close 30-50% more deals than agents who rely on spreadsheets or memory."),
    ],
  },
  {
    slug: "data-hygiene",
    body: [
      h2("Understanding Data Hygiene"),
      block("Data hygiene is the process of cleaning, validating, and maintaining lead data to ensure accuracy before you begin outreach. Bad data wastes time and money — disconnected phone numbers, wrong addresses, deceased individuals, and duplicate records all reduce your effective contact rate and can create compliance problems. For aged leads, data hygiene is especially important because information degrades over time. People move, change phone numbers, and update email addresses."),
      h2("How It Works in Practice"),
      block("A thorough data hygiene process includes several steps. DNC scrubbing removes numbers on the federal and state Do Not Call registries — calling these numbers can result in fines of $500-$43,000 per violation. NCOA (National Change of Address) processing updates mailing addresses using USPS data. Phone validation identifies disconnected, reassigned, and wireless numbers. Email verification removes invalid addresses that would hurt your sender reputation. Deduplication removes duplicate records so you do not contact the same person multiple times from different lead batches."),
      block("Run data hygiene before every campaign, not after. Services like DNC.com, Melissa Data, and BriteVerify handle most of these checks automatically. Expect to remove 10-25% of records from a typical aged lead batch due to disconnected numbers, DNC matches, and invalid data. This is normal and actually improves your results by focusing your effort on reachable prospects."),
      h2("Why It Matters for Aged Leads"),
      block("The older the lead, the more important data hygiene becomes. A 30-day-old lead has minimal data decay. A 180-day-old lead may have 15-20% outdated phone numbers and 5-10% moved addresses. Skipping data hygiene on old leads means spending time dialing disconnected numbers and mailing letters to empty houses. Worse, failing to scrub against DNC lists creates legal liability. A $500 batch of aged leads with proper data hygiene outperforms a $500 batch without it by 20-30% in effective contact rate."),
    ],
  },
  {
    slug: "dialer",
    body: [
      h2("Understanding Dialers"),
      block("A dialer is software or hardware that automates the process of placing outbound phone calls. Instead of manually dialing each number, looking up records, and waiting through rings, a dialer handles the mechanical work so you can focus on conversations. For aged lead professionals making 100-300 calls per day, a dialer is essential — manual dialing limits you to 30-50 calls per day, which is not enough volume to produce consistent results."),
      h2("How It Works in Practice"),
      block("There are three main types of dialers, each suited to different situations. A preview dialer shows you the lead record before connecting the call, giving you time to review notes and prepare. This is best for high-value leads or complex products like mortgage or solar where personalization matters. A progressive dialer automatically dials the next number as soon as you finish a call, keeping a steady pace without preview time. This works well for simple products like auto insurance or final expense where scripts are straightforward."),
      block("A predictive dialer uses algorithms to dial multiple numbers simultaneously, connecting you only when someone answers. Predictive dialers maximize talk time but can create compliance issues — the FCC requires that abandoned calls (where no agent is available when someone answers) stay below 3%. Predictive dialers are best for large teams with 5+ agents. Popular dialers for aged lead work include Mojo (triple-line power dialer), PhoneBurner (single-line with voicemail drop), ReadyMode, and Five9."),
      h2("Why It Matters for Aged Leads"),
      block("Aged lead success is a volume game. A preview dialer lets a solo agent make 80-120 calls per day. A progressive dialer pushes that to 150-200. A power dialer like Mojo can reach 250-300 dials per day. At a 12% contact rate, that is the difference between 10 conversations and 36 conversations per day. More conversations mean more sales. Choose your dialer based on team size, product complexity, and compliance requirements. Start with a preview or progressive dialer if you are new to aged leads, then scale up as your volume grows."),
    ],
  },
  {
    slug: "dnc-list",
    body: [
      h2("Understanding the DNC List"),
      block("The Do Not Call (DNC) list is a registry maintained by the Federal Trade Commission (FTC) where consumers can register their phone numbers to opt out of telemarketing calls. There are two types: the National DNC Registry, which contains over 240 million numbers, and individual company DNC lists that you must maintain based on anyone who asks you to stop calling. Violating DNC rules carries penalties of $500 to $51,744 per call, depending on whether the violation was willful."),
      h2("How It Works in Practice"),
      block("Before calling any batch of aged leads, you must scrub your list against the National DNC Registry. Access costs $75 per year for up to 5 area codes at telemarketing.donotcall.gov. You must also maintain your own internal DNC list of anyone who has ever told you or your company to stop calling — this list never expires. Some states maintain their own DNC lists with additional requirements. California, Texas, Florida, Indiana, and Pennsylvania are among the strictest."),
      block("The scrubbing process is straightforward: upload your lead list to a DNC scrubbing service, which cross-references each number against federal and state registries. Numbers that match are flagged and removed from your calling list. Services like DNC.com and Gryphon Networks automate this process. Keep records of every scrub — date, list size, results — as proof of compliance in case of complaints."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads carry elevated DNC risk because prospects may have registered after their initial inquiry. Someone who filled out a form six months ago and then added their number to the DNC registry is off-limits for telemarketing calls. An established business relationship (EBR) exemption exists for companies that have sold to the consumer within the last 18 months, but lead buyers typically do not qualify for EBR. Always scrub, always document, and always honor stop-calling requests immediately. The cost of compliance is negligible compared to the cost of a single FTC complaint."),
    ],
  },
  {
    slug: "door-knocking",
    body: [
      h2("Understanding Door Knocking"),
      block("Door knocking is the practice of visiting prospects at their homes without a prior appointment, using the lead's address to show up in person. It is the oldest and still one of the most effective sales channels for aged leads, particularly in the final expense, Medicare, and home improvement verticals. Door knocking produces contact rates of 35-50% — two to five times higher than phone calling — and conversion rates that are consistently the highest of any outreach channel."),
      h2("How It Works in Practice"),
      block("Effective door knocking with aged leads follows a specific workflow. First, sort your leads geographically and plan a route covering 20-30 doors per day within a defined area. Bring a clipboard, printed lead cards with the prospect's name and original inquiry date, business cards, and product materials. Knock firmly, step back from the door, and smile. When they answer, reference their inquiry: 'Hi, my name is [Name]. You requested information about life insurance coverage a few months ago. I was in the neighborhood and wanted to stop by to see if you still need help with that.'"),
      block("Best times for door knocking are Tuesday through Saturday, 10 AM to 6 PM. Saturday mornings are especially productive for working households. If no one answers, leave a door hanger or personal note with your card — 10-15% of these generate callback responses. The best lead types for door knocking are final expense, Medicare, solar, roofing, and home services where the product requires a home visit anyway."),
      h2("Why It Matters for Aged Leads"),
      block("Door knocking transforms aged leads from a numbers game into a relationship-building channel. When you show up in person, you demonstrate effort and commitment that phone callers cannot match. Seniors especially respond to face-to-face interaction — final expense agents who door knock report close rates of 25-40% on contacts, compared to 5-15% over the phone. The geographic constraint means you need leads sorted by ZIP code, but the ROI justifies the planning. Many top-producing final expense agents work exclusively through door knocking aged leads, earning $150,000 or more annually on lead spend under $500 per month."),
    ],
  },
  {
    slug: "drip-campaign",
    body: [
      h2("Understanding Drip Campaigns"),
      block("A drip campaign is an automated sequence of emails, texts, or mailers sent to prospects on a predetermined schedule. Each message builds on the previous one, gradually educating the prospect and moving them toward a decision. For aged leads, drip campaigns serve as a low-cost, passive follow-up channel that works alongside active outreach like phone calls and door knocking."),
      h2("How It Works in Practice"),
      block("A proven email drip sequence for aged leads follows this pattern. Day 1: Introduction email — reference their original inquiry, introduce yourself, explain how you can help. Day 3: Value email — share a helpful tip, cost comparison, or industry insight relevant to their need. Day 7: Social proof email — include a brief client success story or testimonial. Day 14: Urgency email — mention a rate change, enrollment deadline, or limited-time benefit. Day 21: Final check-in — ask if they have found a solution or if you can still help."),
      block("Keep emails plain text, not HTML. Use a personal tone as if writing to one person. Subject lines should be conversational: 'Quick question about your insurance inquiry' or 'Still looking for the right mortgage rate?' Open rates for aged lead drip campaigns average 18-28% when using plain text and personal subject lines. Response rates of 2-5% are typical, with most responses coming from emails 2-4 in the sequence."),
      h2("Why It Matters for Aged Leads"),
      block("Drip campaigns catch the prospects you cannot reach by phone. Some people never answer calls from unknown numbers but read every email. Others need multiple impressions before they respond to any outreach. A drip campaign runs automatically in the background, touching hundreds of prospects without additional effort from you. When combined with phone calls and direct mail, drip campaigns contribute to the multi-touch approach that produces 80% of aged lead sales. Set up your drip once, apply it to every new lead batch, and let it generate responses while you focus on active outreach."),
    ],
  },
  {
    slug: "exclusive-lead",
    body: [
      h2("Understanding Exclusive Leads"),
      block("An exclusive lead is sold to only one buyer, meaning you are the only sales professional who receives that prospect's contact information. This contrasts with shared leads, which are sold to multiple buyers — typically 3-8 agents. Exclusive leads cost more but eliminate competition, giving you the only opportunity to close that prospect. In the real-time market, exclusive leads can cost 2-5x more than shared leads. In the aged lead market, the premium is smaller — typically 50-100% more than shared aged leads."),
      h2("How It Works in Practice"),
      block("An exclusive aged insurance lead might cost $3-8, while the same lead shared would cost $1-3. The exclusive buyer has a significant advantage: the prospect has not been contacted by multiple agents, so they are less likely to be fatigued or annoyed by sales calls. This translates to higher contact rates (prospects are more willing to engage) and higher close rates (no competing offers to compare against). However, the economics do not always favor exclusive leads."),
      block("Consider this comparison: $500 buys approximately 100 exclusive aged leads at $5 each, or 500 shared aged leads at $1 each. Even if exclusive leads convert at 3x the rate of shared leads (6% vs 2%), the shared leads produce more total sales: 10 sales from shared vs 6 from exclusive. The exclusive route produces better per-lead metrics but fewer total deals for the same budget."),
      h2("Why It Matters for Aged Leads"),
      block("The exclusive vs shared decision depends on your sales style and capacity. If you are a solo agent who can only handle 50-100 leads per week, exclusive leads maximize your results per lead. If you are running a team with dialer capacity for 500+ leads per week, shared leads provide the volume needed to keep agents productive. Many successful aged lead operations use a hybrid approach — exclusive leads for high-value verticals like mortgage and solar, shared leads for volume verticals like auto insurance and final expense."),
    ],
  },
  {
    slug: "follow-up-cadence",
    body: [
      h2("Understanding Follow-Up Cadence"),
      block("Follow-up cadence is the planned sequence and timing of contact attempts with a prospect. It defines when you call, email, mail, or visit — and how many times. Research consistently shows that 80% of sales require 5-7 contact attempts, but 44% of salespeople give up after a single follow-up. For aged leads, where the prospect has already expressed interest, a structured cadence is the difference between a 1% conversion rate and a 4% conversion rate."),
      h2("How It Works in Practice"),
      block("The proven aged lead cadence spans 14 days across multiple channels. Day 1: Send a personal letter or yellow letter via direct mail to prime the prospect. Day 3: First phone call — use the Honest Follow-Up approach and reference their inquiry. Leave a detailed voicemail if no answer. Day 4: Send a plain-text email referencing your call and letter. Day 7: Second phone call at a different time of day than the first attempt. Day 10: Door knock if local, or send a second email with a specific value proposition or testimonial. Day 14: Final phone attempt with a closing message. After 14 days with no contact, move the lead to a passive drip campaign or recycle it in 60 days."),
      h2("Why It Matters for Aged Leads"),
      block("Without a defined cadence, agents either over-contact prospects (calling three times in two days, which feels aggressive) or under-contact them (one call, no voicemail, move on). Both approaches waste leads. A structured cadence spaces contacts appropriately, uses multiple channels to reach different communication preferences, and ensures every lead gets a fair chance to convert. The agents who earn the most with aged leads are not the most talented closers — they are the most disciplined followers of a consistent cadence. Track your cadence completion rate: what percentage of leads receive all planned touches? If it is below 80%, you are leaving money on the table."),
    ],
  },
  {
    slug: "lead-age",
    body: [
      h2("Understanding Lead Age"),
      block("Lead age refers to the number of days since a prospect originally submitted their information — the time between their initial inquiry and when you purchase the lead. A 30-day-old lead was generated one month ago. A 180-day-old lead is six months old. Lead age directly impacts both the price you pay and the conversion rate you can expect. Generally, older leads cost less but convert at lower rates, though the relationship is not always linear."),
      h2("How It Works in Practice"),
      block("Sweet spots vary by vertical. For insurance leads (final expense, Medicare, life), the ideal age range is 30-90 days — old enough to be affordable but recent enough that the prospect's need is likely unchanged. For mortgage leads, 60-120 days works well because mortgage shopping is a longer process and prospects often have not found a lender after their initial search. Solar leads perform best at 30-90 days since homeowner interest in solar tends to persist. SSDI leads have the longest useful life — 90-360 days — because disability claims take months or years to resolve and claimants remain in need of legal help throughout."),
      block("Pricing follows lead age predictably. A 30-day insurance lead might cost $3-5, a 90-day lead $1-2, and a 180-day lead $0.50-1. The conversion rate decline is typically 30-50% between each tier. A 30-day lead converting at 4% and a 90-day lead converting at 2% may produce similar ROI because the 90-day lead costs 60% less."),
      h2("Why It Matters for Aged Leads"),
      block("Understanding lead age economics lets you optimize your budget. New agents should start with 60-90 day leads — fresh enough to convert well, affordable enough to buy volume. Experienced agents can profitably work 120-180 day leads because their refined scripts and multi-channel outreach compensate for the lower baseline conversion rate. Never assume older means worse. A 120-day lead from someone who genuinely needs insurance is more valuable than a 7-day lead from someone who was just comparison shopping. The prospect's underlying need matters more than the calendar date."),
    ],
  },
  {
    slug: "lead-recycling",
    body: [
      h2("Understanding Lead Recycling"),
      block("Lead recycling is the practice of re-working leads that were not contacted or did not convert during your initial outreach cadence. Instead of discarding these leads after your 14-day follow-up sequence, you set them aside for a cooling period and then re-engage them with a fresh approach. Recycling extracts additional value from leads you have already paid for, effectively lowering your cost per lead and increasing overall ROI."),
      h2("How It Works in Practice"),
      block("After completing your initial 14-day cadence with no contact or no conversion, move the lead into a recycle queue. Wait 30-60 days before re-engaging — this cooling period is important because prospects who were avoiding you may be more receptive after a break. When you re-engage, change your approach. If you called first, try direct mail or email. If you used a formal script, try a casual check-in: 'I reached out a couple months ago about your insurance inquiry. Just wanted to circle back and see if you ever found the coverage you were looking for.'"),
      block("You can recycle leads 2-3 times with diminishing but still positive returns. First recycle typically produces 40-60% of the original campaign's conversion rate. Second recycle produces 20-30%. Beyond that, the effort rarely justifies the return. Between recycle attempts, keep leads on a passive email drip so they continue seeing your name even during the cooling period."),
      h2("Why It Matters for Aged Leads"),
      block("Lead recycling is where aged lead economics become exceptional. You buy a lead once but work it multiple times. A $1 lead that you recycle twice effectively costs $0.33 per attempt. If you convert on the second or third try, your actual cost per lead for that sale drops dramatically. Many aged lead professionals report that 15-25% of their total sales come from recycled leads. These are sales that would have been lost entirely without a systematic recycling process. Build recycling into your workflow from day one — it is not an afterthought, it is a core part of the aged lead strategy."),
    ],
  },
  {
    slug: "lead-validation",
    body: [
      h2("Understanding Lead Validation"),
      block("Lead validation is the process of verifying that a lead's contact information is accurate and that the prospect is a real person who genuinely expressed interest. Validation happens at two levels: the vendor validates leads before selling them, and the buyer can perform additional validation after purchase. The goal is to ensure you are spending time and money reaching real, reachable prospects rather than fake, outdated, or fraudulent records."),
      h2("How It Works in Practice"),
      block("Reputable lead vendors validate several data points before selling aged leads. Phone validation checks whether the number is active, disconnected, or reassigned to a new person. Email verification confirms the address exists and can receive mail. Address validation confirms the physical address through USPS databases. Identity verification cross-references the name, phone, and address to confirm they belong to the same person. Some vendors also check for duplicate submissions and bot-generated entries."),
      block("After purchase, you can run your own validation layer. Use a service like Melissa Data, BriteVerify, or Xverify to re-validate phone numbers and emails — data degrades over time, so what was valid 90 days ago may not be valid today. Cross-reference addresses against NCOA data to catch prospects who have moved. A 5-minute validation step on a batch of 500 leads can save hours of wasted calling time."),
      h2("Why It Matters for Aged Leads"),
      block("Validation quality varies dramatically between vendors, and it directly impacts your results. A vendor selling unvalidated aged leads at $0.50 each may seem cheaper than a vendor selling validated leads at $1.50 each, but if 30% of the cheap leads have bad data, your effective cost per reachable lead is actually higher. Always ask vendors what validation steps they perform and when the data was last validated. The best vendors re-validate before each sale. Budget for your own validation layer as well — the $50-100 cost to scrub a batch of 500 leads typically pays for itself in saved time and improved contact rates."),
    ],
  },
  {
    slug: "multi-channel-outreach",
    body: [
      h2("Understanding Multi-Channel Outreach"),
      block("Multi-channel outreach is the strategy of contacting prospects through multiple communication channels — phone, email, direct mail, door knocking, text, and social media — rather than relying on a single channel. Each channel reaches a different segment of your prospects. Some people never answer phone calls from unknown numbers but read every email. Others ignore email but respond immediately to a knock at the door. Using multiple channels ensures you reach the widest possible audience from your lead list."),
      h2("How It Works in Practice"),
      block("Channels ranked by effectiveness for aged leads: Door knocking leads with a 35-50% contact rate and the highest close rates of any channel. Phone calling delivers 8-18% contact rates and allows immediate qualification. Direct mail achieves 40-60% open rates with personal letters and builds familiarity before other touches. Email provides 18-28% open rates with plain-text messages and scales effortlessly. SMS reaches 30-45% read rates but requires explicit TCPA consent. Social media (connecting on Facebook or LinkedIn) works as a supplementary touch."),
      block("The key is channel layering — using channels in sequence so each one reinforces the others. Send a letter first so the prospect recognizes your name when you call. Reference the letter in your voicemail. Follow up with an email that links to a helpful resource. Each touch builds familiarity and trust, making the next touch more effective. Studies show that prospects contacted through 3+ channels are 287% more likely to convert than those contacted through a single channel."),
      h2("Why It Matters for Aged Leads"),
      block("Single-channel agents leave most of their leads unconverted. If you only call, you never reach the 40% of people who screen calls. If you only email, you miss the seniors who rarely check email. If you only door knock, you are limited to local leads. Multi-channel outreach is especially important for aged leads because these prospects have already been called by other agents. Reaching them through a channel nobody else used — a personal letter, a door visit — differentiates you and dramatically increases your odds of conversion."),
    ],
  },
  {
    slug: "objection-handling",
    body: [
      h2("Understanding Objection Handling"),
      block("Objection handling is the skill of responding to a prospect's concerns, hesitations, or reasons for not buying in a way that addresses the underlying issue and moves the conversation forward. In aged lead work, objections are predictable — the same five objections account for roughly 80% of all resistance you will encounter. Preparing thoughtful responses to these common objections is one of the highest-leverage activities in aged lead sales."),
      h2("How It Works in Practice"),
      block("The top five objections from aged lead prospects and how to handle them. First: 'I already have coverage' or 'I already found someone.' Response: 'That is great to hear. Many people I work with had coverage but found they were overpaying or underinsured. Would it be worth a quick comparison to make sure you are getting the best value?' Second: 'I never filled out a form' or 'I do not remember.' Response: 'I understand — it was a while ago. You may have been researching options online. Regardless, I specialize in helping people find the right coverage and I am happy to answer any questions.'"),
      block("Third: 'I am not interested.' Response: 'I appreciate you being direct. Before I let you go — has your situation changed since you were looking, or is coverage still something you need?' Fourth: 'Send me information.' Response: 'I would be happy to. What specifically would be most helpful for me to include? That way I can tailor it to your situation.' This re-engages them in conversation. Fifth: 'How did you get my number?' Response: 'You submitted an online inquiry about [product] a few months ago. I am following up to see if I can help.'"),
      h2("Why It Matters for Aged Leads"),
      block("Aged lead prospects object more frequently than real-time leads because time has passed since their initial interest. But their objections are often softer than they sound — 'I already found someone' sometimes means 'I settled for something but am not thrilled.' The agent who handles objections with empathy and curiosity rather than pressure will uncover opportunities that pushy agents miss. Practice these five responses until they are natural, and you will convert prospects that most agents abandon after the first objection."),
    ],
  },
  {
    slug: "pipeline",
    body: [
      h2("Understanding Pipeline"),
      block("A sales pipeline is a visual and organizational framework that tracks where each prospect stands in your sales process, from initial contact to closed deal. It divides your sales workflow into stages, with leads moving from one stage to the next as they progress toward a purchase. For aged lead professionals, pipeline management is critical because you are juggling hundreds of leads simultaneously across different stages of engagement."),
      h2("How It Works in Practice"),
      block("An effective aged lead pipeline has these stages: New Lead (purchased, not yet contacted), Contact Attempted (called or mailed, no response yet), Contacted (spoke with the prospect), Interested or Qualified (prospect confirmed need and willingness), Appointment Set (formal meeting or presentation scheduled), Quoted or Presented (proposal delivered), Negotiation (handling objections, answering questions), Closed Won (sale completed), Closed Lost (prospect declined), and Recycle (re-engage later). Each stage should have a clear definition and a maximum time limit before the lead moves to the next stage or drops to recycle."),
      block("Review your pipeline daily. Know exactly how many leads are in each stage. If your Appointment Set stage is empty, you have a prospecting problem. If Quoted is full but Closed Won is empty, you have a closing problem. The pipeline tells you where your process is breaking down and where to focus your effort."),
      h2("Why It Matters for Aged Leads"),
      block("Without pipeline management, aged leads disappear into chaos. You buy 500 leads, call 50 of them, lose track of 200, forget to follow up with 30 interested prospects, and wonder why your results are poor. The pipeline enforces accountability — every lead has a status, every status has a next action, and nothing falls through the cracks. Agents who manage their pipeline consistently report 40-60% higher conversion rates than agents who work leads in an ad hoc fashion. Your pipeline is your business — treat it accordingly."),
    ],
  },
  {
    slug: "pre-qualification",
    body: [
      h2("Understanding Pre-Qualification"),
      block("Pre-qualification is the process of quickly determining whether a prospect is eligible and likely to purchase your product or service before investing significant time in a full presentation. For aged lead professionals, pre-qualification is essential because your time is your most valuable resource — spending 30 minutes presenting to an unqualified prospect costs you five or six calls to qualified prospects you could have made instead."),
      h2("How It Works in Practice"),
      block("Use a 5-question framework to pre-qualify aged lead prospects in under 3 minutes. Question 1: Confirm the need — 'Are you still looking for [insurance/mortgage/solar] coverage?' This filters out prospects who have already purchased elsewhere. Question 2: Confirm timing — 'Is this something you are looking to take care of in the next 30 days?' This separates active buyers from casual browsers. Question 3: Confirm eligibility — ask the one or two questions that determine product eligibility (age, health status, property ownership, income, etc.). Question 4: Confirm decision-making — 'Is there anyone else involved in this decision?' This prevents surprises later. Question 5: Confirm budget expectation — 'Most of our clients pay between $X and $Y per month. Is that in the range you were expecting?' This surfaces price objections early."),
      block("If a prospect answers favorably to all five questions, they are qualified — move to a full presentation or appointment. If they fail on one or two, address those concerns before proceeding. If they fail on three or more, politely end the conversation and move to the next lead."),
      h2("Why It Matters for Aged Leads"),
      block("Pre-qualification multiplies your effective selling time. If you spend 3 minutes qualifying and 20 minutes presenting, you can qualify 15 prospects and present to the 5 best ones in a 3-hour calling session. Without pre-qualification, you might present to 6 random prospects and discover that 4 of them were never going to buy. The 5-question framework works because it covers the five reasons deals fail: no need, no urgency, no eligibility, no authority, and no budget. Catching these disqualifiers early saves hours per week and dramatically improves your close rate on presentations."),
    ],
  },
  {
    slug: "real-time-lead",
    body: [
      h2("Understanding Real-Time Leads"),
      block("A real-time lead is a prospect's contact information delivered to the buyer within seconds or minutes of the prospect submitting their inquiry. When someone fills out an online form requesting insurance quotes, that form submission is instantly routed to one or more sales professionals who race to call the prospect while their interest is fresh. Real-time leads represent the premium tier of the lead market, priced at $15 to $75 depending on the vertical and whether the lead is exclusive or shared."),
      h2("How It Works in Practice"),
      block("The real-time lead model rewards speed above all else. Industry data shows that calling within 5 minutes of form submission produces contact rates of 50-70% and conversion rates of 5-15%. After 30 minutes, contact rates drop to 20-30%. After 24 hours, they fall to 10-15% — approaching aged lead territory. This creates an intensely competitive environment where agents must be available to call immediately, often competing with 3-8 other agents who received the same lead simultaneously."),
      block("Real-time leads are ideal for agents who can dedicate their full day to inbound lead response, have a CRM with instant lead notification, and sell a product with a short sales cycle. They are less ideal for part-time agents, those building a practice, or those who want predictable daily calling schedules."),
      h2("Why It Matters for Aged Leads"),
      block("Real-time and aged leads are not competitors — they are complements. Real-time leads provide high-conversion opportunities when you are available to act instantly. Aged leads provide consistent, predictable volume that you can work on your own schedule. Many successful agents allocate 20-30% of their lead budget to real-time leads for quick wins and 70-80% to aged leads for volume and ROI. The agents who rely exclusively on real-time leads often struggle with cost and inconsistency. The agents who add aged leads to their mix build more stable, profitable businesses."),
    ],
  },
  {
    slug: "shared-lead",
    body: [
      h2("Understanding Shared Leads"),
      block("A shared lead is sold to multiple buyers simultaneously, typically 3-8 agents or companies. When a consumer fills out a form requesting insurance quotes, that form submission may be delivered to five different agents at the same time. Shared leads cost less than exclusive leads — often 50-75% less — because the vendor generates more revenue per lead by selling it multiple times. In the aged lead market, shared leads dominate because the original real-time lead was already sold to multiple buyers before it aged."),
      h2("How It Works in Practice"),
      block("When working shared aged leads, you are competing with other agents who purchased the same record. However, competition is less intense than with shared real-time leads for several reasons. First, most agents have already given up on the lead — they tried once or twice when it was fresh and moved on. Second, not all buyers of the aged lead will actually call it. Third, months have passed, so the prospect has likely forgotten who called before. Your advantage with shared aged leads is persistence and approach, not speed."),
      block("Competition strategies for shared leads: differentiate through channel — if others are calling, send a personal letter. Differentiate through value — offer a specific benefit or comparison rather than a generic pitch. Differentiate through timing — call at unusual hours when other agents are not calling. And differentiate through follow-up — most competitors make 1-2 attempts. Making 5-7 attempts puts you in front of prospects that others abandoned."),
      h2("Why It Matters for Aged Leads"),
      block("Shared aged leads offer the best ROI in the lead industry. At $0.50 to $2 per lead, you can build massive outreach campaigns on modest budgets. The competition factor is real but manageable — in practice, you are competing against agents who buy leads and barely work them. Being systematic, persistent, and multi-channel gives you an enormous advantage over the majority of shared lead buyers. The math works: 500 shared leads at $1 each with a 2% conversion rate produces 10 sales from a $500 investment."),
    ],
  },
  {
    slug: "speed-to-lead",
    body: [
      h2("Understanding Speed to Lead"),
      block("Speed to lead measures the time between when a prospect submits their information and when a salesperson makes first contact. For real-time leads, speed to lead is everything — calling within 5 minutes produces 8x higher conversion rates than calling after 30 minutes. This metric dominates real-time lead strategy and has created an industry obsession with immediate response. But for aged leads, speed to lead works fundamentally differently."),
      h2("How It Works in Practice"),
      block("With aged leads, the traditional speed-to-lead urgency does not apply because the lead is already days, weeks, or months old. Calling an aged lead 5 minutes after you buy it versus 2 hours after you buy it makes no meaningful difference — the lead was generated 90 days ago regardless. What matters instead is speed to systematic outreach: how quickly do you begin your structured follow-up cadence after purchasing a batch of leads?"),
      block("The optimal approach for aged leads is to begin your outreach cadence within 24-48 hours of purchase. This means importing leads into your CRM, running data hygiene, and starting your first touch (usually direct mail or phone) within one business day. The myth that aged leads need to be called immediately creates unnecessary stress and causes agents to skip important steps like DNC scrubbing and data validation."),
      h2("Why It Matters for Aged Leads"),
      block("Understanding that speed to lead is different for aged leads changes your workflow and mindset. You do not need to be chained to your phone waiting for leads to arrive. You can buy a batch of 500 leads on Monday, scrub and validate them Monday afternoon, send direct mail Tuesday, and begin calling Thursday — methodically and strategically. This controlled pace produces better results than frantic, unstructured calling because every step in the process — hygiene, mail, calling, follow-up — is executed properly. Speed matters, but for aged leads, speed of system execution matters more than speed of individual response."),
    ],
  },
  {
    slug: "tcpa",
    body: [
      h2("Understanding TCPA"),
      block("The Telephone Consumer Protection Act (TCPA) is a federal law that regulates telemarketing calls, text messages, and fax communications. Enacted in 1991 and updated repeatedly since, the TCPA imposes strict rules on how businesses can contact consumers by phone. Violations carry statutory damages of $500 per call or text, tripled to $1,500 for willful violations. Class action TCPA lawsuits regularly produce settlements in the millions of dollars. For aged lead professionals, TCPA compliance is not optional — it is a business survival requirement."),
      h2("How It Works in Practice"),
      block("Key TCPA rules for aged lead work. First, prior express written consent is required before using an autodialer or prerecorded message to call a cell phone. The lead form the prospect originally filled out may have included this consent, but you must verify the consent language and ensure it applies to your specific company — generic consent may not transfer to lead buyers. Second, the FCC's 2025 one-to-one consent rule requires that consent name a specific seller, making it harder for lead generators to sell broad consent across multiple buyers."),
      block("Third, you must scrub your calling list against the National DNC Registry before every campaign and honor all do-not-call requests within 30 days. Fourth, calls can only be made between 8 AM and 9 PM in the consumer's local time zone. Fifth, you must identify yourself and your company at the beginning of every call. Sixth, you must provide your phone number or address upon request. State laws may impose additional requirements — many states have their own mini-TCPA statutes with stricter rules."),
      h2("Why It Matters for Aged Leads"),
      block("Aged leads carry unique TCPA considerations because the consent was obtained by a different company at a different time. Always verify the consent language on the original lead form. Work with your lead vendor to obtain documentation of consent. Use a manual dialing process or click-to-call for cell phones if you cannot verify autodialer consent. Maintain meticulous records of every call, including date, time, number dialed, and outcome. TCPA compliance costs a few hundred dollars per year in scrubbing and documentation. TCPA violations can cost hundreds of thousands. The choice is obvious."),
    ],
  },
  {
    slug: "warm-lead",
    body: [
      h2("Understanding Warm Leads"),
      block("A warm lead is a prospect who has previously expressed interest in a product or service, making them more receptive to sales outreach than a completely cold contact. The warmth comes from intent — the prospect took an action indicating they have a need: filling out a form, requesting a quote, clicking an ad, attending a webinar, or downloading a resource. This prior engagement means they are already aware of the problem and are at least exploring solutions."),
      h2("How It Works in Practice"),
      block("Here is the critical insight that many agents miss: aged leads ARE warm leads. Every aged lead began as a real-time inquiry where a real person expressed genuine interest in a product or service. The passage of time does not erase the underlying need. Someone who requested final expense insurance quotes three months ago still needs final expense insurance. Someone who inquired about refinancing 90 days ago likely still has a mortgage they want to improve. The intent signal is the warmth, and intent persists far longer than most agents assume."),
      block("Re-warming aged leads is about reconnecting with that original intent. Reference their specific inquiry: 'You were looking at mortgage refinance options a few months back.' Acknowledge the time gap: 'I know it has been a while since you submitted that request.' Then re-engage: 'I wanted to check in and see if you ever found what you were looking for.' This approach validates their original interest and positions you as a helpful follow-up, not a cold caller."),
      h2("Why It Matters for Aged Leads"),
      block("The warm lead framework transforms how you approach aged leads. When you call a cold list, you expect rejection and brace for hostility. When you call warm leads — which is what aged leads are — you expect conversation and prepare for engagement. This mindset shift affects your tone, your energy, and your results. Re-warming strategies include referencing the original inquiry, sending a personal letter before calling, leading with value rather than a pitch, and using empathetic language that acknowledges their situation. Agents who treat aged leads as warm leads consistently outperform agents who approach them as cold calls. The difference is not technique — it is belief in the lead's value."),
    ],
  },
];

async function run() {
  // First, fetch all glossary terms to map slugs to IDs
  console.log("Fetching existing glossary terms...\n");
  const terms = await client.fetch('*[_type == "glossaryTerm"]{_id, "slug": slug.current, term}');
  const slugToId = {};
  for (const t of terms) {
    slugToId[t.slug] = t._id;
  }

  console.log(`Found ${terms.length} glossary terms in Sanity.\n`);
  console.log(`=== Expanding ${expansions.length} glossary terms with rich body content ===\n`);

  let success = 0;
  let failed = 0;

  for (const e of expansions) {
    const id = slugToId[e.slug];
    if (!id) {
      console.error(`  ✗ "${e.slug}" — not found in Sanity. Skipping.`);
      failed++;
      continue;
    }
    try {
      await client.patch(id).set({ body: e.body }).commit();
      console.log(`  ✓ ${e.slug} (${id})`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${e.slug} (${id}): ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Expanded ${success} terms, ${failed} failed.`);
}

run().catch(console.error);
