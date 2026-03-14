import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog Post",
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
          description: "Descriptive text for accessibility and SEO",
          validation: (rule) => rule.required().warning("Alt text improves SEO and accessibility"),
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
      name: "author",
      title: "Author",
      type: "reference",
      group: "meta",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "leadTypes",
      title: "Related Lead Types",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "leadType" }] }],
      description: "Associate this post with specific lead types",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured Post",
      type: "boolean",
      group: "meta",
      description: "Show this post in featured sections",
      initialValue: false,
    }),
    defineField({
      name: "contentType",
      title: "Content Type",
      type: "string",
      group: "meta",
      description: "Pillar posts are comprehensive hub articles; cluster posts are focused supporting content",
      options: {
        list: [
          { title: "Pillar (4,000-5,500 words)", value: "pillar" },
          { title: "Cluster (2,000-3,500 words)", value: "cluster" },
        ],
      },
    }),
    defineField({
      name: "pillarPost",
      title: "Parent Pillar Post",
      type: "reference",
      group: "meta",
      to: [{ type: "post" }],
      description: "For cluster posts: link to the parent pillar post",
      hidden: ({ document }) => document?.contentType !== "cluster",
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
      contentType: "contentType",
    },
    prepare(selection) {
      const { author, contentType } = selection;
      const subtitle = [
        contentType === "pillar" ? "PILLAR" : contentType === "cluster" ? "Cluster" : "",
        author && `by ${author}`,
      ]
        .filter(Boolean)
        .join(" · ");
      return { ...selection, subtitle };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
});
