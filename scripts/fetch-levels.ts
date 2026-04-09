import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const db = new Databases(new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.NEXT_APPWRITE_KEY!));
const DB = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

async function main() {
    const r = await db.listDocuments(DB, 'js-levels', [Query.limit(100)]);
    for (const d of r.documents) {
        const hasTest = (d.testCode || '').trim().length > 20;
        if (hasTest) continue; // on veut seulement les manquants
        console.log(`\n${'='.repeat(60)}`);
        console.log(`SLUG: ${d.slug}`);
        console.log(`TITLE: ${d.title}`);
        console.log(`WORLD: ${d.worldSlug}`);
        console.log(`ORDER: ${d.order}`);
        console.log(`STATEMENT:\n${(d.statement||'').substring(0,400)}`);
        console.log(`STARTER:\n${(d.starterCode||'').substring(0,400)}`);
    }
}
main().catch(console.error);
