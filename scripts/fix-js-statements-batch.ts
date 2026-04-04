/**
 * Push updated statements for 10 JS exercises with solutions-in-statement issues.
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
    // fondations
    { slug: 'fondations-level-3',      readme: 'scripts/piscine-js-expert/module-0/ex02/README.md' },
    // fp-valley
    { slug: 'fp-valley-level-3',       readme: 'scripts/piscine-js-expert/ex02/README.md' },
    { slug: 'fp-valley-level-4',       readme: 'scripts/piscine-js-expert/ex03/README.md' },
    { slug: 'fp-valley-level-5',       readme: 'scripts/piscine-js-expert/ex04/README.md' },
    // async-forest
    { slug: 'async-forest-level-2',    readme: 'scripts/piscine-js-expert/ex06/README.md' },
    { slug: 'async-forest-level-3',    readme: 'scripts/piscine-js-expert/ex07/README.md' },
    { slug: 'async-forest-level-4',    readme: 'scripts/piscine-js-expert/ex08/README.md' },
    // closures-cave
    { slug: 'closures-cave-level-1',   readme: 'scripts/piscine-js-expert/ex10/README.md' },
    { slug: 'closures-cave-level-3',   readme: 'scripts/piscine-js-expert/ex12/README.md' },
    // summit
    { slug: 'summit-level-1',          readme: 'scripts/piscine-js-expert/ex25/README.md' },
];

async function main() {
    console.log('\n🔧 Fix 10 JS statements with solutions-in-statement\n');
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
