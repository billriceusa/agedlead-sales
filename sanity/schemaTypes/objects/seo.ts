import { defineField } from "sanity";

export const seoFields = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  group: "seo",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Override the default page title for search engines",
      validation: (rule) =>
        rule.max(60).warning("Keep under 60 characters for best display"),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Appears in search results below the page title",
      validation: (rule) =>
        rule.max(160).warning("Keep under 160 characters for best display"),
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      description: "Prevent search engines from indexing this page",
      initialValue: false,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
