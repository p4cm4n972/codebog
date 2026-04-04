/**
 * Fix testCode for fondations-level-7/8/9/10
 * Replaces ✅/❌ markers with ✓/✗ so parseTestOutput() can detect them
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

const targets = [
    { slug: 'fondations-level-7',  testFile: 'scripts/piscine-js-expert/module-0/ex06/test.js' },
    { slug: 'fondations-level-8',  testFile: 'scripts/piscine-js-expert/module-0/ex07/test.js' },
    { slug: 'fondations-level-9',  testFile: 'scripts/piscine-js-expert/module-0/ex08/test.js' },
    { slug: 'fondations-level-10', testFile: 'scripts/piscine-js-expert/module-0/ex09/test.js' },
];

async function main() {
    console.log('\n🔧 Fix fondations testCode markers (✅/❌ → ✓/✗)\n');
    const db = createAdminClient();

    for (const { slug, testFile } of targets) {
        const testCode = fs.readFileSync(testFile, 'utf-8');

        // Verify markers are now correct
        const hasWrongMarkers = testCode.includes('✅') || testCode.includes('❌');
        const hasCorrectMarkers = testCode.includes('✓') && testCode.includes('✗');

        if (hasWrongMarkers) {
            console.log(`  ✗ ${slug} — fichier local contient encore ✅/❌ !`);
            continue;
        }
        if (!hasCorrectMarkers) {
            console.log(`  ⚠️  ${slug} — aucun marqueur ✓/✗ trouvé`);
        }

        const result = await db.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.equal('slug', slug),
            Query.limit(1),
        ]);

        if (result.documents.length === 0) {
            console.log(`  ✗ ${slug} — document introuvable en base`);
            continue;
        }

        const doc = result.documents[0];
        await db.updateDocument(DATABASE_ID, JS_LEVELS_COLLECTION, doc.$id, { testCode });
        console.log(`  ✓ ${slug} — testCode mis à jour (${testCode.length} chars)`);
    }

    console.log('\n✨ Done!\n');
}

main().catch(console.error);
