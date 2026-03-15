import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Updating author and blog post...\n");

  await client.createOrReplace({
    _id: "author-bill-rice",
    _type: "author",
    name: "Bill Rice",
    slug: { _type: "slug", current: "bill-rice" },
    bio: "Bill Rice has 20+ years of experience building lead conversion systems across insurance, mortgage, solar, and home improvement. He started his career in Air Force intelligence operations before spending decades designing consumer-direct banking and lending platforms. As founder of Kaleidico and marketing director for Aged Lead Store, Bill has personally worked millions of leads and developed the training systems that help sales professionals convert aged leads at scale.",
    role: "Founder & Lead Conversion Expert",
  });
  console.log("✓ Author: Bill Rice");

  // Update the blog post to use Bill Rice as author
  await client.patch("post-what-are-aged-leads")
    .set({ author: { _type: "reference", _ref: "author-bill-rice" } })
    .commit();
  console.log("✓ Updated blog post author to Bill Rice");

  // Delete the old generic author
  try {
    await client.delete("author-aged-lead-sales");
    console.log("✓ Removed old generic author");
  } catch {
    console.log("  (old author already removed)");
  }

  console.log("\nDone!");
}

seed().catch(console.error);
