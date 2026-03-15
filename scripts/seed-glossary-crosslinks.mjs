import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p7rbtajg",
  dataset: "production",
  apiVersion: "2026-03-14",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const crosslinks = {
  // Insurance-related terms → insurance lead types
  "glossary-final-expense-insurance": ["lt-final-expense", "lt-insurance"],
  "glossary-indexed-universal-life": ["lt-iul", "lt-insurance"],
  "glossary-term-life-insurance": ["lt-insurance"],
  "glossary-medicare-supplement": ["lt-medicare"],
  "glossary-medicare-advantage": ["lt-medicare"],
  "glossary-annual-enrollment-period": ["lt-medicare"],
  "glossary-open-enrollment-period": ["lt-medicare", "lt-insurance"],
  "glossary-p-and-c-insurance": ["lt-insurance"],
  "glossary-cross-selling": ["lt-insurance", "lt-final-expense"],
  "glossary-underwriting": ["lt-insurance", "lt-final-expense", "lt-iul"],

  // Mortgage-related terms
  "glossary-refinance-lead": ["lt-mortgage"],
  "glossary-purchase-lead": ["lt-mortgage"],
  "glossary-heloc": ["lt-mortgage"],
  "glossary-reverse-mortgage": ["lt-mortgage"],
  "glossary-loan-officer": ["lt-mortgage"],
  "glossary-pre-qualification": ["lt-mortgage"],

  // Legal-related terms
  "glossary-ssdi": ["lt-ssdi"],
  "glossary-mva": ["lt-mva"],
  "glossary-personal-injury-lead": ["lt-mva"],
  "glossary-contingency-fee": ["lt-mva", "lt-ssdi"],
  "glossary-statute-of-limitations": ["lt-mva"],

  // Sales terms → multiple lead types
  "glossary-door-knocking": ["lt-final-expense", "lt-insurance", "lt-solar"],
  "glossary-cold-calling": ["lt-insurance", "lt-mortgage"],
  "glossary-follow-up-cadence": ["lt-insurance", "lt-mortgage", "lt-final-expense"],
  "glossary-contact-rate": ["lt-insurance", "lt-mortgage"],
  "glossary-conversion-rate": ["lt-insurance", "lt-mortgage"],

  // Lead gen terms → all major types
  "glossary-aged-lead": ["lt-insurance", "lt-mortgage", "lt-final-expense", "lt-solar"],
  "glossary-real-time-lead": ["lt-insurance", "lt-mortgage"],
  "glossary-cost-per-lead": ["lt-insurance", "lt-mortgage", "lt-final-expense"],
  "glossary-lead-validation": ["lt-insurance", "lt-mortgage"],

  // Compliance terms
  "glossary-tcpa": ["lt-insurance", "lt-mortgage", "lt-final-expense"],
  "glossary-dnc-list": ["lt-insurance", "lt-mortgage"],
  "glossary-cms-guidelines": ["lt-medicare"],
};

async function seed() {
  console.log("Adding glossary → lead type cross-references...\n");
  let count = 0;

  for (const [termId, leadTypeIds] of Object.entries(crosslinks)) {
    const refs = leadTypeIds.map((id, i) => ({
      _type: "reference",
      _ref: id,
      _key: `ref${i}`,
    }));

    try {
      await client.patch(termId).set({ relatedLeadTypes: refs }).commit();
      console.log(`  ✓ ${termId} → ${leadTypeIds.join(", ")}`);
      count++;
    } catch (err) {
      console.error(`  ✗ ${termId}: ${err.message}`);
    }
  }

  console.log(`\nDone! Cross-linked ${count} glossary terms.`);
}

seed().catch(console.error);
