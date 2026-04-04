/**
 * Fix statements for ex15 (oop-temple) and ex20 (meta-tower)
 * Updates ONLY the `statement` field — does not touch testCode or starterCode
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
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

function readStatement(exFolder: string): string {
    const readmePath = path.join('scripts/piscine-js-expert', exFolder, 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf-8');

    // Remove "Tests" section (same logic as sync-js-worldmap.ts)
    return readme
        .replace(/##\s*Tests?\s*\n+```(?:bash|sh)?\n*node\s+ex\d+\/test\.js\s*\n*```/gi, '')
        .replace(/##\s*Tests?\s*\n+`node\s+ex\d+\/test\.js`/gi, '')
        .replace(/##\s*Tests?\s*\n+node\s+ex\d+\/test\.js/gi, '')
        .trim();
}

async function updateStatement(db: Databases, slug: string, statement: string): Promise<void> {
    const result = await db.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
        Query.equal('slug', slug),
        Query.limit(1),
    ]);

    if (result.documents.length === 0) {
        // Try to find by prefix if exact slug unknown
        const prefix = slug.split('-level-')[0];
        const allInWorld = await db.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.startsWith('slug', prefix),
            Query.limit(10),
        ]);
        console.log(`  ⚠️  Slug "${slug}" not found. Available in world:`);
        for (const doc of allInWorld.documents) {
            console.log(`    - ${doc.slug} (order: ${doc.order})`);
        }
        return;
    }

    const doc = result.documents[0];
    await db.updateDocument(DATABASE_ID, JS_LEVELS_COLLECTION, doc.$id, { statement });
    console.log(`  ✅ Updated: ${doc.slug} (${statement.length} chars)`);
}

async function main() {
    console.log('\n🔧 Fix statements for ex15 (oop-temple) and ex20 (meta-tower)\n');

    const db = createAdminClient();

    const targets = [
        { exFolder: 'ex15', worldSlug: 'oop-temple', order: 2 },
        { exFolder: 'ex20', worldSlug: 'meta-tower', order: 3 },
    ];

    for (const { exFolder, worldSlug, order } of targets) {
        const statement = readStatement(exFolder);
        const slug = `${worldSlug}-level-${order}`;
        console.log(`Processing ${exFolder} → slug: "${slug}"`);
        await updateStatement(db, slug, statement);
    }

    console.log('\n✨ Done!\n');
}

main().catch(console.error);
