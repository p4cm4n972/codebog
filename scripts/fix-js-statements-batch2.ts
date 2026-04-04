/**
 * Push updated statements for 11 JS exercises (batch 2) with solutions-in-statement issues.
 * Updates ONLY the `statement` field — does not touch testCode or starterCode.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import { Client, Databases, Query } from 'node-appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const JS_LEVELS_COLLECTION = 'js-levels';

function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);
    return new Databases(client);
}

function readStatement(readmePath: string): string {
    const readme = fs.readFileSync(readmePath, 'utf-8');
    return readme
        .replace(/##\s*Tests?\s*\n+```(?:bash|sh)?\n*node\s+[^\n]+\n*```[\s\S]*/i, '')
        .trim();
}

const targets = [
    { slug: 'async-forest-level-5',  readme: 'scripts/piscine-js-expert/ex09/README.md' },
    { slug: 'closures-cave-level-4', readme: 'scripts/piscine-js-expert/ex13/README.md' },
    { slug: 'oop-temple-level-1',    readme: 'scripts/piscine-js-expert/ex14/README.md' },
    { slug: 'oop-temple-level-3',    readme: 'scripts/piscine-js-expert/ex16/README.md' },
    { slug: 'oop-temple-level-4',    readme: 'scripts/piscine-js-expert/ex17/README.md' },
    { slug: 'meta-tower-level-1',    readme: 'scripts/piscine-js-expert/ex18/README.md' },
    { slug: 'meta-tower-level-2',    readme: 'scripts/piscine-js-expert/ex19/README.md' },
    { slug: 'meta-tower-level-4',    readme: 'scripts/piscine-js-expert/ex21/README.md' },
    { slug: 'perf-peak-level-1',     readme: 'scripts/piscine-js-expert/ex22/README.md' },
    { slug: 'perf-peak-level-2',     readme: 'scripts/piscine-js-expert/ex23/README.md' },
    { slug: 'perf-peak-level-3',     readme: 'scripts/piscine-js-expert/ex24/README.md' },
];

async function main() {
    console.log('\n🔧 Fix 11 JS statements (batch 2) with solutions-in-statement\n');
    const db = createAdminClient();

    for (const { slug, readme } of targets) {
        const statement = readStatement(readme);
        const result = await db.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.equal('slug', slug),
            Query.limit(1),
        ]);

        if (result.documents.length === 0) {
            console.log(`  ✗ ${slug} — document introuvable`);
            continue;
        }

        const doc = result.documents[0];
        await db.updateDocument(DATABASE_ID, JS_LEVELS_COLLECTION, doc.$id, { statement });
        console.log(`  ✓ ${slug} (${statement.length} chars)`);
    }

    console.log('\n✨ Done!\n');
}

main().catch(console.error);
