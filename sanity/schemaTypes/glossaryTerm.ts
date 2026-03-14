import { defineField, defineType } from "sanity";

export const glossaryTermType = defineType({
  name: "glossaryTerm",
  title: "Glossary Term",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "relations", title: "Relations" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "term",
      title: "Term",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "term", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "definition",
      title: "Short Definition",
      type: "text",
      rows: 3,
      group: "content",
      description: "1-2 sentence definition shown on the glossary index and in cards",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Extended Content",
      type: "array",
      group: "content",
      description:
        "Optional expanded explanation (500-800 words). Leave empty for short-form terms.",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Insurance", value: "insurance" },
          { title: "Mortgage", value: "mortgage" },
          { title: "Legal", value: "legal" },
          { title: "Sales", value: "sales" },
          { title: "Marketing", value: "marketing" },
          { title: "Compliance", value: "compliance" },
          { title: "Lead Generation", value: "lead-generation" },
          { title: "Finance", value: "finance" },
        ],
      },
    }),
    defineField({
      name: "relatedTerms",
      title: "Related Terms",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "glossaryTerm" }] }],
      description: "Cross-reference related glossary terms",
    }),
    defineField({
      name: "relatedLeadTypes",
      title: "Related Lead Types",
      type: "array",
      group: "relations",
      of: [{ type: "reference", to: [{ type: "leadType" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
          validation: (rule) =>
            rule.max(60).warning("Keep under 60 characters"),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
          validation: (rule) =>
            rule.max(160).warning("Keep under 160 characters"),
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: {
      title: "term",
      subtitle: "category",
    },
  },
  orderings: [
    {
      title: "Term A-Z",
      name: "termAsc",
      by: [{ field: "term", direction: "asc" }],
    },
  ],
});
