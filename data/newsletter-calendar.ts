/**
 * Newsletter Content Calendar for Aged Lead Sales
 *
 * Cadence: 1 newsletter per week, sent every Tuesday at 9 AM ET
 * Planned on Sundays, preview sent to Bill for review on Sunday
 *
 * Newsletter Structure:
 *   - Personal intro from Bill Rice (2-3 paragraphs)
 *   - Featured article spotlight (best blog post this week)
 *   - 2-3 exclusive quick tips (not published on the blog)
 *   - This week on the blog (digest of all posts)
 *   - Industry data point or trend
 *   - CTA to browse aged leads on AgedLeadStore.com
 *
 * Theme Rotation:
 *   Themes give each newsletter a cohesive focus while still including
 *   the weekly blog digest. The AI may override themes when timely
 *   opportunities arise (rate changes, enrollment periods, etc.)
 */

export interface NewsletterPlan {
  week: number;
  sendDate: string;
  theme: string;
  focusVertical: string;
  exclusiveTipTopics: string[];
  specialHook?: string;
  status: "sent" | "scheduled" | "planned";
}

export const NEWSLETTER_THEMES = [
  "The Numbers Game",
  "Scripts That Close",
  "Channel Deep Dive",
  "Vertical Spotlight",
  "Compliance Corner",
  "Tech & Tools",
  "Scaling Up",
  "The Aged Lead Mindset",
  "ROI Breakdown",
  "Seasonal Strategy",
] as const;

export const NEWSLETTER_CALENDAR: NewsletterPlan[] = [
  // ── WEEK 1 ──
  {
    week: 1,
    sendDate: "2026-03-17",
    theme: "The Aged Lead Mindset",
    focusVertical: "General",
    exclusiveTipTopics: [
      "Why your first 200 leads are practice, not profit",
      "The one CRM field that tells you everything about your pipeline",
      "How to evaluate a new batch of aged leads in 60 seconds",
    ],
    specialHook: "Launch issue — welcome readers and set expectations",
    status: "planned",
  },
  // ── WEEK 2 ──
  {
    week: 2,
    sendDate: "2026-03-24",
    theme: "Scripts That Close",
    focusVertical: "Insurance",
    exclusiveTipTopics: [
      "The 3-second opener that keeps aged leads on the phone",
      "Why 'I'm calling about your request' beats 'I have a great offer'",
      "The voicemail trick that doubles your callback rate",
    ],
    status: "planned",
  },
  // ── WEEK 3 ──
  {
    week: 3,
    sendDate: "2026-03-31",
    theme: "Channel Deep Dive",
    focusVertical: "Multi-vertical",
    exclusiveTipTopics: [
      "Email vs text vs call: the optimal first touch by lead age",
      "The direct mail piece that costs $0.50 and gets 4% response",
      "Why Tuesday mornings are your highest-contact window",
    ],
    status: "planned",
  },
  // ── WEEK 4 ──
  {
    week: 4,
    sendDate: "2026-04-07",
    theme: "ROI Breakdown",
    focusVertical: "Mortgage",
    exclusiveTipTopics: [
      "The real cost-per-deal math for aged mortgage leads",
      "How to track ROI without a spreadsheet PhD",
      "When to double your lead spend (and when to cut it in half)",
    ],
    status: "planned",
  },
  // ── WEEK 5 ──
  {
    week: 5,
    sendDate: "2026-04-14",
    theme: "Vertical Spotlight",
    focusVertical: "Solar",
    exclusiveTipTopics: [
      "Solar aged leads peak in spring — here's why",
      "The satellite roof trick that pre-qualifies before you knock",
      "Financing objection handling: 3 responses that work",
    ],
    status: "planned",
  },
  // ── WEEK 6 ──
  {
    week: 6,
    sendDate: "2026-04-21",
    theme: "Compliance Corner",
    focusVertical: "General",
    exclusiveTipTopics: [
      "The DNC scrub step most agents skip (and the $500 fine per call)",
      "Manual dial vs power dial: the compliance difference explained",
      "Your 5-record compliance checklist before every campaign",
    ],
    status: "planned",
  },
  // ── WEEK 7 ──
  {
    week: 7,
    sendDate: "2026-04-28",
    theme: "Scaling Up",
    focusVertical: "Insurance",
    exclusiveTipTopics: [
      "The economics of your first hire (it's cheaper than you think)",
      "Lead distribution: round-robin vs cherry-pick vs weighted",
      "The one metric that tells you if your team is ready to scale",
    ],
    status: "planned",
  },
  // ── WEEK 8 ──
  {
    week: 8,
    sendDate: "2026-05-05",
    theme: "Tech & Tools",
    focusVertical: "Multi-vertical",
    exclusiveTipTopics: [
      "Free CRM vs paid CRM: the real cost comparison",
      "The dialer setup that triples your daily contact volume",
      "3 Chrome extensions every lead caller should install",
    ],
    status: "planned",
  },
  // ── WEEK 9 ──
  {
    week: 9,
    sendDate: "2026-05-12",
    theme: "The Numbers Game",
    focusVertical: "Final Expense",
    exclusiveTipTopics: [
      "Final expense benchmarks: what good numbers actually look like",
      "The 50-dial minimum that separates closers from quitters",
      "Why your contact rate matters more than your close rate",
    ],
    status: "planned",
  },
  // ── WEEK 10 ──
  {
    week: 10,
    sendDate: "2026-05-19",
    theme: "Seasonal Strategy",
    focusVertical: "Medicare",
    exclusiveTipTopics: [
      "Pre-AEP preparation: what to do now for October success",
      "Building your Medicare aged lead pipeline before the rush",
      "The SEP strategy that most Medicare agents ignore",
    ],
    status: "planned",
  },
  // ── WEEK 11 ──
  {
    week: 11,
    sendDate: "2026-05-26",
    theme: "Scripts That Close",
    focusVertical: "Legal (MVA/SSDI)",
    exclusiveTipTopics: [
      "The empathy-first opener that PI firms swear by",
      "Why 'How are you doing?' is the most powerful intake question",
      "The statute-of-limitations close that creates ethical urgency",
    ],
    status: "planned",
  },
  // ── WEEK 12 ──
  {
    week: 12,
    sendDate: "2026-06-02",
    theme: "The Aged Lead Mindset",
    focusVertical: "General",
    exclusiveTipTopics: [
      "The 12-week review: what the data says about your first quarter",
      "Compounding returns: why month 3 is always better than month 1",
      "Planning your next 90 days with aged leads",
    ],
    specialHook: "End-of-quarter review — recap and look ahead",
    status: "planned",
  },
];
