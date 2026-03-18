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

const playbooks = [
  {
    _id: "pb-7-day-aged-lead-cadence",
    _type: "playbook",
    title: "The 7-Day Aged Lead Follow-Up Cadence",
    slug: { _type: "slug", current: "7-day-aged-lead-follow-up-cadence" },
    difficulty: "beginner",
    estimatedTime: "18 min read",
    publishedAt: "2026-03-18T10:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-insurance"), ref("lt-final-expense"), ref("lt-mortgage")],
    seo: { metaTitle: "7-Day Aged Lead Follow-Up Cadence — Scripts, Templates & Day-by-Day Plan", metaDescription: "Complete 7-day multi-channel follow-up system for aged leads. Day-by-day scripts, email templates, voicemail scripts, and industry-specific adaptations." },
    excerpt: "A day-by-day multi-channel outreach sequence for working aged leads — direct mail, phone, email, and door knocking with scripts for each touch.",
    body: [
      block("I have been working aged leads for over 25 years. I have managed campaigns involving millions of lead records across mortgage, insurance, final expense, solar, and Medicare. And the single biggest predictor of whether an agent succeeds or fails with aged leads is follow-up discipline. Not talent. Not product knowledge. Not the quality of the leads. It is whether they show up consistently for seven days and work the system."),
      block("This cadence is the system I have refined across thousands of campaigns. It uses four channels over seven days to maximize your odds of reaching every lead. It is designed for aged leads specifically, where the prospect filled out a form weeks or months ago and may not remember the original inquiry. That context matters because it changes your approach entirely."),

      h2("Why This Cadence Works"),
      block("The data on follow-up is unambiguous. Research from the National Sales Executive Association shows that 80 percent of sales require five to seven contact attempts. Yet 44 percent of salespeople give up after a single attempt, and 94 percent give up after four. That gap between what the data demands and what most agents actually do is where your opportunity lives."),
      block("Multi-channel outreach outperforms single-channel by a wide margin. In my experience managing lead operations at scale, agents who use three or more channels see contact rates two to three times higher than phone-only agents. A letter in the mailbox primes the prospect to recognize your name when you call. An email gives them a low-friction way to respond when a phone call feels like too much. Door knocking converts at the highest rate of any channel for local leads."),
      block("The seven-day window matters too. Compress your touches too tightly and you feel like a stalker. Spread them too far apart and you lose momentum. Seven days with strategic spacing gives you enough frequency to be persistent without being obnoxious. After working millions of lead records, this is the timing that works."),

      h2("Before You Start: Prep Work"),
      block("Import your leads into your CRM or dialer. Every lead needs to be tracked so nothing falls through the cracks. If you are working from a spreadsheet, at minimum create columns for each touch attempt and the outcome."),
      block("Scrub your list against the Do Not Call registry. This is not optional. DNC violations carry fines of up to $50,000 per call, and aged lead lists can contain numbers that were added to the registry after the original inquiry. Scrub every time."),
      block("Segment by lead age and work the freshest leads first. A 30-day-old lead is more likely to convert than a 120-day-old lead. Prioritize accordingly. If you bought a mixed batch, sort them before you start dialing."),
      block("Prepare your direct mail pieces. If you are using yellow letters, print or handwrite them the day before you plan to mail. If you are using postcards, have them ready. The mail piece needs to go out on Day 1 so it arrives before your first call on Day 3."),

      h2("Day 1: Direct Mail — The Yellow Letter"),
      block("Your first touch is a physical letter, not a phone call. This is counterintuitive for most agents who want to get on the phone immediately. But mailing first accomplishes something critical: it puts your name in front of the prospect before you ever call. When they see your name on caller ID two days later, there is a flicker of recognition instead of a wall of suspicion."),
      block("The yellow letter is the most effective direct mail format for aged leads. It is a handwritten-style letter on yellow lined paper, stuffed in a plain white envelope with a hand-addressed label or actual handwriting. It looks personal. It gets opened. In my experience, yellow letters achieve open rates north of 90 percent because they do not look like marketing."),

      h3("Yellow Letter Template"),
      block("Here is the exact template I recommend. Adapt the bracketed sections for your industry:"),
      block("\"Hi [First Name], my name is [Your Name] and I help people in [City/Area] with [product — life insurance, mortgage rates, solar savings, etc.]. I noticed you had looked into this a while back, and I wanted to reach out personally. I am not sure if you were able to get what you needed, but if it is still on your to-do list, I would love to help. I will try to give you a call in a couple of days. In the meantime, you can reach me anytime at [phone number]. Looking forward to connecting. — [Your Name]\""),
      block("Keep the letter short. One page maximum. No brochures, no rate sheets, no business cards stuffed inside. The letter itself is the entire package. Its job is to create familiarity, not to sell."),

      h3("Handwritten vs. Printed"),
      block("Handwritten letters convert better, period. In testing across multiple campaigns, handwritten yellow letters outperform printed versions by 15 to 25 percent in response rate. But handwriting is not scalable if you are working 200 or more leads per week."),
      block("The compromise is a handwritten-font printed letter. Services like Yellow Letters Complete and Ballpoint Marketing print letters in realistic handwriting fonts on yellow paper. They are not as effective as genuine handwriting, but they are close, and they scale. If you are working fewer than 50 leads per week, handwrite them. Above that, use a print service."),

      h2("Day 3: First Phone Call"),
      block("Your letter should have arrived by now, depending on your local mail delivery times. Day 3 is your first phone call, and it is the most important call in the entire cadence. You are introducing yourself live for the first time, and how you handle the first 10 seconds determines whether the prospect hangs up or engages."),

      h3("The Honest Follow-Up Script"),
      block("This is my go-to opening for aged leads. It works because it is transparent about the situation. Aged lead prospects know their information has been circulating, and pretending otherwise insults their intelligence."),
      block("\"Hi [Name], this is [Your Name]. I sent you a letter earlier this week about [product]. I help people in [area] with [product], and I am following up on some older inquiry records. It does not look like we ever connected, so I wanted to see — were you able to get what you needed, or is this still something on your to-do list?\""),
      block("The phrase \"still on your to-do list\" is deliberate. It implies the prospect had unfinished business, which is often true. People who fill out lead forms and never act feel a low-grade guilt about the unresolved task. You are offering to help them check it off."),

      h3("The Warm Reconnect Script"),
      block("For leads that are 90 days or older, the Warm Reconnect works better because it acknowledges the time gap directly:"),
      block("\"Hi [Name], this is [Your Name]. I know it has been a while since you first looked into [product], and I am sure a lot has changed since then. I wanted to reach out because [rates have moved / new options are available / open enrollment is coming up]. Do you have two minutes so I can see if there is anything that might help your situation?\""),
      block("The key difference is the phrase \"a lot has changed.\" It gives the prospect permission to re-engage without feeling like they are picking up a stale conversation. It resets the relationship."),

      h3("Voicemail Best Practices"),
      block("You will hit voicemail on 70 to 80 percent of your calls. Your voicemail is not a throwaway — it is a marketing asset. A good voicemail gets callbacks. A bad one gets you blocked."),
      block("Keep it to 20 seconds maximum. State your name, the reason for your call, and your phone number. Speak your phone number slowly and repeat it. Do not pitch. Do not leave a long-winded message about your products or rates."),
      block("\"Hi [Name], this is [Your Name]. I sent you a letter about [product] and wanted to follow up. If you have a quick moment, give me a call back at [number — speak slowly]. Again, that is [repeat number]. No pressure either way. Talk soon.\""),

      h3("Best Calling Times by Industry"),
      block("Calling time matters more than most agents realize. In my experience across millions of dials, the optimal windows vary by industry. For insurance and final expense, the best window is 10 AM to 12 PM and 2 PM to 4 PM local time. Seniors are home, awake, and past their morning routines. For mortgage, call between 5 PM and 8 PM when borrowers are home from work. Saturday mornings from 9 AM to 12 PM are also excellent for mortgage. For solar, late afternoon and early evening work best, from 4 PM to 7 PM. Homeowners are getting home and thinking about their bills."),
      block("Whatever time you call on Day 3, note it. On Day 6, you will call at a different time to maximize your chances."),

      h2("Day 4: Email"),
      block("Send a plain-text email. This is critical. No HTML templates, no logos, no graphics, no marketing footers. Your email should look like it came from a real person, not a CRM. Plain-text emails consistently outperform HTML marketing emails for aged lead follow-up because they feel personal and bypass many spam filters."),

      h3("Insurance Email Template"),
      block("Subject: Following up on your coverage inquiry"),
      block("\"Hi [Name], I tried reaching you yesterday about your insurance coverage. I help people in [area] find the right coverage at the best rates, and I wanted to make sure you were able to get what you needed. If you have a quick moment, I would love to give you a no-obligation quote. You can reply to this email or call me at [number]. Either way, no pressure at all. — [Your Name]\""),

      h3("Mortgage Email Template"),
      block("Subject: Quick rate update for your mortgage"),
      block("\"Hi [Name], I left you a voicemail yesterday about mortgage rates. Since you first looked into this, rates have [moved — give direction]. Current 30-year fixed rates are around [X.XX%]. If you are still considering a [purchase/refinance], I can get you a personalized quote in about 5 minutes. Just reply to this email or give me a call at [number]. — [Your Name]\""),

      h3("Subject Line Testing"),
      block("Your subject line determines whether your email gets opened. For aged leads, subject lines that reference the original inquiry outperform generic lines by 40 to 60 percent. Test these pairs against each other: \"Following up\" vs. \"Quick question about your [product] inquiry.\" \"Checking in\" vs. \"Update on [product] rates in [area].\" Track your open rates and double down on what works."),

      h2("Day 5: Rest Day"),
      block("No contact today. Leave them alone. This is not laziness — it is strategy."),
      block("The psychology behind rest days in outreach cadences is well-documented. Constant contact triggers reactance, the psychological phenomenon where people resist persuasion when they feel their freedom is threatened. Three touches in three days is enough to establish presence. A one-day gap gives the prospect space to process your outreach and respond on their own terms."),
      block("In my experience, Day 5 is actually one of the highest callback days in the cadence. Your letter, voicemail, and email are all working in the background. The prospect has seen your name three times in four days, and the breathing room on Day 5 gives them the space to pick up the phone or reply to your email."),

      h2("Day 6: Second Phone Call"),
      block("Call at a different time than Day 3. If you called in the morning, try late afternoon. If you called during lunch, try early morning. Different times reach different people, and many prospects have predictable schedules that your first call might have missed entirely."),

      h3("The Reference Script"),
      block("Your Day 6 script should reference your previous touches. The prospect may have seen your letter, heard your voicemail, or read your email. Acknowledge it:"),
      block("\"Hi [Name], this is [Your Name] again. I have been trying to connect with you this week about [product] — I sent you a letter and an email as well. I know everyone is busy, so I wanted to try one more time. Were you able to get what you needed on the [insurance/mortgage/solar] front, or would it help to have a quick conversation?\""),
      block("The phrase \"one more time\" is important. It signals that you are not going to chase them forever, which paradoxically makes them more likely to engage. Nobody wants to feel hunted, but most people feel a social obligation to respond to someone who has made multiple polite attempts."),

      h3("Handling \"Stop Calling Me\""),
      block("If a prospect says \"stop calling me\" or \"take me off your list,\" comply immediately and cheerfully. Say: \"Absolutely, I will remove your number right now. I apologize for the inconvenience, and I hope you found what you were looking for.\" Then actually remove them. Mark the lead as DNC in your CRM. Do not call them again. This is both a legal requirement and good business practice."),
      block("Some agents argue with prospects who say stop calling. This is a terrible idea. It creates complaints, potential legal exposure, and it never converts anyway. Let them go."),

      h3("Handling \"I Already Found Someone\""),
      block("This is actually a buying signal in disguise. If they found someone, they were actively shopping. Respond with: \"That is great, I am glad you were able to take care of it. Just out of curiosity, were you happy with the [rate/coverage/quote] you got? If you ever want a second opinion or if anything changes, keep my number handy. I am always happy to help.\""),
      block("About 15 to 20 percent of \"I already found someone\" prospects will come back to you within 90 days if you leave the door open. Deals fall through. Rates change. Policies get declined. Be the backup they remember."),

      h2("Day 7: Final Touch"),
      block("Day 7 is your last touch in the primary cadence. Make it count. Your approach depends on whether you are working local or remote leads."),

      h3("Door Knocking for Local Leads"),
      block("Door knocking is the highest-converting final touch, particularly for final expense and insurance leads. If the prospect is within reasonable driving distance, showing up in person demonstrates commitment that no other channel can match."),
      block("Park on the street, not in their driveway. Walk up with nothing in your hands except a business card. Do not carry folders, brochures, or a bag. You want to look like a neighbor stopping by, not a salesperson doing a presentation."),
      block("\"Hi, are you [Name]? My name is [Your Name]. I have been trying to reach you this week about [product] — I sent you a letter and tried calling a couple of times. I was in the area and thought I would stop by and introduce myself. I help people in [neighborhood/city] with [product], and I just wanted to see if it is something you still need help with.\""),
      block("If they engage, your goal is to set an appointment, not to sell on the doorstep. Say: \"I would love to sit down with you for 10 minutes and show you what the options look like. Would tomorrow or [day] work better for you?\" Lock down a specific time. Get their phone number to confirm."),

      h3("Final Value Email for Remote Leads"),
      block("If you cannot door knock, send a value-packed final email that gives the prospect a concrete reason to respond."),
      block("Subject: One last thing — [specific value offer]"),
      block("\"Hi [Name], I have reached out a few times this week and I do not want to be a pest, so this will be my last email for now. Before I go, I wanted to share [one specific thing of value]: a free rate comparison / a savings estimate for your area / current enrollment options and deadlines. If you would like me to put this together for you, just reply with 'yes' and I will send it right over. If the timing is not right, no worries at all. I will check back in a couple of months. — [Your Name]\""),
      block("The \"reply with yes\" call to action works because it is the lowest possible friction. They do not have to compose a thoughtful reply. One word. That one word opens the conversation."),

      h2("After Day 7: The Recycle Strategy"),
      block("Most agents throw away leads that do not convert in the first cadence. This is a massive mistake. In my experience, 20 to 30 percent of total conversions from aged leads come on the second or third cycle through the list."),
      block("Move uncontacted leads to a recycle queue. Set a 60 to 90 day timer. When the timer fires, run them through the cadence again with a fresh approach. The prospect's circumstances may have changed. Maybe they lost the coverage they had. Maybe rates moved in their favor. Maybe they are finally ready to act on something they have been putting off."),

      h3("The Re-engagement Script"),
      block("When you call recycled leads, use this opening:"),
      block("\"Hi [Name], this is [Your Name]. We connected briefly a few months ago about [product], and I wanted to circle back because [reason — rates changed, open enrollment is coming, new options are available]. Is this still something you are thinking about, or did you get it handled?\""),
      block("Even if you never actually spoke to them, the phrase \"connected briefly\" is generous enough to be true — you did send a letter and emails. It creates a sense of existing relationship that makes them less likely to dismiss you as a cold caller."),
      block("I have seen agents close deals on the third and even fourth cycle through a lead. The cost of recycling is nearly zero since you already own the lead. The incremental ROI on recycled leads is often the highest in your entire operation."),

      h2("Adapting by Industry"),

      h3("Final Expense"),
      block("Final expense leads skew older, which changes your channel mix significantly. Prioritize direct mail and door knocking over email. Many seniors do not check email regularly, and some do not have email at all. Your yellow letter and in-person visit are your highest-converting touches."),
      block("Slow your phone script down. Speak clearly, not quickly. Seniors often screen calls, so your voicemail matters even more than usual. Consider calling from a local number since seniors are more likely to pick up local area codes."),
      block("On your door knock, dress professionally but not overdressed. A polo shirt and slacks are better than a suit. You want to feel approachable, not intimidating. Bring a simple rate card, not a glossy presentation."),

      h3("Mortgage"),
      block("Mortgage leads are rate-driven. Every touch should include a rate reference. In your letter, mention current rate ranges. In your voicemail, give the current 30-year fixed rate. In your email, lead with a rate comparison to what was available when they first inquired."),
      block("The timing of your cadence matters more for mortgage leads because rates change daily. If rates drop significantly during your 7-day cadence, use that as an excuse to accelerate your outreach. A genuine rate drop is the best reason to call someone because it provides immediate, tangible value."),
      block("Mortgage leads also respond well to pre-qualification offers. Positioning your call as \"I can tell you in 5 minutes what rate you qualify for\" is a powerful hook because it gives them free information with no commitment."),

      h3("Solar"),
      block("Solar leads are savings-driven and often geographically concentrated. Include a savings estimate or incentive update in every email touch. Federal and state incentive deadlines create natural urgency that you should reference."),
      block("Solar leads are excellent candidates for door knocking because the product is tied to their physical home. When you show up, you can reference their roof orientation, their utility provider, and neighborhood-specific savings data. This level of specificity is hard to convey over the phone."),
      block("Adjust your cadence timing for solar leads. Homeowners are most receptive in spring and early summer when they are thinking about their energy bills and home improvements. If you are working aged solar leads in January, expect lower contact and conversion rates."),

      h3("Insurance and Medicare"),
      block("Insurance leads benefit from urgency tied to enrollment periods. If you are working aged Medicare leads, reference the upcoming enrollment window in every touch. Open enrollment deadlines are the single most effective urgency trigger for Medicare leads."),
      block("For general insurance leads, emphasize the cost of inaction. Most people do not think about insurance until they need it, and by then it is too late. Your messaging should focus on \"getting this taken care of\" rather than product features."),
      block("Insurance leads also have the highest callback rates from voicemail of any vertical I have tracked. A clear, friendly voicemail that mentions coverage and savings will generate callbacks at two to three times the rate of other industries."),

      h2("Common Mistakes"),

      h3("1. Giving Up Too Early"),
      block("This is the number one mistake, and I have seen it kill more aged lead operations than any other factor. Agents buy leads, call once, get voicemail, and declare the leads bad. The leads are not bad. The follow-up is bad. Commit to the full seven days before you evaluate any lead batch."),

      h3("2. Calling at the Same Time Every Day"),
      block("If you always call at 10 AM, you will only reach people who are available at 10 AM. Vary your call times across the cadence. Some people work nights. Some are only available on lunch breaks. Some will only pick up after 6 PM. You need to fish at different times to catch different fish."),

      h3("3. Sending Marketing Emails Instead of Personal Emails"),
      block("HTML emails with logos, headers, footers, and unsubscribe links scream \"mass marketing.\" Your aged lead email should look like you typed it yourself and hit send. Plain text, first-person voice, conversational tone. The moment it looks automated, it gets deleted."),

      h3("4. Not Tracking Your Touches"),
      block("If you are not logging every call, every voicemail, every email, and every door knock in your CRM, you are flying blind. You will accidentally call someone twice in one day, miss follow-ups, and have no data to optimize your system. Discipline in tracking is discipline in selling."),

      h3("5. Using the Same Script for Every Lead Age"),
      block("A 30-day-old lead and a 180-day-old lead are completely different conversations. The 30-day lead probably remembers filling out the form. The 180-day lead may have forgotten entirely and may have already purchased from someone else. Your opening, your tone, and your offer should adapt to the age of the lead."),

      h2("Benchmarks: What to Expect"),
      block("After running this cadence consistently for four weeks, here is what a well-run operation should see. Contact rate across all channels: 15 to 25 percent. That means for every 100 leads, you should have real conversations with 15 to 25 of them. Phone-only contact rate: 8 to 15 percent. Adding mail and email roughly doubles your contact rate."),
      block("Conversion rate by touch number tells a clear story. Touch 1 converts about 2 percent of total leads. Touches 2 and 3 convert another 3 to 5 percent. Touches 4 through 7 convert another 3 to 5 percent. The cumulative effect is what matters, not any single touch."),
      block("Callback rate from voicemails should be 3 to 8 percent. Callback rate from direct mail should be 1 to 3 percent. Email reply rate should be 5 to 12 percent. These vary by industry, but if you are significantly below these ranges, your messaging needs work."),
      block("The total conversion rate for a full 7-day cadence with multi-channel outreach on aged leads typically falls between 3 and 8 percent, depending on lead age, industry, and your skill level. That may not sound high, but at aged lead prices of one to five dollars per lead, the ROI is exceptional."),
    ],
  },

  {
    _id: "pb-aged-lead-roi-tracking",
    _type: "playbook",
    title: "Tracking Your Aged Lead ROI: The Metrics Playbook",
    slug: { _type: "slug", current: "tracking-aged-lead-roi-metrics" },
    difficulty: "intermediate",
    estimatedTime: "16 min read",
    publishedAt: "2026-03-18T11:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-insurance"), ref("lt-mortgage"), ref("lt-solar")],
    seo: { metaTitle: "Aged Lead ROI Tracking — Metrics, Benchmarks & Weekly Scorecard", metaDescription: "The complete metrics system for aged lead profitability. 5 essential metrics, industry benchmarks, weekly scorecard template, and diagnostic troubleshooting." },
    excerpt: "The essential metrics every aged lead professional should track — what to measure, benchmarks by industry, and how to use your numbers to make better decisions.",
    body: [
      block("Early in my career managing lead operations, I noticed a pattern that has held true for 25 years. The agents who track their numbers survive and eventually thrive. The agents who do not track their numbers churn out within 90 days and blame the leads. Every single time."),
      block("I managed a lead operation at Quicken Loans where we tracked every metric down to the individual loan officer level. The difference between top performers and bottom performers was rarely talent or product knowledge. It was awareness. The top performers knew their contact rate, their conversion rate, and their cost per acquisition. They adjusted daily. The bottom performers \"felt\" like things were going well or going poorly, but they had no data to confirm or deny it."),
      block("This playbook gives you the exact metrics framework I have refined across campaigns involving millions of leads. It is built for aged leads specifically, where the economics are different from real-time leads and the tracking matters even more because your margins depend on volume and efficiency."),

      h2("The 5 Metrics That Matter"),

      h3("1. Cost Per Lead (CPL)"),
      block("What it is: the price you pay for each lead record. This is your raw input cost before any work is done."),
      block("How to calculate it: total lead spend divided by total leads purchased. If you spent $500 on 200 leads, your CPL is $2.50."),
      block("What it tells you: CPL sets the floor for your economics. Everything downstream has to work hard enough to overcome this input cost. Lower CPL gives you more room for error in your contact and conversion rates. Higher CPL demands higher efficiency."),
      block("How to improve it: buy older leads, which are cheaper. Negotiate volume discounts with your lead provider. Buy during off-peak periods when supply exceeds demand. Mix lead ages in your purchases, using cheap old leads to offset more expensive fresher leads."),
      block("Common mistake: obsessing over CPL in isolation. A $0.50 lead that never converts is more expensive than a $5 lead that closes at 3 percent. Always evaluate CPL relative to conversion rate and deal value."),

      h3("2. Contact Rate"),
      block("What it is: real conversations divided by total attempts. A contact is a live two-way conversation, not a voicemail, not an answering machine, not a wrong number."),
      block("How to calculate it: total contacts divided by total dials, multiplied by 100. If you made 500 dials and had 60 conversations, your contact rate is 12 percent."),
      block("What it tells you: contact rate measures the quality of your lead data and the effectiveness of your outreach timing. It is the first bottleneck in your funnel. If you cannot reach people, nothing else matters."),
      block("How to improve it: vary your calling times across different days and time slots. Use a local caller ID. Add channels like direct mail and email that create callbacks. Scrub bad numbers before you start dialing. Use a parallel dialer to increase attempts per hour."),
      block("Worked example: an agent buys 500 leads at $2 each. Over two weeks, they make 1,500 dials and have 150 conversations. Contact rate is 10 percent. By adding a yellow letter before the first call, they increase callbacks and push contact rate to 16 percent. Same leads, 80 more conversations, dramatically more opportunities."),
      block("Common mistake: counting voicemails as contacts. A voicemail is a marketing impression, not a conversation. Be honest with your data or it cannot help you."),

      h3("3. Conversion Rate"),
      block("What it is: closed deals divided by total leads purchased, expressed as a percentage. This is your end-to-end efficiency metric."),
      block("How to calculate it: closed deals divided by total leads, multiplied by 100. If you bought 500 leads and closed 15 deals, your conversion rate is 3 percent."),
      block("What it tells you: conversion rate is the definitive measure of your system. It encompasses lead quality, contact rate, scripting, objection handling, product fit, and closing ability. If any link in the chain is broken, conversion rate shows it."),
      block("How to improve it: improve your scripts based on what objections you hear most. Role-play with a colleague weekly. Record your calls where legally permitted and review them. Focus on asking questions rather than pitching. Handle objections with empathy, not pressure."),
      block("Worked example: an insurance agent buys 400 leads per month at $3 each, spending $1,200. At a 2 percent conversion rate, they close 8 policies. If their average commission is $500, they earn $4,000 on a $1,200 investment. By improving their conversion rate from 2 to 3 percent through better scripting, they close 12 policies and earn $6,000, a 50 percent revenue increase with zero additional lead spend."),
      block("Common mistake: measuring conversion rate over too short a period. Some leads take 60 to 90 days to close. If you evaluate your conversion rate after one week, you are dramatically undercounting your results."),

      h3("4. Cost Per Acquisition (CPA)"),
      block("What it is: the total cost to acquire one paying customer. This is the metric that tells you whether your business model works."),
      block("How to calculate it: total lead spend divided by number of closed deals. If you spent $1,200 on leads and closed 8 deals, your CPA is $150."),
      block("What it tells you: CPA is the most important metric because it directly compares your cost to your revenue. If your CPA is $150 and your average deal is worth $500, you have a sustainable model. If your CPA is $400 and your deal is worth $500, you are barely breaking even and any inefficiency puts you underwater."),
      block("How to improve it: CPA has two levers. You can lower your CPL by buying cheaper leads, or you can increase your conversion rate by improving your system. In practice, improving conversion rate has more leverage because small improvements compound across your entire lead volume."),
      block("Common mistake: forgetting to include your time. If you spend 40 hours working 500 leads and close 10 deals, your CPA might look great on paper, but the hours per deal might be unsustainable. Factor in your time cost, especially if you are choosing between aged leads and other activities."),

      h3("5. Return on Investment (ROI)"),
      block("What it is: the percentage return on every dollar spent on leads. This is your bottom-line profitability metric."),
      block("How to calculate it: revenue minus lead spend, divided by lead spend, multiplied by 100. If you generated $4,000 in revenue from $1,200 in lead spend, your ROI is 233 percent."),
      block("What it tells you: ROI tells you whether aged leads are a profitable channel and how they compare to other lead sources. An ROI above 200 percent is strong. Above 300 percent is excellent. Below 100 percent means you are losing money."),
      block("How to improve it: everything that improves CPL and conversion rate improves ROI. But the fastest path to better ROI is usually improving conversion rate because it increases revenue without increasing cost. Use the ROI Calculator on this site to model different scenarios before adjusting your strategy."),
      block("Worked example: an agent spends $2,000 per month on aged mortgage leads. They close 4 loans with an average commission of $2,500, generating $10,000 in revenue. ROI is 400 percent. If they can close one additional loan per month by improving their follow-up cadence, revenue jumps to $12,500 and ROI climbs to 525 percent."),
      block("Common mistake: ignoring lifetime value. A mortgage customer who refinances with you twice over 10 years is worth three times their initial commission. An insurance customer who renews annually generates residual income for years. Your true ROI on aged leads is higher than the initial deal suggests."),

      h2("Secondary Metrics Worth Tracking"),

      h3("Lead Age Performance"),
      block("Track your conversion rate by lead age bracket: 30-day, 60-day, 90-day, 120-day, and 180-day-plus. This tells you which age ranges work best for your system. Most agents find a sweet spot between 60 and 120 days where the leads are cheap enough for strong ROI but fresh enough for decent contact rates. Your data will tell you where your sweet spot is."),

      h3("Time to Contact"),
      block("How long after purchasing a lead do you make your first attempt? Agents who contact leads within 24 hours of purchase consistently outperform agents who wait. Even though these are aged leads, speed still matters. The faster you start the cadence, the more leads you convert before they buy from someone else."),

      h3("Appointments per Contact"),
      block("Of the conversations you have, what percentage result in a scheduled appointment or quote delivery? This metric isolates your scripting and qualification skills from everything else. If your contact rate is strong but appointments are low, your script needs work. Benchmark: 20 to 35 percent of conversations should result in an appointment or quote."),

      h3("Revenue per Lead"),
      block("Total revenue divided by total leads purchased. This single number tells you the average dollar value of every lead in your batch. It is useful for quick profitability assessments. If your revenue per lead exceeds your cost per lead, you are making money. If you are buying leads at $3 and your revenue per lead is $8, every lead is worth net $5 to your business."),

      h3("Callback Rate"),
      block("What percentage of your voicemails and emails generate inbound callbacks or replies? This metric tells you whether your messaging is working. A strong callback rate means your voicemail scripts and email copy are compelling. Track this separately for each channel so you know where to focus your optimization efforts."),

      h2("The Weekly Scorecard"),
      block("Every Friday, take 10 minutes and fill in your numbers for the week. This is non-negotiable if you are serious about making aged leads profitable. Here is the exact template I recommend:"),
      block("Week of [date]. Leads purchased this week: ___. Total dials: ___. Total contacts: ___. Contact rate: ___%. Appointments set: ___. Quotes delivered: ___. Closed deals: ___. Revenue: $___. Lead spend: $___. CPA: $___. ROI: ___%."),
      block("Below the numbers, add one sentence for each: What worked this week? What did not work? What will I change next week?"),

      h3("Reading Your Scorecard at 4 Weeks"),
      block("After four weeks, you have enough data to see patterns but not enough to make dramatic changes. Look for consistency. Are your contact rates stable week to week? Is one day of the week producing better results? Is a particular lead source outperforming others? At four weeks, your job is to identify patterns, not to overhaul your system."),

      h3("Reading Your Scorecard at 8 Weeks"),
      block("At eight weeks, you have statistically meaningful data. Calculate your averages across all eight weeks. If your conversion rate is below industry benchmarks, it is time to adjust your scripts, your follow-up cadence, or your lead sources. If your numbers are at or above benchmarks, consider increasing your lead volume by 25 percent and see if your rates hold."),

      h3("Reading Your Scorecard at 12 Weeks"),
      block("Twelve weeks is a full quarter and the point where you should have confidence in your system. If your ROI is above 200 percent, scale aggressively. If it is between 100 and 200 percent, optimize before scaling. If it is below 100 percent, something fundamental needs to change, whether that is your scripts, your lead source, your products, or your follow-up discipline."),

      h2("The Monthly Review"),
      block("Beyond the weekly scorecard, conduct a monthly review on the first of each month. Pull the previous month's data and analyze it at a higher level."),
      block("Trend analysis: are your numbers improving, declining, or flat? Plot your contact rate, conversion rate, and ROI on a simple chart. Three months of upward trend means your system is working and you should scale. Three months of decline means something changed and you need to diagnose it. Flat results might mean you have plateaued and need to test a new approach."),
      block("When to change strategy versus stay the course: this is one of the hardest decisions in lead management. I have seen agents abandon a working system because they had one bad week, and I have seen agents stick with a broken system for six months because they were hoping it would improve. The answer is in the data. Look at the trend, not the individual data points. If the trend line over three months is going the wrong direction, make a change. If you had one bad week in an otherwise positive trend, stay the course."),

      h2("Diagnosing Problems"),

      h3("Low Contact Rate (Below 8%)"),
      block("Root causes: bad lead data with disconnected numbers, calling at suboptimal times, caller ID flagged as spam, or single-channel outreach. Many aged lead batches have 20 to 30 percent bad numbers, so a low contact rate may actually be normal for the data quality."),
      block("Fixes: scrub numbers through a phone validation service before dialing. Rotate your outbound numbers regularly to avoid spam flags. Add direct mail as a first touch to generate inbound calls. Test different calling windows systematically, tracking contact rates by time slot over two weeks to find your optimal windows."),

      h3("Good Contact Rate, Low Conversion"),
      block("Root causes: your script is too aggressive or too passive. You are pitching before qualifying. You are not handling objections effectively. You are selling the wrong product to the wrong prospect. Or the lead quality is poor and the prospects were never genuinely interested."),
      block("Fixes: record your calls where legally permitted and review them with a critical ear. Are you talking more than 40 percent of the conversation? You are talking too much. Are you asking open-ended questions that uncover the prospect's real situation? Role-play your script with a colleague and ask for honest feedback. Focus on the transition from conversation to appointment — that is usually where deals die."),

      h3("Good Conversion, Low Volume"),
      block("Root causes: you are not buying enough leads, or you are not making enough dials. Your system works but you are underfeeding it."),
      block("Fixes: increase your monthly lead purchase by 25 to 50 percent. Increase your daily dial count. Block dedicated calling time on your calendar and protect it. If you are closing at 4 percent but only buying 100 leads per month, buying 200 leads should roughly double your revenue because your system has been validated."),

      h3("High CPA"),
      block("Root causes: you are paying too much per lead, your conversion rate is too low, or both. A CPA above your average deal value is an emergency."),
      block("Fixes: first, check your CPL. Can you buy older, cheaper leads without destroying your contact rate? Test a batch of 120-day leads versus your usual 60-day leads and compare the CPA. Second, work on conversion rate. A 1 percentage point improvement in conversion rate on 500 leads means 5 more deals per month. Use the Lead Cost Calculator on this site to model different CPL and conversion rate combinations."),

      h3("High Volume, Low Revenue"),
      block("Root causes: you are closing deals but the deal value is too low. This often happens when agents discount aggressively to close, or when they are selling products with low commissions. It can also indicate that you are closing unqualified prospects who cancel during underwriting."),
      block("Fixes: review your product mix. Are you quoting the right coverage amounts and loan sizes? Check your post-close retention rate. If deals are falling out after closing, your qualification process needs work. Focus on closing quality deals rather than maximizing quantity."),

      h3("Inconsistent Results Week to Week"),
      block("Root causes: inconsistent effort is the most common culprit. You had a great Monday and Tuesday but fell off on Wednesday through Friday. Or you are not cycling through your leads systematically and are cherry-picking the ones that look best. Inconsistency in effort always produces inconsistency in results."),
      block("Fixes: build a daily routine and stick to it regardless of how you feel. Set a minimum number of dials per day and hit it every day. Work your leads in order, not by gut feel. Track your daily activity, not just your weekly results, so you can see the correlation between effort and outcomes."),

      h2("Industry Benchmarks"),

      h3("Insurance"),
      block("Contact rate: 10 to 15 percent by phone, 18 to 22 percent multi-channel. Conversion rate: 1 to 3 percent. CPA: $50 to $150. Average commission: $300 to $600. ROI target: 200 to 400 percent. Insurance leads benefit from multi-channel outreach because policyholders tend to respond to email and mail at higher rates than other verticals."),

      h3("Final Expense"),
      block("Contact rate: 12 to 18 percent by phone, 20 to 28 percent with door knocking. Conversion rate: 2 to 5 percent. CPA: $30 to $80. Average commission: $250 to $500. ROI target: 300 to 600 percent. Final expense has the highest conversion rates in aged leads because the product is simple, the need is clear, and the in-home presentation is highly effective. Door knocking is the differentiator."),

      h3("Mortgage"),
      block("Contact rate: 8 to 12 percent by phone, 14 to 18 percent multi-channel. Conversion rate: 1 to 2 percent. CPA: $200 to $500. Average commission: $2,000 to $5,000. ROI target: 300 to 800 percent. Mortgage has the lowest conversion rate but the highest deal value, which means your ROI can be exceptional even at low volumes. One extra closed loan per month can transform your economics."),

      h3("Solar"),
      block("Contact rate: 10 to 15 percent by phone, 16 to 22 percent multi-channel. Conversion rate: 1 to 3 percent. CPA: $150 to $400. Average deal value: $1,500 to $3,000 in commission. ROI target: 200 to 500 percent. Solar leads are seasonal and geographic, so benchmarks vary widely. Summer months in high-incentive states produce significantly better results."),

      h3("Medicare"),
      block("Contact rate: 12 to 18 percent by phone, 22 to 30 percent multi-channel. Conversion rate: 2 to 4 percent. CPA: $40 to $100. Average commission: $200 to $400 initially plus annual renewals. ROI target: 300 to 600 percent. Medicare leads have the highest contact rates because the target demographic tends to answer the phone. Enrollment period timing is critical — leads worked during Annual Enrollment Period convert at two to three times the off-season rate."),

      h2("When to Scale and When to Fix"),
      block("This is the decision that separates professionals from amateurs. I have seen agents pour money into scaling a broken system, and I have seen agents sit on a proven system because they were afraid to invest more. Both are costly mistakes."),
      block("Scale when: your ROI has been above 200 percent for three consecutive months, your conversion rate is at or above industry benchmarks, you have capacity to handle more leads without reducing your follow-up quality, and your CPA is stable as you have increased volume gradually."),
      block("Fix first when: your ROI is below 150 percent, your contact rate or conversion rate has been declining, your CPA is trending upward, or you are not completing the full follow-up cadence on every lead. Never scale a system that is not working. Fix the leak before you add more water."),
      block("The decision framework is simple. Run a 4-week test at your current volume. If the numbers are at or above benchmarks, increase lead volume by 25 percent and run another 4-week test. If the numbers hold, increase again. If they drop, pull back and investigate. This gradual scaling approach protects you from catastrophic overspending while still capturing growth."),

      h2("Tools for Tracking"),
      block("You do not need expensive software to track these metrics. A well-designed spreadsheet works for agents handling up to 500 leads per month. Beyond that, a CRM with reporting capabilities becomes essential."),
      block("At minimum, your tracking system needs to record every lead with its source, cost, and age. It needs to log every touch attempt with the channel, date, time, and outcome. It needs to track pipeline stages from contact to appointment to quote to close. And it needs to calculate your five core metrics automatically."),
      block("If you are using a CRM, look for one that tracks lead source attribution, allows custom reporting by date range and lead source, and provides pipeline visibility. Close CRM, HubSpot, and Salesforce all handle this well. For spreadsheet users, the Pipeline Calculator on this site can help you model your expected results before committing to a tool."),
      block("The best tool is the one you actually use. A sophisticated CRM that you do not update is worse than a simple spreadsheet that you fill in every day. Start with whatever you will consistently maintain, and upgrade when your volume demands it."),
    ],
  },

  {
    _id: "pb-mortgage-rate-shopping-playbook",
    _type: "playbook",
    title: "The Mortgage Rate Shopping Playbook for Aged Leads",
    slug: { _type: "slug", current: "mortgage-rate-shopping-playbook" },
    difficulty: "intermediate",
    estimatedTime: "16 min read",
    publishedAt: "2026-03-18T12:00:00Z",
    author: ref("author-bill-rice"),
    leadTypes: [ref("lt-mortgage")],
    seo: { metaTitle: "Mortgage Rate Shopping Playbook for Aged Leads — Scripts & Lock Strategies", metaDescription: "How loan officers win rate shoppers from aged mortgage leads. Pre-call rate prep, comparison scripts, objection handling, locking strategies, and follow-up systems." },
    excerpt: "How loan officers can win rate shoppers from aged mortgage leads — pre-call rate prep, the rate comparison script, locking strategies, and the pre-qualification fast track.",
    body: [
      block("Here is something most loan officers do not understand about aged mortgage leads: they are often better than real-time leads. I know that sounds counterintuitive. I spent years as VP of National Home Equity at Quicken Loans, where I built the EquityOnline platform and managed lead acquisition at massive scale. What I learned is that the economics of real-time leads are brutal. You pay $25 to $80 per lead, you are competing with four to eight other originators who bought the same lead, and the borrower is overwhelmed with calls within minutes of submitting their inquiry."),
      block("Aged mortgage leads flip every one of those problems. You pay $2 to $10 per lead. The competition has moved on. And the borrower has had time to think about what they actually want, which means when you do connect, they are more likely to have a genuine conversation instead of hanging up because they are fielding their sixth call in ten minutes."),
      block("This playbook is specifically designed for loan officers working aged mortgage leads. The rate shopping conversation is different when someone inquired 60 or 90 days ago versus 5 minutes ago, and your approach needs to reflect that. Every script, strategy, and tactic in this guide has been tested across real mortgage lead operations."),

      h2("Pre-Call Rate Prep"),
      block("Before you pick up the phone, you need to be the most prepared person in the conversation. The borrower may have been quoted rates by three other lenders. If you fumble when they ask \"what's your rate,\" you have already lost."),
      block("Pull your current rate sheets for the products you most commonly originate. At minimum, know today's rate and APR for 30-year fixed conventional, 30-year fixed FHA, 30-year fixed VA, 15-year fixed, and 5/1 or 7/1 ARM. Know the rates at par and with one point of discount. Know your lender credit options for above-par pricing."),
      block("Check what rates were when the lead was generated. Most lead providers include the inquiry date. Look up historical rate data for that date. If a lead inquired 90 days ago and rates have dropped 0.5 percent since then, you have an incredibly compelling opener. If rates have risen, you lead with locking before they go even higher. Either way, the rate change is your conversation starter."),
      block("Also check competitor rates. Bankrate, NerdWallet, and your local competitors' websites will give you a sense of what rates borrowers are seeing when they shop. You do not need to beat every competitor on rate, but you need to be able to explain your value proposition when someone says another lender quoted them lower."),
      block("Finally, prepare your loan comparison worksheet before calling. Have a simple template that shows rate, APR, monthly payment, total closing costs, and break-even point for buying down the rate. When a borrower says \"another lender quoted me lower,\" you need to be able to pull up a side-by-side comparison instantly. The loan officer who has the numbers wins the conversation."),

      h3("Using Rate History as a Conversation Starter"),
      block("Rate history is the single most effective opener for aged mortgage leads. Here is why: it demonstrates that you did your homework, it provides immediate value in the form of information, and it creates a natural reason for the call that does not feel like a sales pitch."),
      block("\"Hi [Name], when you first looked into a mortgage back in [month], 30-year fixed rates were around [X.XX%]. Today they are at [Y.YY%]. That is a meaningful change that could affect your monthly payment by $[amount] on a $[loan amount] loan. I wanted to give you a quick update and see if this is still something you are working on.\""),

      h2("Understanding the Rate Shopper Mindset"),
      block("Every loan officer assumes rate shoppers only care about rate. In my experience managing mortgage lead operations involving hundreds of thousands of leads, that assumption is wrong. Rate is the entry point, but it is rarely the deciding factor."),
      block("What rate shoppers actually want is certainty. They want to know they are not getting ripped off. They want to understand the confusing array of fees, points, and terms well enough to make a confident decision. They want someone they trust to tell them \"this is a good deal and here is why.\" Rate is how they start the conversation because it is the only metric they understand well enough to compare."),
      block("Your job is not to win on rate. Your job is to be the loan officer who makes them feel certain they are making the right decision. You do this through transparency, speed, and education. Quote your rate confidently. Explain the total cost including fees. Show them a side-by-side comparison that accounts for everything, not just the interest rate. When you make the complex simple, you win."),
      block("I learned this lesson managing thousands of loan officers at Quicken Loans. The top producers almost never had the lowest rate in the market. What they had was the ability to make borrowers feel confident in their decision within 10 minutes of conversation. They quoted with authority, explained the math clearly, and removed uncertainty. Borrowers chose them because they trusted them, not because they were cheapest."),
      block("Trust signals that matter to rate shoppers: quoting a specific rate with confidence rather than hedging, explaining fees upfront without being asked, offering to put everything in writing immediately, providing your NMLS number without being prompted, and following up when you say you will. These small details separate the professional from the amateur."),

      h2("The Rate Comparison Script"),

      h3("When Rates Have Dropped Since the Inquiry"),
      block("This is the best-case scenario. Rates are lower than when they first looked, which gives you a compelling reason to call and genuine value to offer."),
      block("\"Hi [Name], this is [Your Name] with [Company]. You had looked into mortgage options about [X] months ago when rates were around [higher rate]. I am calling because rates have come down since then. Current 30-year fixed is around [lower rate], and on a $[loan amount] loan, that could save you about $[monthly savings] per month. Were you able to lock in a rate, or would it help to see what is available today?\""),
      block("If they engage: \"Great, let me ask you a few quick questions so I can give you an accurate quote. It will take about 5 minutes.\" Transition directly into the pre-qualification."),

      h3("When Rates Have Risen Since the Inquiry"),
      block("Rates going up is not a disadvantage if you frame it correctly. Rising rates create urgency that benefits you."),
      block("\"Hi [Name], this is [Your Name] with [Company]. You had looked into a mortgage about [X] months ago when rates were around [lower rate]. They have moved up since then to about [higher rate]. The reason I am calling is that most forecasts expect rates to continue rising, and I wanted to give you a chance to lock in before they go higher. Do you have 5 minutes to see where you stand?\""),
      block("The urgency here is real, not manufactured. If rates are genuinely trending upward, every day they wait costs them money. You are doing them a favor by calling."),
      block("If they push back on rising rates: \"I understand the hesitation. Nobody wants to feel rushed. But here is the math — on a $300,000 loan, every quarter-point increase adds about $50 to your monthly payment. That is $600 per year for the life of the loan. Locking today protects you from that risk.\""),

      h3("When Rates Are Stable"),
      block("Stable rates are the hardest scenario because you do not have a rate-driven hook. Instead, lead with service and speed."),
      block("\"Hi [Name], this is [Your Name] with [Company]. You had looked into mortgage options a while back, and rates are still in the same range, around [rate]. I wanted to reach out because a lot of people start the process and get busy, and I specialize in making it quick and easy. If you have 5 minutes, I can tell you exactly what rate you qualify for and what your monthly payment would look like. No commitment, no credit pull — just information.\""),
      block("The key phrase here is \"no credit pull.\" Many borrowers hesitate to engage because they think every conversation triggers a hard inquiry. Removing that fear opens the door."),

      h2("The 5-Minute Pre-Qualification"),
      block("Speed is your competitive advantage. Real-time lead companies compete on who can call first. With aged leads, you compete on who can deliver value fastest. The 5-minute pre-qualification is your tool for doing that."),

      h3("Question 1: What is your estimated credit score range?"),
      block("Frame it as a range: \"Would you say your credit is excellent, above 740? Good, in the 700 to 740 range? Fair, 640 to 700? Or are you working on building it up?\" Ranges feel less intrusive than asking for an exact number, and they give you enough to quote accurately."),

      h3("Question 2: Are you purchasing or refinancing?"),
      block("Simple question, but the answer changes everything about your quote. For purchases, you need to know if they have identified a property. For refinances, you need to know their current rate and loan balance to frame the savings."),

      h3("Question 3: What is the property value or purchase price?"),
      block("For purchases: \"What price range are you looking at?\" For refinances: \"What do you think your home is worth today?\" Pair this with their loan amount to calculate LTV, which directly affects their rate."),

      h3("Question 4: What loan amount are you looking at?"),
      block("For purchases, calculate this from the purchase price minus their down payment. For refinances, ask for their current loan balance and whether they want cash out."),

      h3("Question 5: Are you self-employed or W-2?"),
      block("Self-employed borrowers have different documentation requirements and sometimes different rate tiers. This question also signals to the borrower that you understand underwriting, which builds confidence."),

      h3("Delivering the Quote"),
      block("With those five answers, you can quote a rate confidently in under two minutes."),
      block("\"Based on what you have told me, you are looking at approximately [X.XX%] on a 30-year fixed, which puts your monthly payment around $[X,XXX] including taxes and insurance. If you want to buy the rate down, we can get you to [lower rate] for about $[cost in points]. I can send you a formal loan estimate in the next hour if you would like to see the full breakdown.\""),
      block("The offer to send a formal loan estimate immediately is critical. It demonstrates professionalism, gives them something tangible to review, and creates a natural follow-up touchpoint. Most competitors will not send a written quote this fast."),
      block("One thing I learned at Quicken Loans that most originators never figure out: the speed of your quote delivery is a trust signal. When you can give someone real numbers in 5 minutes, it tells them you know what you are doing. When another lender says \"let me get back to you in a few days,\" it tells the borrower that person is either disorganized or not confident in their pricing. Be the fast one."),

      h2("Objection Handling"),

      h3("\"I'm already working with someone\""),
      block("This is the most common objection and also the most mishandled. Most loan officers either give up or get aggressive. Neither works."),
      block("\"That is great. I am glad you are moving forward. Just so I can be helpful if anything changes — what rate did they quote you? I can tell you in 10 seconds if that is competitive for your situation.\" Pause and wait. About half the time, they will tell you the rate. If they do and you can beat it, say: \"That is a decent rate. I could get you to [lower rate], which would save you about $[monthly savings] per month. If you want a backup option, I am happy to send you a written quote. No pressure.\""),
      block("The key is positioning yourself as a backup, not a replacement. Deals fall through constantly in mortgage. Appraisals come in low. Underwriting finds problems. Closings get delayed. If you are the prepared backup, you get the call when the primary falls apart."),

      h3("\"Your rate is too high\""),
      block("First, find out what they are comparing you to. \"I appreciate you telling me that. What rate were you quoted? And was that with points or at par?\" Many borrowers compare rates without understanding the difference between a par rate and a rate with discount points. A competitor quoting 6.25 percent with 1.5 points is not actually cheaper than your 6.50 percent at par if the borrower plans to sell or refinance within five years."),
      block("\"Let me show you something. The rate they quoted includes $[X] in discount points, which means you are paying $[total cost] upfront to get that rate. At my rate with no points, your monthly payment is $[amount] higher, but you save $[total upfront] on day one. It takes [X] months to break even on those points. If there is any chance you will sell, refinance, or pay off the loan before that, the no-point option actually saves you money.\""),

      h3("\"I need to think about it\""),
      block("\"Absolutely. This is a big decision and you should take your time. Here is what I would suggest — let me send you a written rate quote and a side-by-side comparison right now while rates are where they are. That way you have the numbers in front of you when you are ready to decide. If rates change before then, I will give you a call so you are not caught off guard. Does that work?\""),
      block("This response accomplishes three things. It respects their timeline. It gives them a tangible document that keeps you in the conversation. And it establishes a legitimate reason for your next follow-up call, which is a rate change."),

      h3("\"I'm not ready to buy yet\""),
      block("\"No problem at all. Where are you in the process? Have you started looking at properties, or are you still figuring out your budget?\" This question pivots the conversation from mortgage to real estate, which feels less salesy and keeps them talking."),
      block("\"Here is what I would recommend. Let me get you a pre-approval letter now while rates are where they are. It does not commit you to anything, but when you do find a property, you can make an offer immediately instead of scrambling to get approved while someone else snags the house. A pre-approval also tells sellers you are a serious buyer, which matters in competitive markets.\""),

      h3("\"My credit isn't great\""),
      block("\"I appreciate you being upfront about that. There are more options than most people realize. FHA loans go down to 580 credit scores, and some programs go even lower. What is your approximate score?\" Do not dismiss them. Some of the most loyal customers are borrowers who were turned away elsewhere and you found them a solution."),
      block("If their score is genuinely too low to originate: \"Here is what I would suggest. Let me send you a credit improvement plan — specific steps to raise your score. It usually takes 60 to 90 days to see meaningful improvement. When you are ready, call me and we will lock you in.\" This creates a future customer and a legitimate reason to follow up in 90 days."),

      h2("The Lock Strategy"),
      block("Locking a rate is where deals become real. The lock conversation is the most important transition in mortgage sales, and handling it well separates closers from quoters."),
      block("Use rate volatility as ethical urgency. The key word is ethical. I have seen loan officers manufacture false urgency with claims like \"this rate expires in an hour.\" That is manipulative and it damages trust. Real urgency exists naturally in mortgage because rates do move daily, and a quarter-point swing can cost a borrower hundreds of dollars per month."),
      block("\"Rates have been moving around a lot this week. What I quoted you today at [rate] might be different tomorrow. If you are seriously considering this, I would recommend locking your rate now so we protect this number. There is no cost to lock, and it gives you [30/45/60] days to close.\""),

      h3("Float-Down Provisions"),
      block("If your lender offers float-down provisions, they are one of the most powerful closing tools in mortgage sales. A float-down gives the borrower the protection of today's rate with the upside if rates drop further. It eliminates the single biggest objection to locking: \"What if rates go down after I lock?\""),
      block("\"Here is the best part. If rates drop more than 0.25 percent after we lock, I can adjust your rate down to the new level. You get the security of knowing your rate will not go up, and if the market moves in your favor, you benefit. It is the best of both worlds.\""),
      block("Explain how the float-down works simply. Most borrowers have never heard of it, and it differentiates you from competitors who pressure lock without offering this safety net. Detail the specific terms: the threshold for activation, the timing window, and any limitations. Transparency here builds trust that carries through the entire loan process."),

      h2("Following Up on Unlocked Prospects"),
      block("Not everyone locks on the first call. For prospects who need time, your job is to become their rate advisor, not a salesperson waiting for a commission. This positioning is essential because it gives you a legitimate reason to keep calling."),
      block("Set up a rate alert for each prospect: \"I will keep an eye on rates for you. If they drop below [X.XX%], I will call you immediately so we can lock before they bounce back. What is the best number to reach you?\" Then actually do it. When rates move in their favor, be the first person to call them with the news."),
      block("For your drip cadence on unlocked prospects, send a brief rate update email every Monday. Keep it to three lines: current rate, direction of the trend, and your recommendation. \"Hi [Name], quick rate update: 30-year fixed is at [rate] today, down from [last week's rate]. If you are thinking about locking, this is a good window. Give me a call if you want to talk through it.\""),
      block("This weekly touchpoint keeps you top of mind without being aggressive. You are providing value in the form of market intelligence. When they are ready to act, you are the obvious person to call because you have been their trusted source of information."),
      block("For prospects who expressed strong interest but did not lock, add a phone follow-up on Day 7 and Day 14 after your initial conversation. Use a brief check-in approach: \"Hi [Name], just a quick update — rates ticked [up/down] this week to [rate]. Wanted to make sure you had the latest. Any questions I can answer?\" Keep it short, keep it informational, and always end with an open question that invites continued dialogue."),
      block("I have seen loan officers build entire pipelines of 50 to 100 unlocked prospects who they nurture with weekly rate updates. When rates make a significant move, these originators close 5 to 10 loans in a single week because they have a warm audience that trusts their market insight. The nurture system is the most underutilized strategy in mortgage origination."),

      h2("The Refinance Angle"),
      block("Here is an angle that most loan officers miss when working aged mortgage leads: the refinance pivot. A lead that originally inquired about a purchase may no longer be a purchase prospect. Maybe they already bought. Maybe they decided to stay in their current home. That does not mean they are a dead lead. It means they might be a refinance prospect."),
      block("\"Hi [Name], I am following up on a mortgage inquiry you made a while back. Did you end up purchasing a home? [If yes:] Congratulations! What rate did you lock in? Depending on what has happened with rates since then, there might be an opportunity to lower your payment or take cash out for renovations.\""),
      block("In my experience, 10 to 15 percent of aged purchase leads can be converted to refinance opportunities. If they bought at a higher rate and rates have dropped, you have a genuine value proposition. If they have not bought and rates have dropped, you have an even better purchase conversation than the original lead would have produced."),
      block("The refinance angle also applies to leads who were shopping for a refinance and never acted. Circumstances change over 60 to 120 days. Home values may have increased, giving them better LTV. Their credit may have improved. New programs may be available. Every one of these changes is a legitimate reason to reach out."),
      block("Cash-out refinances deserve special attention with aged leads. Many homeowners who inquired about a purchase may have decided to stay and renovate instead. If home values have risen in their area, they may have significant equity they did not realize they could access. Position the cash-out refi as a way to fund renovations, consolidate debt, or create a financial safety net. The conversation shifts from \"did you buy a house\" to \"did you know your home might be worth more than you think.\""),

      h2("Compliance Considerations"),
      block("Mortgage lead calling carries regulatory requirements that you cannot afford to ignore. I have seen originators face fines and license actions for compliance failures that were entirely avoidable."),
      block("TCPA basics: the Telephone Consumer Protection Act requires that you have prior express consent to call or text a consumer. When you buy aged leads, the original consent was typically given to the lead generator, not to you. Verify with your lead provider that the consent language on their forms covers transfer to third-party companies. If it does not, you may be exposed to TCPA liability."),
      block("Do Not Call compliance: scrub every lead list against the National Do Not Call Registry before dialing. Numbers can be added to the registry between the time the lead was generated and the time you purchased it. Scrub every time, even if your provider claims to have already scrubbed."),
      block("State-specific rules vary significantly. Some states require you to identify yourself and your company within the first 30 seconds of the call. Some states restrict calling hours more tightly than federal law. Some states have their own DNC registries in addition to the federal one. Know the rules in every state where you originate."),
      block("Call recording: if you record calls for quality assurance or training, check your state's consent requirements. Some states require all-party consent, meaning the borrower must agree to be recorded. A simple disclosure at the beginning of the call handles this: \"This call may be recorded for quality and training purposes.\""),
      block("Licensing: you must be licensed in the state where the property is located, not just the state where the borrower lives. If you buy a national aged lead list, you will inevitably encounter leads in states where you are not licensed. Have a referral partner network in place so you can refer those leads rather than wasting them. A 25 percent referral fee on a loan you could not originate yourself is free money."),

      h2("Benchmarks for Mortgage Aged Leads"),
      block("After 25 years in mortgage lead management, here are the benchmarks I use to evaluate whether an aged mortgage lead operation is performing. These numbers assume a multi-channel follow-up cadence, not phone-only outreach."),
      block("Contact rate: 10 to 16 percent. This means for every 100 aged mortgage leads, you should have real conversations with 10 to 16 borrowers. If you are below 10 percent, check your calling times, your phone number reputation, and your lead data quality."),
      block("Pre-qualification rate: 40 to 60 percent of contacts. Once you have a borrower on the phone, 40 to 60 percent should agree to answer your 5 pre-qualification questions. If this number is low, your script is not creating enough value or trust in the opening."),
      block("Lock rate: 20 to 35 percent of pre-qualified borrowers. Of the borrowers you pre-qualify and quote, 20 to 35 percent should lock a rate. If locks are low, your rate presentation or urgency positioning needs work."),
      block("Pull-through rate: 70 to 85 percent of locked loans. Pull-through measures how many locked loans actually close. Below 70 percent suggests problems in processing, underwriting, or borrower qualification. Above 85 percent is excellent."),
      block("Putting it all together with real numbers: start with 500 aged leads at $5 each, a total spend of $2,500. Contact 65 borrowers at a 13 percent contact rate. Pre-qualify 35 at a 54 percent pre-qual rate. Lock 10 at a 29 percent lock rate. Close 8 at an 80 percent pull-through rate. At an average commission of $3,000 per loan, that is $24,000 in revenue on $2,500 in lead cost. That is a 860 percent ROI. Even if your numbers are half this good, aged mortgage leads are among the most profitable lead sources available to loan officers."),
      block("Compare that to real-time exclusive leads at $50 to $80 each. Five hundred real-time leads would cost you $25,000 to $40,000. Even with a higher conversion rate of 3 to 5 percent, your CPA on real-time leads is dramatically higher. The math on aged mortgage leads is not even close. The only requirement is that you have the discipline to work the follow-up cadence and the patience to let the system compound over 8 to 12 weeks."),
      block("Track these benchmarks weekly using the Pipeline Calculator on this site. Input your actual numbers each week and compare them to these targets. Within four weeks, you will know exactly where your system is strong and where it needs work. Within eight weeks, you will have enough data to make confident decisions about scaling your aged lead investment."),
    ],
  },
];

async function seed() {
  console.log("Expanding playbooks in Sanity...\n");
  for (const pb of playbooks) {
    try {
      await client.createOrReplace(pb);
      console.log(`✓ ${pb.title}`);
    } catch (err) {
      console.error(`✗ ${pb.title}: ${err.message}`);
    }
  }
  console.log(`\nDone! Expanded ${playbooks.length} playbooks.`);
}

seed().catch(console.error);
