import { defineField } from "sanity";

/**
 * Rejects values that were mechanically clipped to satisfy the length cap
 * instead of rewritten. A seeding pass did exactly that and shipped 10 meta
 * titles + 12 descriptions ending in a literal "…", which Google renders
 * verbatim in the SERP (e.g. "Aged Lead Store Review (2026): Honest Assessment
 * of the L…") — a direct CTR tax on the site's best-ranked pages.
 */
function noMechanicalTruncation(value: string | undefined) {
  if (!value) return true;
  return /(…|\.\.\.)\s*$/.test(value.trim())
    ? "Ends in an ellipsis — rewrite it to fit rather than clipping it."
    : true;
}

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
      description:
        "Override the default page title for search engines. Write a complete, standalone phrase — do not paste a longer title and chop it to fit.",
      validation: (rule) => [
        rule.max(60).warning("Keep under 60 characters for best display"),
        rule
          .custom(noMechanicalTruncation)
          .error(
            "This looks like a truncated title (ends in an ellipsis). Write a shorter title instead — Google shows the ellipsis literally.",
          ),
      ],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description:
        "Appears in search results below the page title. Write a complete sentence — do not paste a longer excerpt and chop it to fit.",
      validation: (rule) => [
        rule.max(160).warning("Keep under 160 characters for best display"),
        rule
          .custom(noMechanicalTruncation)
          .error(
            "This looks like a truncated description (ends in an ellipsis). Write a shorter one instead — Google shows the ellipsis literally.",
          ),
      ],
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
