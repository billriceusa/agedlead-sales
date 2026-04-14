import { defineField, defineType } from "sanity";

export const cronHeartbeatType = defineType({
  name: "cronHeartbeat",
  title: "Cron Heartbeat",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Cron Name", type: "string" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: ["ok", "partial", "failed"] },
    }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 4 }),
    defineField({ name: "durationMs", title: "Duration (ms)", type: "number" }),
    defineField({ name: "ranAt", title: "Ran At", type: "datetime" }),
  ],
  preview: {
    select: { title: "name", subtitle: "ranAt", status: "status" },
    prepare({ title, subtitle, status }) {
      return {
        title: `${title} [${status}]`,
        subtitle: subtitle ? new Date(subtitle).toLocaleString() : "never",
      };
    },
  },
});
