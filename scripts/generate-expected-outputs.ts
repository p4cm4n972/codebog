/**
 * Migration script: generate and store expectedOutput for C exercises
 *
 * For each exercise that has a solution, compile + run it locally with gcc
 * and store the output in Appwrite as `expectedOutput`.
 *
 * Run: npx tsx scripts/generate-expected-outputs.ts
 * Requires: gcc installed locally
 */

import { Client, Databases, Query } from 'node-appwrite';
import { execFileSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION = 'c-exercises';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

const databases = new Databases(client);

/** Compile and run C code locally using execFileSync (no shell injection) */
function runLocally(code: string): { output: string | null; error: string | null } {
  const id = `cbog_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const srcPath = path.join(os.tmpdir(), `${id}.c`);
  const binPath = path.join(os.tmpdir(), id);

  try {
    writeFileSync(srcPath, code, 'utf8');
    // execFileSync avoids shell — args passed as array, no injection possible
    execFileSync('gcc', ['-o', binPath, srcPath, '-lm'], { timeout: 10_000 });
    const output = execFileSync(binPath, [], { timeout: 5_000 }).toString();
    return { output: output.trim(), error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { output: null, error: msg };
  } finally {
    if (existsSync(srcPath)) unlinkSync(srcPath);
    if (existsSync(binPath)) unlinkSync(binPath);
  }
}

function normalize(output: string): string {
  return output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
}

async function main() {
  console.log('Fetching C exercises from Appwrite...\n');

  const response = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
    Query.limit(500),
  ]);

  const exercises = response.documents;
  console.log(`Found ${exercises.length} exercises total\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const exercise of exercises) {
    const slug = exercise.slug as string;
    const solution = exercise.solution as string | undefined;
    const testCode = exercise.testCode as string | undefined;
    const alreadyHasOutput = !!(exercise.expectedOutput as string | undefined);

    if (alreadyHasOutput) {
      console.log(`  [SKIP] ${slug} — already has expectedOutput`);
      skipped++;
      continue;
    }

    if (!solution) {
      console.log(`  [SKIP] ${slug} — no solution`);
      skipped++;
      continue;
    }

    // Build the complete source (solution + test harness if it provides main())
    const sourceCode = testCode && testCode.includes('int main')
      ? `${solution}\n\n${testCode}`
      : solution;

    process.stdout.write(`  [RUN]  ${slug}... `);
    const result = runLocally(sourceCode);

    if (result.error || result.output === null) {
      console.log(`FAIL — ${result.error?.split('\n')[0]}`);
      errors++;
      continue;
    }

    const normalizedOutput = normalize(result.output);

    try {
      await databases.updateDocument(DATABASE_ID, C_EXERCISES_COLLECTION, exercise.$id, {
        expectedOutput: normalizedOutput,
      });
      console.log(`OK (${normalizedOutput.split('\n').length} lignes)`);
      updated++;
    } catch (err) {
      console.log(`DB ERROR — ${err}`);
      errors++;
    }
  }

  console.log(`\n───────────────────────────`);
  console.log(`Mis à jour : ${updated}`);
  console.log(`Ignorés    : ${skipped}`);
  console.log(`Erreurs    : ${errors}`);
}

main().catch(console.error);
