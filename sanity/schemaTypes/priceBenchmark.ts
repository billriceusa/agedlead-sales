import { defineField, defineType } from "sanity";

export const priceBenchmarkType = defineType({
  name: "priceBenchmark",
  title: "Price Benchmark",
  type: "document",
  fields: [
    defineField({
      name: "vertical",
      title: "Vertical",
      type: "reference",
      to: [{ type: "vertical" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leadAgeBracket",
      title: "Lead Age Bracket",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Real-Time (0-24 hours)", value: "real-time" },
          { title: "1-7 Days", value: "1-7-days" },
          { title: "8-30 Days", value: "8-30-days" },
          { title: "31-85 Days", value: "31-85-days" },
          { title: "86-180 Days", value: "86-180-days" },
          { title: "181-365 Days", value: "181-365-days" },
        ],
      },
    }),
    defineField({
      name: "exclusivity",
      title: "Exclusivity",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Exclusive (sold to 1 buyer)", value: "exclusive" },
          {
            title: "Semi-Exclusive (sold to 2-3 buyers)",
            value: "semi-exclusive",
          },
          { title: "Shared (sold to 4+ buyers)", value: "shared" },
        ],
      },
    }),
    defineField({
      name: "leadType",
      title: "Lead Type",
      type: "string",
      validation: (rule) => rule.required(),
      options: {
        list: [
          { title: "Internet Form Fill", value: "internet-form" },
          { title: "Live Transfer", value: "live-transfer" },
          { title: "Trigger / Credit Pull", value: "trigger-credit" },
          { title: "Direct Mail Response", value: "direct-mail" },
          { title: "Data List / Consumer Record", value: "data-list" },
        ],
      },
    }),
    defineField({
      name: "month",
      title: "Month",
      type: "string",
      description: "YYYY-MM format (e.g. 2026-03)",
      validation: (rule) =>
        rule.required().regex(/^\d{4}-\d{2}$/, { name: "YYYY-MM" }),
    }),
    defineField({
      name: "priceLow",
      title: "Price Low ($)",
      type: "number",
      description: "Lowest observed price per lead",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "priceMedian",
      title: "Price Median ($)",
      type: "number",
      description: "Estimated fair market midpoint per lead",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "priceHigh",
      title: "Price High ($)",
      type: "number",
      description: "Highest observed price per lead",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "providersSampled",
      title: "Providers Sampled",
      type: "number",
      description: "Number of data points used to derive this benchmark",
    }),
    defineField({
      name: "confidence",
      title: "Confidence",
      type: "string",
      description: "Data quality / reliability of this estimate",
      options: {
        list: [
          {
            title: "High — multiple transparent data points",
            value: "high",
          },
          {
            title: "Medium — some data, some inference",
            value: "medium",
          },
          {
            title: "Low — limited data, directional estimate",
            value: "low",
          },
        ],
      },
      initialValue: "medium",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
      description: "Methodology notes or caveats for this data point",
    }),
  ],
  preview: {
    select: {
      vertical: "vertical.name",
      ageBracket: "leadAgeBracket",
      exclusivity: "exclusivity",
      month: "month",
      median: "priceMedian",
    },
    prepare({ vertical, ageBracket, exclusivity, month, median }) {
      return {
        title: `${vertical || "?"} — ${ageBracket} — ${exclusivity}`,
        subtitle: `${month} | Median: $${median}`,
      };
    },
  },
  orderings: [
    {
      title: "Month (Newest)",
      name: "monthDesc",
      by: [{ field: "month", direction: "desc" }],
    },
  ],
});
