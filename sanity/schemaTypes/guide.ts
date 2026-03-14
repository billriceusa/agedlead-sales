import { defineField, defineType } from "sanity";

export const guideType = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Metadata" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Brief summary for listings and SEO",
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning("Keep under 200 characters for best SEO"),
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text",
        },
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
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
      name: "leadTypes",
      title: "Related Lead Types",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "leadType" }] }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "estimatedTime",
      title: "Estimated Read Time",
      type: "string",
      group: "meta",
      description: 'e.g. "20 min read"',
    }),
    defineField({
      name: "isGated",
      title: "Gated Content",
      type: "boolean",
      group: "meta",
      description: "Require email signup to access full content",
      initialValue: false,
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
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
