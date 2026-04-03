/**
 * Migration script: generate and store expectedOutput for C exercises
 *
 * Steps:
 *   1. Ensure the `expectedOutput` attribute exists in the Appwrite collection
 *   2. For each exercise with a solution, compile + run locally with gcc
 *   3. Store the normalized stdout as `expectedOutput`
 *
 * Run: npx tsx scripts/generate-expected-outputs.ts
 * Requires: gcc installed locally, .env.local with Appwrite credentials
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

/**
 * Common C preamble injected before every solution.
 * Covers the most frequent implicit-declaration errors in piscine exercises.
 */
const PREAMBLE = `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <stddef.h>
#include <math.h>
`.trimStart();

/**
 * Build the full compilable source from a solution + optional test harness.
 * Mirrors the logic in /api/submissions/c/route.ts (buildSource).
 */
function buildSource(solution: string, testCode: string | undefined): string {
  const withPreamble = solution.includes('#include') ? solution : `${PREAMBLE}${solution}`;

  if (testCode?.includes('int main')) {
    // testCode provides main() — prepend preamble if missing
    const testWithPreamble = testCode.includes('#include') ? testCode : `${PREAMBLE}${testCode}`;
    return `${withPreamble}\n\n${testWithPreamble}`;
  }

  // No test harness — add a minimal main so the binary links
  return `${withPreamble}\n\nint main(void) { return 0; }`;
}

/** Compile and run C code locally using execFileSync (no shell injection) */
function runLocally(source: string): { output: string | null; error: string | null } {
  const id = `cbog_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const srcPath = path.join(os.tmpdir(), `${id}.c`);
  const binPath = path.join(os.tmpdir(), id);

  try {
    writeFileSync(srcPath, source, 'utf8');
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

/** Ensure the expectedOutput attribute exists in the collection */
async function ensureExpectedOutputAttribute(): Promise<void> {
  // Use the REST API directly — the node-appwrite SDK wraps this as createStringAttribute
  // We import lazily to avoid top-level await issues
  const { Databases: DB } = await import('node-appwrite');
  const db = new DB(client);

  try {
    // Try to create the attribute — Appwrite throws if it already exists
    await (db as unknown as {
      createStringAttribute: (dbId: string, colId: string, key: string, size: number, required: boolean, defaultValue: string | null) => Promise<unknown>
    }).createStringAttribute(
      DATABASE_ID,
      C_EXERCISES_COLLECTION,
      'expectedOutput',
      65535,  // max string size
      false,  // not required
      null,   // no default
    );
    console.log('✓ Attribut "expectedOutput" créé dans Appwrite\n');
    // Wait for attribute to be active (Appwrite processes async)
    await new Promise(r => setTimeout(r, 3000));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('already exists') || msg.includes('409')) {
      console.log('✓ Attribut "expectedOutput" déjà présent\n');
    } else {
      console.error('⚠ Impossible de créer l\'attribut:', msg);
      console.log('  Créez-le manuellement dans la console Appwrite (string, taille 65535, optionnel)\n');
    }
  }
}

async function main() {
  console.log('=== generate-expected-outputs ===\n');

  await ensureExpectedOutputAttribute();

  console.log('Récupération des exercices C depuis Appwrite...\n');

  const response = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
    Query.limit(500),
  ]);

  const exercises = response.documents;
  console.log(`${exercises.length} exercices trouvés\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const exercise of exercises) {
    const slug = exercise.slug as string;
    const solution = exercise.solution as string | undefined;
    const testCode = exercise.testCode as string | undefined;
    const alreadyHasOutput = !!(exercise.expectedOutput as string | undefined);

    if (alreadyHasOutput) {
      console.log(`  [SKIP] ${slug} — déjà renseigné`);
      skipped++;
      continue;
    }

    if (!solution) {
      console.log(`  [SKIP] ${slug} — pas de solution`);
      skipped++;
      continue;
    }

    const sourceCode = buildSource(solution, testCode);

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
      const lineCount = normalizedOutput.split('\n').filter(Boolean).length;
      console.log(`OK (${lineCount} ligne${lineCount !== 1 ? 's' : ''})`);
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
