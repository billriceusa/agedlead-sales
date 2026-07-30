import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonPage,
  type ComparisonRow,
  type ComparisonFaq,
} from "@/components/comparison-page";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

export const metadata: Metadata = {
  title: "Medicare Advantage vs Medigap: Key Differences",
  description:
    "Medicare Advantage vs. Medicare Supplement compared — premiums, networks, out-of-pocket costs, drug coverage, and enrollment. A plain-English guide for agents working Medicare leads and the seniors they serve.",
  alternates: {
    canonical: `${baseUrl}/compare/medicare-advantage-vs-supplement`,
  },
  openGraph: {
    title: "Medicare Advantage vs. Medicare Supplement | Aged Lead Sales",
    description:
      "Premiums, networks, out-of-pocket costs, drug coverage, and enrollment compared side by side.",
    url: `${baseUrl}/compare/medicare-advantage-vs-supplement`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Medicare Advantage vs Supplement")}&category=Comparison&type=tool`,
      },
    ],
  },
};

const ROWS: ComparisonRow[] = [
  {
    label: "What it is",
    a: "A private all-in-one alternative to Original Medicare (Part C) that bundles Parts A and B, usually with extras.",
    b: "A supplement that sits on top of Original Medicare and pays much of its out-of-pocket cost-sharing.",
  },
  {
    label: "Monthly premium",
    a: "Often low or $0 (you still pay your Part B premium).",
    b: "A higher standalone monthly premium on top of Part B.",
  },
  {
    label: "Provider access",
    a: "Network-based (HMO/PPO); care is cheapest in-network.",
    b: "Any provider in the U.S. that accepts Original Medicare — no networks.",
  },
  {
    label: "Out-of-pocket costs",
    a: "Copays and coinsurance as you use care, capped by an annual out-of-pocket maximum.",
    b: "Very predictable — most cost-sharing is covered after the premium.",
  },
  {
    label: "Prescription drugs",
    a: "Usually includes Part D drug coverage in the plan.",
    b: "Not included — you add a standalone Part D plan.",
  },
  {
    label: "Extra benefits",
    a: "Often bundles dental, vision, hearing, and other perks.",
    b: "Medical cost-sharing only; no added perks.",
  },
  {
    label: "Enrollment & underwriting",
    a: "Guaranteed acceptance during valid enrollment periods, regardless of health.",
    b: "Best rates during your Medigap open enrollment; later you may face medical underwriting in most states.",
  },
  {
    label: "Best fit",
    a: "Lower premiums, comfortable with a network, wants bundled extras.",
    b: "Wants provider freedom, predictable costs, and travels or splits time between states.",
  },
];

const FAQS: ComparisonFaq[] = [
  {
    question:
      "What is the difference between Medicare Advantage and a Medicare Supplement?",
    answer:
      "Medicare Advantage (Part C) replaces Original Medicare with a private bundled plan that uses provider networks and usually includes drug coverage and extras for a low premium. A Medicare Supplement (Medigap) keeps Original Medicare and pays most of its out-of-pocket costs for a higher monthly premium, with no networks but no built-in drug coverage.",
  },
  {
    question: "Is Medicare Advantage or Medigap cheaper?",
    answer:
      "Medicare Advantage usually has a lower monthly premium — often $0 — but you pay copays and coinsurance as you use care, up to an annual out-of-pocket maximum. Medigap costs more each month but makes your total spending highly predictable. Which is cheaper overall depends on how much care a person uses.",
  },
  {
    question: "Can you have both Medicare Advantage and a Medigap plan?",
    answer:
      "No. Medigap only works with Original Medicare, and it is illegal for an agent to sell a Medigap policy to someone enrolled in a Medicare Advantage plan. A consumer chooses one path or the other.",
  },
  {
    question: "Which is better for someone who travels?",
    answer:
      "Medigap is generally better for frequent travelers and people who split time between states, because it works with any provider nationwide that accepts Medicare. Medicare Advantage networks are regional, so out-of-area care can cost more or be limited to emergencies.",
  },
  {
    question: "Do Medicare leads work for both products?",
    answer:
      "Yes. Medicare-eligible consumers shopping for coverage are prospects for both Medicare Advantage and Medigap, so aged Medicare leads can be worked for either line. The right recommendation depends on the consumer's budget, providers, and health — see our Medicare lead resources to start.",
  },
];

export default function MedicareAdvantageVsSupplementPage() {
  return (
    <ComparisonPage
      breadcrumb={[
        { name: "Lead Types", url: `${baseUrl}/lead-types` },
        {
          name: "Medicare Advantage vs Supplement",
          url: `${baseUrl}/compare/medicare-advantage-vs-supplement`,
        },
      ]}
      eyebrow="Medicare comparison"
      title="Medicare Advantage vs. Medicare Supplement"
      intro={
        <p>
          Medicare Advantage (Part C) and Medicare Supplement (Medigap) are two
          very different ways to cover the gaps in Original Medicare. Advantage
          plans bundle coverage and extras into a low-premium, network-based
          plan; Medigap keeps Original Medicare and pays most of the
          out-of-pocket costs for a higher premium and total freedom of
          providers. If you sell or work{" "}
          <Link
            href="/lead-types/medicare-leads"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Medicare leads
          </Link>
          , knowing the trade-offs is the difference between a confused prospect
          and a confident enrollment.
        </p>
      }
      keyTakeaways="Medicare Advantage bundles coverage with low premiums but uses networks and copays. Medigap keeps Original Medicare, costs more monthly, but offers predictable costs and any-provider freedom. Advantage usually includes drug coverage; Medigap does not. You cannot hold both at once. Aged Medicare leads can be worked for either product."
      columns={["Medicare Advantage (Part C)", "Medicare Supplement (Medigap)"]}
      rows={ROWS}
      tableNote="Educational overview only — not insurance, financial, or enrollment advice. Plan rules and availability vary by state and by year; verify specifics with official Medicare resources."
      faqs={FAQS}
      citation={`Medicare Advantage vs. Medicare Supplement comparison from Aged Lead Sales. Source: ${baseUrl}/compare/medicare-advantage-vs-supplement`}
      relatedTitle="Work Medicare leads"
      relatedLinks={[
        {
          href: "/lead-types/medicare-leads",
          label: "Medicare leads buyer's guide",
          description: "How aged Medicare leads work, pricing, and how to work them.",
        },
        {
          href: "/providers/best/medicare",
          label: "Best Medicare lead providers",
          description: "Top-rated Medicare lead sellers, independently scored.",
        },
        {
          href: "/price-index/medicare",
          label: "Medicare lead pricing",
          description: "What you should pay for Medicare leads by age and exclusivity.",
        },
        {
          href: "/compare/aged-vs-real-time-leads",
          label: "Aged vs. real-time leads",
          description: "Which lead type fits your Medicare sales motion?",
        },
      ]}
    />
  );
}
