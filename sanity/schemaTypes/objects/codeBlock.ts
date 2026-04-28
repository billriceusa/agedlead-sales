import { defineField, defineType } from "sanity";

export const codeBlockType = defineType({
  name: "codeBlock",
  title: "Code Block",
  type: "object",
  fields: [
    defineField({
      name: "code",
      title: "Code",
      type: "text",
      rows: 10,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      description: "Optional language label (e.g. text, json, sh, python).",
    }),
    defineField({
      name: "filename",
      title: "Filename",
      type: "string",
      description: "Optional filename or label shown above the block.",
    }),
  ],
  preview: {
    select: { code: "code", language: "language", filename: "filename" },
    prepare({ code, language, filename }) {
      const codeStr = (code as string) || "";
      return {
        title: filename || (language ? `Code (${language})` : "Code"),
        subtitle: codeStr.split("\n")[0]?.slice(0, 80) || "",
      };
    },
  },
});
