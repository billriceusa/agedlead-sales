import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonPage,
  type ComparisonRow,
  type ComparisonFaq,
} from "@/components/comparison-page";
import { getVertical } from "@/data/verticals";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agedleadsales.com";

// Whole-percent for larger rates; one decimal for small ones (e.g. a 1.5%
// close rate must not round to 2% and look like half the real-time rate).
const pct = (n: number) => {
  const p = n * 100;
  if (Number.isInteger(p)) return `${p}%`;
  return `${p < 10 ? p.toFixed(1) : Math.round(p)}%`;
};

export const metadata: Metadata = {
  title: "Aged Leads vs. Real-Time Leads: Which Should You Buy?",
  description:
    "Aged leads cost a fraction of real-time leads but convert at lower rates. A data-backed comparison of price, contact rates, conversion, and cost-per-acquisition to help you choose.",
  alternates: { canonical: `${baseUrl}/compare/aged-vs-real-time-leads` },
  openGraph: {
    title: "Aged Leads vs. Real-Time Leads | Aged Lead Sales",
    description:
      "Price, contact rate, conversion, and cost-per-acquisition compared side by side — with real benchmark data by vertical.",
    url: `${baseUrl}/compare/aged-vs-real-time-leads`,
    images: [
      {
        url: `${baseUrl}/api/og?title=${encodeURIComponent("Aged vs Real-Time Leads")}&category=Comparison&type=tool`,
      },
    ],
  },
};

// Representative verticals for the data table. Real numbers pulled from
// data/verticals.ts benchmarkDefaults — shown per-vertical (not averaged) so we
// never slide denominators across verticals with different economics.
const DATA_VERTICALS = ["mortgage", "auto-insurance", "medicare", "final-expense"];

const ROWS: ComparisonRow[] = [
  {
    label: "Price per lead",
    a: "Highest in the market — commonly $8–$200+ depending on vertical and exclusivity.",
    b: (
      <>
        A small fraction of real-time — often pennies to a few dollars. See the{" "}
        <Link
          href="/price-index"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          Price Index
        </Link>{" "}
        for exact ranges by vertical.
      </>
    ),
  },
  {
    label: "Consumer recency",
    a: "Inquired seconds to minutes ago — top of mind, actively shopping.",
    b: "Inquired 30–180+ days ago — interest may have cooled, stalled, or moved on.",
  },
  {
    label: "Contact rate",
    a: "Higher — you reach a larger share on the first attempts.",
    b: "Lower — expect to work more records and more attempts per contact.",
  },
  {
    label: "Conversion rate",
    a: "Higher per lead.",
    b: "Lower per lead — offset by buying far more leads for the same spend.",
  },
  {
    label: "Exclusivity",
    a: "Often sold exclusive (one buyer) or to a small number of buyers.",
    b: "Usually sold non-exclusively; genuinely exclusive aged inventory is rare.",
  },
  {
    label: "Volume available",
    a: "Limited by live demand — you can only buy what's generated right now.",
    b: "Effectively unlimited — large historical pools you can buy in bulk.",
  },
  {
    label: "Best for",
    a: "Closers who can call within minutes and want fewer, hotter opportunities.",
    b: "Operators who run consistent, multi-touch follow-up and want volume at low cost.",
  },
  {
    label: "Follow-up required",
    a: "Low to moderate — speed-to-lead matters most.",
    b: "High — disciplined, multi-touch cadence is what makes the economics work.",
  },
];

const FAQS: ComparisonFaq[] = [
  {
    question: "Are aged leads worth it?",
    answer:
      "Yes, when you have a consistent follow-up process. Aged leads cost a small fraction of real-time leads, so even though a smaller share converts, the much lower per-lead price can produce a lower cost per acquisition. They reward volume and disciplined, multi-touch outreach rather than speed-to-lead.",
  },
  {
    question: "How much cheaper are aged leads than real-time leads?",
    answer:
      "Aged leads typically cost a small fraction of real-time leads — often pennies to a few dollars versus $8 to $200+ for a fresh, exclusive lead, depending on the vertical. Exact ranges by vertical and lead age are published in our quarterly-verified Price Index.",
  },
  {
    question: "Do aged leads actually convert?",
    answer:
      "They do, at lower rates than real-time leads. Contact and close rates drop as a lead ages, but because you can buy many more aged leads for the same budget, total deals per dollar can be competitive. The deciding factor is whether you work the leads with a persistent, multi-touch cadence.",
  },
  {
    question: "When should I buy real-time leads instead of aged?",
    answer:
      "Choose real-time leads when you can call within minutes, want exclusivity, and prefer fewer but hotter opportunities — or when compliance and your sales motion depend on contacting a consumer while their inquiry is fresh. Many teams blend both: real-time for speed, aged for low-cost volume.",
  },
  {
    question: "How old is an 'aged' lead?",
    answer:
      "Aged leads are generally 30 to 180+ days old. The 31–85-day range is often the sweet spot — old enough to be cheap, recent enough that the consumer's need may still be active. Some verticals with long decision cycles (like disability or personal-injury legal leads) stay valuable much longer.",
  },
];

