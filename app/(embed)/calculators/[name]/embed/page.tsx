import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { RoiCalculator } from "@/components/calculators/roi-calculator";
import { LeadCostCalculator } from "@/components/calculators/lead-cost-calculator";
import { PipelineCalculator } from "@/components/calculators/pipeline-calculator";
import { OutreachCadencePlanner } from "@/components/calculators/outreach-cadence-planner";
import { KnowYourCplCalculator } from "@/components/calculators/know-your-cpl-calculator";

const CALCULATORS: Record<
  string,
  { title: string; component: React.ComponentType }
> = {
  "roi-calculator": { title: "Aged Lead ROI Calculator", component: RoiCalculator },
  "lead-cost-calculator": { title: "Lead Cost Calculator", component: LeadCostCalculator },
  "pipeline-calculator": { title: "Pipeline Volume Calculator", component: PipelineCalculator },
  "outreach-cadence-planner": { title: "Outreach Cadence Planner", component: OutreachCadencePlanner },
  "know-your-cpl": { title: "Know Your CPL Calculator", component: KnowYourCplCalculator },
};

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const calc = CALCULATORS[name];
  if (!calc) return {};

  return {
    title: `${calc.title} — Embed`,
    robots: { index: false, follow: false },
  };
}

export function generateStaticParams() {
  return Object.keys(CALCULATORS).map((name) => ({ name }));
}

export default async function EmbedCalculatorPage({ params }: Props) {
  const { name } = await params;
  const calc = CALCULATORS[name];
  if (!calc) notFound();

  const CalcComponent = calc.component;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-zinc-900 dark:text-white">
        {calc.title}
      </h1>
      <Suspense
        fallback={
          <div className="h-96 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
        }
      >
        <CalcComponent />
      </Suspense>
    </div>
  );
}
