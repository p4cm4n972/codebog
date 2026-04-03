require("dotenv").config({ path: ".env.local" });
const { Client, Databases, Query } = require("node-appwrite");
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.NEXT_APPWRITE_KEY);
const db = new Databases(client);
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

async function audit() {
  console.log("=== AUDIT ALGOBOG ===\n");

  // 1. Count total problems
  const allProblems = await db.listDocuments(DB, "algo-problems", [Query.limit(1)]);
  console.log("Total problèmes:", allProblems.total);

  // 2. Count per building
  const buildingCounts = {};
  const noStatement = [];
  const noStarterCode = [];
  const noTestCode = [];
  const englishTitles = [];
  let offset = 0;

  while (true) {
    const batch = await db.listDocuments(DB, "algo-problems", [
      Query.limit(100),
      Query.offset(offset),
    ]);
    if (batch.documents.length === 0) break;

    for (const doc of batch.documents) {
      const b = doc.buildingSlug || "NO_BUILDING";
      buildingCounts[b] = (buildingCounts[b] || 0) + 1;

      if (!doc.statement || doc.statement.length < 50) {
        noStatement.push(doc.slug);
      }
      if (!doc.starterCode) {
        noStarterCode.push(doc.slug);
      }
      if (!doc.testCode) {
        noTestCode.push(doc.slug);
      }
      // Check if title is still in English (contains common English words without French equivalent)
      if (/^[A-Z][a-z]+ [A-Z]/.test(doc.title) && !/[éèêëàâäùûüîïôöç]/i.test(doc.title)) {
        englishTitles.push(doc.slug + " → " + doc.title);
      }
    }
    offset += 100;
  }

  // 3. Buildings distribution
  console.log("\n--- Problèmes par building ---");
  const sorted = Object.entries(buildingCounts).sort((a, b) => b[1] - a[1]);
  for (const [b, c] of sorted) {
    console.log("  " + b + ": " + c);
  }

  // 4. Districts
  const districts = await db.listDocuments(DB, "algo-districts", [Query.limit(10)]);
  console.log("\n--- Districts ---");
  console.log("  Total:", districts.total);
  for (const d of districts.documents) {
    console.log("  " + d.slug + " (ordre: " + d.order + ") - " + d.name);
  }

  // 5. Buildings
  const buildings = await db.listDocuments(DB, "algo-buildings", [Query.limit(50)]);
  console.log("\n--- Buildings ---");
  console.log("  Total:", buildings.total);
  for (const b of buildings.documents) {
    const count = buildingCounts[b.slug] || 0;
    console.log("  " + b.slug + " (" + b.districtSlug + ") - " + count + " problèmes");
  }

  // 6. Issues
  console.log("\n--- Problèmes détectés ---");
  console.log("  Sans énoncé complet:", noStatement.length);
  if (noStatement.length > 0 && noStatement.length <= 5) {
    noStatement.forEach(s => console.log("    - " + s));
  }
  console.log("  Sans starterCode:", noStarterCode.length);
  console.log("  Sans testCode:", noTestCode.length);
  console.log("  Titres possiblement anglais:", englishTitles.length);
  if (englishTitles.length > 0 && englishTitles.length <= 10) {
    englishTitles.forEach(s => console.log("    - " + s));
  } else if (englishTitles.length > 10) {
    englishTitles.slice(0, 10).forEach(s => console.log("    - " + s));
    console.log("    ... et " + (englishTitles.length - 10) + " de plus");
  }
}

audit().catch(console.error);
