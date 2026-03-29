import { defineField, defineType } from "sanity";

export const verticalType = defineType({
  name: "vertical",
  title: "Vertical",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'e.g. "Mortgage", "Auto Insurance", "Solar"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Emoji",
      type: "string",
      description: "An emoji to represent this vertical (e.g. 🏠, 🛡️, ☀️)",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(200).warning("Keep under 200 characters"),
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "number",
      description: "1 = highest volume, 2 = significant, 3 = niche",
      options: {
        list: [
          { title: "Tier 1 — Highest Volume", value: 1 },
          { title: "Tier 2 — Significant", value: 2 },
          { title: "Tier 3 — Niche", value: 3 },
        ],
      },
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within the same tier",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle || "",
      };
    },
  },
  orderings: [
    {
      title: "Tier & Order",
      name: "tierOrder",
      by: [
        { field: "tier", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