export default function AgedVsRealTimePage() {
  const dataRows = DATA_VERTICALS.map((slug) => getVertical(slug)).filter(
    (v): v is NonNullable<ReturnType<typeof getVertical>> => Boolean(v)
  );

  return (
    <ComparisonPage
      breadcrumb={[
        { name: "Lead Types", url: `${baseUrl}/lead-types` },
        {
          name: "Aged vs Real-Time Leads",
          url: `${baseUrl}/compare/aged-vs-real-time-leads`,
        },
      ]}
      title="Aged Leads vs. Real-Time Leads"
      intro={
        <p>
          Real-time leads reach the consumer while their inquiry is fresh and
          convert at higher rates — but cost the most per lead. Aged leads are
          older records that cost a small fraction of the price; fewer convert,
          but you can buy far more for the same budget. The right choice comes
          down to your speed-to-lead, your follow-up discipline, and your cost
          per acquisition — not the per-lead price alone.
        </p>
      }
      keyTakeaways="Real-time leads cost the most and convert at the highest rate per lead. Aged leads cost a small fraction and convert at lower rates, but volume can make the cost per acquisition competitive. Aged leads reward disciplined, multi-touch follow-up over speed-to-lead. Many teams blend both. Compare exact pricing by vertical in the Price Index."
      columns={["Real-Time Leads", "Aged Leads"]}
      rows={ROWS}
      tableNote="Pricing ranges are directional and vary by vertical, lead age, and exclusivity. See the Price Index for quarterly-verified benchmarks."
      faqs={FAQS}
      citation={`Aged Leads vs. Real-Time Leads comparison from Aged Lead Sales. Source: ${baseUrl}/compare/aged-vs-real-time-leads`}
      relatedTitle="Keep comparing"
      relatedLinks={[
        {
          href: "/price-index",
          label: "Lead Price Index",
          description:
            "Quarterly-verified aged, real-time, and exclusive pricing by vertical.",
        },
        {
          href: "/lead-types",
          label: "All lead types",
          description:
            "Buyer's guides for mortgage, insurance, Medicare, legal, and more.",
        },
        {
          href: "/providers",
          label: "Compare lead providers",
          description: "Independent 6-dimension ratings of aged-lead sellers.",
        },
        {
          href: "/calculators/know-your-cpl",
          label: "Cost-per-lead calculator",
          description: "Model your true cost per acquired customer.",
        },
      ]}
    >
      {/* Data-backed section — real benchmark defaults, shown per-vertical */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          What the data shows
        </h2>
        <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">
          Contact and close rates both fall as a lead ages. Here are typical
          real-time versus aged benchmarks for four high-volume verticals — shown
          per vertical because the economics differ widely from one to the next.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900">
                <th scope="col" className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Vertical
                </th>
                <th scope="col" className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Contact rate (real-time &rarr; aged)
                </th>
                <th scope="col" className="p-4 font-semibold text-zinc-700 dark:text-zinc-300">
                  Close rate (real-time &rarr; aged)
                </th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((v, i) => (
                <tr
                  key={v.slug}
                  className={i % 2 === 1 ? "bg-zinc-50/50 dark:bg-zinc-900/40" : ""}
                >
                  <th scope="row" className="p-4 font-medium text-zinc-900 dark:text-white">
                    <Link
                      href={`/price-index/${v.slug}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {v.icon} {v.name}
                    </Link>
                  </th>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {pct(v.benchmarkDefaults.realTimeContactRate)} &rarr;{" "}
                    {pct(v.benchmarkDefaults.agedContactRate)}
                  </td>
                  <td className="p-4 text-zinc-600 dark:text-zinc-400">
                    {pct(v.benchmarkDefaults.realTimeCloseRate)} &rarr;{" "}
                    {pct(v.benchmarkDefaults.agedCloseRate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Source: Aged Lead Sales benchmark defaults. Rates are directional
          planning figures, not guarantees — your results depend on your offer,
          script, and follow-up cadence.
        </p>
        <p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
          The takeaway: across these verticals aged close rates run roughly a
          third to 40% of the real-time rate — but aged leads often cost a tenth
          (or less) of the real-time price. When you buy enough volume and work it persistently,
          the lower price more than compensates for the lower conversion rate.
          Run your own numbers with the{" "}
          <Link
            href="/calculators/know-your-cpl"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            cost-per-lead calculator
          </Link>
          .
        </p>
      </div>
    </ComparisonPage>
  );
}
