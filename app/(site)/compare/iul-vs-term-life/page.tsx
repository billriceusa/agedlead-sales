import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonPage,
  type ComparisonRow,
  type ComparisonFaq,
} from "@/components/comparison-page";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "IUL vs. Term Life Insurance: Which Is Right for Your Client?",
  description:
    "Indexed Universal Life (IUL) vs. term life insurance compared — premiums, cash value, duration, market exposure, and complexity. A plain-English guide for agents working life insurance leads.",
  alternates: { canonical: `${baseUrl}/compare/iul-vs-term-life` },
  openGraph: {
    title: "IUL vs. Term Life Insurance | Work Aged Leads",
    description:
      "Premiums, cash value, duration, and market exposure compared side by side.",
    url: `${baseUrl}/compare/iul-vs-term-life`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("IUL vs Term Life")}&category=Comparison&type=tool`,
      },
    ],
  },
};

const ROWS: ComparisonRow[] = [
  {
    label: "Coverage type",
    a: "Permanent — lasts a lifetime as long as the policy stays funded.",
    b: "Temporary — covers a fixed term (commonly 10, 20, or 30 years), then expires.",
  },
  {
    label: "Premium",
    a: "Much higher, and flexible — part funds insurance costs, part funds cash value.",
    b: "Low and fixed for the term — the most coverage per dollar.",
  },
  {
    label: "Cash value",
    a: "Builds tax-deferred cash value tied to a market index, with a floor and a cap.",
    b: "None — it is pure protection with no savings component.",
  },
  {
    label: "Market exposure",
    a: "Indexed gains are credited up to a cap; a floor (often 0%) limits index losses, but policy fees still apply.",
    b: "None — the death benefit doesn't move with markets.",
  },
  {
    label: "Death benefit",
    a: "Adjustable, and can be structured to include the cash value.",
    b: "Level and guaranteed for the term, as long as premiums are paid.",
  },
  {
    label: "Complexity",
    a: "High — caps, participation rates, and internal costs require careful illustration and ongoing review.",
    b: "Low — easy to understand, quote, and compare.",
  },
  {
    label: "Best fit",
    a: "Lifelong coverage need plus a goal of tax-advantaged cash accumulation, with budget for higher premiums.",
    b: "Maximum coverage at the lowest cost for a defined need — income replacement, a mortgage, or raising kids.",
  },
];

const FAQS: ComparisonFaq[] = [
  {
    question: "What is the difference between IUL and term life insurance?",
    answer:
      "Term life is temporary, low-cost protection that pays a death benefit if you die during a set term and builds no cash value. Indexed Universal Life (IUL) is permanent insurance with flexible premiums and a cash-value account whose growth is tied to a market index, subject to a cap on gains and a floor that limits index losses. IUL costs substantially more and is more complex.",
  },
  {
    question: "Is IUL better than term life?",
    answer:
      "Neither is universally better — they solve different problems. Term life is the most cost-effective way to cover a temporary need like income replacement or a mortgage. IUL fits a permanent coverage need combined with a desire for tax-advantaged cash accumulation, for someone who can fund the higher premiums consistently.",
  },
  {
    question: "Can you lose money in an IUL?",
    answer:
      "The index-linked floor (often 0%) protects the cash value from direct market losses in a down year, but you can still lose ground: policy charges, the cost of insurance, and caps on gains can erode cash value, especially if the policy is underfunded. IUL illustrations are projections, not guarantees, so they require careful review.",
  },
  {
    question: "Why is term life so much cheaper than IUL?",
    answer:
      "Term life is pure insurance for a limited time, so the insurer's risk is lower and there is no cash-value account to fund. IUL is permanent and includes a savings component plus internal costs, which is why its premiums are several times higher for the same death benefit.",
  },
  {
    question: "Do aged life insurance leads work for IUL and term sales?",
    answer:
      "Yes. Consumers who inquired about life insurance are prospects for both term and permanent products, so aged life insurance and IUL leads can be worked for either. The right recommendation depends on the consumer's budget, time horizon, and goals — see our IUL lead resources to get started.",
  },
];

export default function IulVsTermLifePage() {
  return (
    <ComparisonPage
      breadcrumb={[
        { name: "Lead Types", url: `${baseUrl}/lead-types` },
        {
          name: "IUL vs Term Life",
          url: `${baseUrl}/compare/iul-vs-term-life`,
        },
      ]}
      eyebrow="Life insurance comparison"
      title="IUL vs. Term Life Insurance"
      intro={
        <p>
          Term life and Indexed Universal Life (IUL) sit at opposite ends of the
          life insurance spectrum. Term is cheap, simple, temporary protection;
          IUL is permanent coverage with a market-linked cash-value account, far
          higher premiums, and real complexity. For agents working{" "}
          <Link
            href="/lead-types/iul-leads"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            IUL and life insurance leads
          </Link>
          , matching the product to the prospect's budget and time horizon is
          what turns an inquiry into the right sale.
        </p>
      }
      keyTakeaways="Term life is cheap, simple, and temporary with no cash value. IUL is permanent, flexible, and builds index-linked cash value, but costs several times more and is complex. IUL's floor limits index losses, yet fees and caps can still erode cash value. Term suits temporary needs; IUL suits a lifelong need plus tax-advantaged accumulation. Aged life leads can be worked for both."
      columns={["Indexed Universal Life (IUL)", "Term Life"]}
      rows={ROWS}
      tableNote="Educational overview only — not insurance or financial advice. IUL illustrations are projections, not guarantees; product features vary by carrier. Verify specifics against the policy and carrier illustrations."
      faqs={FAQS}
      citation={`IUL vs. Term Life Insurance comparison from Work Aged Leads. Source: ${baseUrl}/compare/iul-vs-term-life`}
      relatedTitle="Work life insurance leads"
      relatedLinks={[
        {
          href: "/lead-types/iul-leads",
          label: "IUL leads buyer's guide",
          description: "How aged IUL and life leads work, pricing, and how to work them.",
        },
        {
          href: "/price-index/life-insurance",
          label: "Life insurance lead pricing",
          description: "What you should pay for life insurance leads by age and exclusivity.",
        },
        {
          href: "/providers/best/life-insurance",
          label: "Best life insurance lead providers",
          description: "Top-rated life insurance lead sellers, independently scored.",
        },
        {
          href: "/compare/aged-vs-real-time-leads",
          label: "Aged vs. real-time leads",
          description: "Which lead type fits your life insurance sales motion?",
        },
      ]}
    />
  );
}
