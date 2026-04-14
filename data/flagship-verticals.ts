import type { Vertical } from "@/lib/email-course/types";

export interface FlagshipVerticalConfig {
  slug: Vertical;
  title: string;
  icon: string;
  subtitle: string;
  heroHeadline: string;
  heroSubhead: string;
  bullets: string[];
  proofStat: { number: string; label: string };
  cadenceTease: string[];
  targetAudience: string[];
  playbookPdfPath: string;
  workbookPdfPath: string;
  affiliateCampaign: string;
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const FLAGSHIP_VERTICALS: Record<Vertical, FlagshipVerticalConfig> = {
  mortgage: {
    slug: "mortgage",
    title: "Mortgage",
    icon: "🏠",
    subtitle: "For loan officers, mortgage brokers, and lenders",
    heroHeadline: "Turn $2 aged mortgage leads into funded loans.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for LOs running aged refi, purchase, HELOC, and reverse-mortgage leads.",
    bullets: [
      "The unit economics: max CPL, contact rate, and cost-per-funded-loan formulas",
      "14-day multi-channel cadence with NMLS-compliant scripts",
      "Rate-move nurture triggers to re-engage your 85% non-closers",
      "TCPA + state mini-TCPA compliance (FL, OK, WA, MD, TX)",
      "Fresh-Consent Ladder plays — graduate inherited consent into owned consent",
    ],
    proofStat: {
      number: "7.5×",
      label: "typical ROI on aged mortgage leads at 15% contact × 4% close",
    },
    cadenceTease: [
      "Day 0 — Mindset + unit economics",
      "Day 2 — Tech stack sized to your volume",
      "Day 4 — The 14-day opener cadence + scripts",
      "Day 7 — Infinity nurture + rate-move triggers",
      "Day 10 — Compliance + 90-day diagnostic",
    ],
    targetAudience: [
      "Loan officers buying aged refi, purchase, or HELOC leads",
      "Mortgage brokers running small to mid-size teams",
      "Branch owners looking to formalize an aged-lead operation",
      "Reverse-mortgage specialists",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-mortgage.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-mortgage.pdf",
    affiliateCampaign: "flagship-mortgage",
    faqs: [
      {
        q: "Does this work for refi, purchase, and HELOC all in one playbook?",
        a: "Yes. The master playbook covers the full system; the mortgage overlay has product-specific scripts and compliance notes for refi, purchase, HELOC, and reverse-mortgage leads.",
      },
      {
        q: "Is this compliant with current TCPA rules?",
        a: "The playbook walks you through current federal TCPA + state mini-TCPA guidance as of 2026 (including the vacated 1:1 rule and the 2027 revocation-all timeline). It is operator guidance, not legal advice — the playbook recommends Henson Legal for compliance reviews.",
      },
      {
        q: "What if I'm new to aged leads?",
        a: "Start in the 'Mode A' conservative setup the playbook recommends — manual dial, plain-text email, fresh-consent ladder. You can graduate to more automation once your consent workflow is solid.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Mortgage Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course. The complete system for working aged mortgage leads — scripts, unit economics, cadence, compliance.",
  },

  insurance: {
    slug: "insurance",
    title: "Insurance",
    icon: "🛡️",
    subtitle: "For auto, home, life, final expense, Medicare, and health agents",
    heroHeadline: "Turn aged insurance inquiries into new policies.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for agents running aged auto, home, life, final expense, Medicare, and health leads.",
    bullets: [
      "Sub-vertical economics: auto, home, term life, final expense, Medicare, health",
      "Script variants for each line — auto 'still going up', home 'non-renewal', Medicare AEP",
      "Renewal-cycle nurture calendar (AEP, OEP, SEP triggers)",
      "State DOI licensing checks + state mini-TCPA rules",
      "CMS-compliant Medicare workflow (Scope of Appointment, recorded enrollment)",
    ],
    proofStat: {
      number: "5×",
      label: "typical ROI on aged insurance leads at 15% contact × 8% close",
    },
    cadenceTease: [
      "Day 0 — Mindset + unit economics by sub-vertical",
      "Day 2 — Tech stack + Medicare-separate workflow",
      "Day 4 — Sub-vertical scripts (auto, home, final expense, Medicare)",
      "Day 7 — Renewal-cycle nurture (AEP, OEP, SEP)",
      "Day 10 — Compliance + Henson Legal + 90-day diagnostic",
    ],
    targetAudience: [
      "P&C agents running aged auto and home leads",
      "Life insurance agents (term + final expense)",
      "Medicare agents preparing for AEP",
      "Independent agencies working multiple lines",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-insurance.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-insurance.pdf",
    affiliateCampaign: "flagship-insurance",
    faqs: [
      {
        q: "Does this cover Medicare marketing too?",
        a: "Yes, the insurance overlay has a dedicated Medicare section covering Scope of Appointment, recorded telephonic enrollment, and CMS disclaimers. Medicare runs as a separate workflow from general insurance outreach.",
      },
      {
        q: "Is it compliant with state DOI rules?",
        a: "The playbook addresses state DOI licensing requirements and state mini-TCPAs (FL, OK, WA, MD), plus senior-marketing protections in states like NY, CA, and MA. Pair with counsel for your specific states.",
      },
      {
        q: "Will this work for just one line (e.g. only final expense)?",
        a: "Yes. The overlay breaks out economics, scripts, and compliance per sub-vertical. If you only sell final expense, you'll use that section; the rest is reference.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Insurance Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course for agents working aged auto, home, life, final expense, Medicare, and health leads.",
  },

  "home-services": {
    slug: "home-services",
    title: "Home Services",
    icon: "🔨",
    subtitle: "For roofers, solar, windows, HVAC, remodel, pest, foundation",
    heroHeadline: "Turn aged home-services leads into booked estimates.",
    heroSubhead:
      "The complete playbook, workbook, and 10-day email course for home-services contractors running aged roofing, solar, windows, HVAC, remodel, pest, and foundation leads.",
    bullets: [
      "The two-step funnel: contact → estimate → sold (never try to close on the phone)",
      "Sub-vertical economics and scripts — roofing storm-damage, solar payback, HVAC pre-season",
      "Field-capacity math: size lead volume to your estimator calendar",
      "The 'neighborhood proof' nurture play — unique to home services",
      "State storm-moratoriums, contractor-board rules, and financing disclosure language",
    ],
    proofStat: {
      number: "8×",
      label: "typical ROI on aged roofing leads at 15% contact × 6% sold",
    },
    cadenceTease: [
      "Day 0 — Mindset + ARPC math by sub-vertical",
      "Day 2 — Field-capacity planning + tech stack",
      "Day 4 — Book-the-estimate scripts (never close on the phone)",
      "Day 7 — Seasonal + neighborhood-proof nurture",
      "Day 10 — Compliance, storm moratoriums + 90-day diagnostic",
    ],
    targetAudience: [
      "Roofing and solar contractors",
      "Window, HVAC, and remodel companies",
      "Pest control and foundation repair operations",
      "Contractors running outbound teams against aged lead files",
    ],
    playbookPdfPath: "/downloads/aged-lead-operators-system-home-services.pdf",
    workbookPdfPath: "/downloads/aged-lead-operators-workbook-home-services.pdf",
    affiliateCampaign: "flagship-home-services",
    faqs: [
      {
        q: "Does this cover roofing, solar, and remodels all in one playbook?",
        a: "Yes. The home-services overlay breaks out economics, scripts, and compliance for roofing, solar, windows, HVAC, remodels, pest, and foundation. Shared cadence, sub-vertical-specific scripts.",
      },
      {
        q: "What about post-storm moratoriums in Florida and Texas?",
        a: "The compliance section covers state-specific storm-moratorium rules, contractor-board regulations (CA, TX, FL, NY), 'free estimate' vs 'free inspection' language, and Regulation Z financing disclosures.",
      },
      {
        q: "How many leads do I need to start?",
        a: "250–500 aged leads per field rep per month, targeted to a tight geographic cluster so reps aren't crossing paths. Size lead volume to your estimator capacity first.",
      },
    ],
    metaTitle: "The Aged Lead Operator's System — Home Services Edition",
    metaDescription:
      "Free playbook + workbook + 10-day email course for contractors working aged roofing, solar, windows, HVAC, remodel, pest, and foundation leads.",
  },
};

export function allFlagshipVerticals(): FlagshipVerticalConfig[] {
  return Object.values(FLAGSHIP_VERTICALS);
}
