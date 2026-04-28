import { defineField, defineType } from "sanity";

export const tableRowType = defineType({
  name: "tableRow",
  title: "Table Row",
  type: "object",
  fields: [
    defineField({
      name: "cells",
      title: "Cells",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { cells: "cells" },
    prepare({ cells }) {
      const text = (cells as string[] | undefined)?.join(" | ") || "";
      return { title: text.slice(0, 80) || "Empty row" };
    },
  },
});

export const tableType = defineType({
  name: "table",
  title: "Table",
  type: "object",
  fields: [
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption shown above the table",
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [{ type: "tableRow" }],
      description: "First row is treated as the header.",
    }),
  ],
  preview: {
    select: { caption: "caption", rows: "rows" },
    prepare({ caption, rows }) {
      const rowCount = (rows as unknown[] | undefined)?.length || 0;
      return {
        title: caption || "Table",
        subtitle: `${rowCount} row${rowCount === 1 ? "" : "s"}`,
      };
    },
  },
});
