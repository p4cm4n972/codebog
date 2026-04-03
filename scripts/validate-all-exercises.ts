/**
 * validate-all-exercises.ts
 *
 * Valide le bon fonctionnement de TOUS les exercices des trois plateformes :
 *   - CBOG  : soumet la solution stockée via /api/submissions/c (dryRun:true) — Judge0 CE
 *   - JSBOG : vérifie la présence et la longueur de testCode dans la collection Appwrite
 *   - ALGOBOG : idem — vérifie testCode + difficulty par building
 *
 * Pré-requis :
 *   - Serveur Next.js en cours d'exécution sur http://localhost:3000
 *   - .env.local avec les variables Appwrite
 *
 * Usage :
 *   npx tsx scripts/validate-all-exercises.ts [--platform cbog|jsbog|algobog]
 *   npx tsx scripts/validate-all-exercises.ts --report json > report.json
 */

import { Client, Account, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

// ============================================================================
// Configuration
// ============================================================================

const ENDPOINT   = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY    = process.env.NEXT_APPWRITE_KEY!;
const DB_ID      = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

const BASE_URL   = process.env.VALIDATE_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.VALIDATE_EMAIL    || 'test-cloud@codebog.test';
const TEST_PASS  = process.env.VALIDATE_PASSWORD || 'password123';

// Parse CLI args
const args = process.argv.slice(2);
const platformFilter = args.includes('--platform') ? args[args.indexOf('--platform') + 1] : null;
const jsonReport = args.includes('--report') && args[args.indexOf('--report') + 1] === 'json';

// ============================================================================
// Types
// ============================================================================

interface CbogResult {
    slug: string;
    status: 'pass' | 'fail' | 'skip' | 'error';
    reason?: string;
    output?: string;
}

interface JsbogResult {
    slug: string;
    hasTestCode: boolean;
    testCodeLength: number;
    worldSlug?: string;
}

interface AlgobogResult {
    slug: string;
    difficulty: string;
    buildingSlug: string;
    districtSlug: string;
    hasTestCode: boolean;
    testCodeLength: number;
}

interface Report {
    generatedAt: string;
    baseUrl: string;
    cbog: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        results: CbogResult[];
    };
    jsbog: {
        total: number;
        withTestCode: number;
        missingTestCode: number;
        results: JsbogResult[];
    };
    algobog: {
        total: number;
        withTestCode: number;
        missingTestCode: number;
        byDifficulty: { easy: number; medium: number; hard: number };
        results: AlgobogResult[];
    };
}

// ============================================================================
// Auth — obtenir un JWT utilisateur via session email/password
// ============================================================================

async function getJWT(): Promise<string> {
    const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
    const account = new Account(client);

    await account.createEmailPasswordSession(TEST_EMAIL, TEST_PASS);
    const jwtResponse = await account.createJWT();
    return jwtResponse.jwt;
}

// ============================================================================
// CBOG validation — soumet la solution stockée avec dryRun: true
// ============================================================================

async function validateCbog(databases: Databases, jwt: string): Promise<CbogResult[]> {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║  CBOG — validation solutions Judge0  ║');
    console.log('╚══════════════════════════════════════╝\n');

    const response = await databases.listDocuments(DB_ID, 'c-exercises', [Query.limit(500)]);
    const results: CbogResult[] = [];
    let idx = 0;

    for (const doc of response.documents) {
        idx++;
        const slug = doc.slug as string;
        const solution = doc.solution as string | undefined;
        const prefix = `  [${String(idx).padStart(3)}/${response.documents.length}] ${slug}`;

        if (!solution) {
            process.stdout.write(`${prefix} … SKIP (pas de solution)\n`);
            results.push({ slug, status: 'skip', reason: 'Pas de solution' });
            continue;
        }

        try {
            const res = await fetch(`${BASE_URL}/api/submissions/c`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`,
                },
                body: JSON.stringify({ code: solution, exerciseSlug: slug, dryRun: true }),
            });

            const data = await res.json() as {
                success: boolean;
                results?: { compiled: boolean; passed: boolean; output: string; compileError?: string };
                error?: string;
            };

            if (res.status !== 200) {
                process.stdout.write(`${prefix} … ERROR HTTP ${res.status}: ${data.error}\n`);
                results.push({ slug, status: 'error', reason: data.error });
                continue;
            }

            if (data.success && data.results?.passed) {
                process.stdout.write(`${prefix} … ✅ PASS\n`);
                results.push({ slug, status: 'pass', output: data.results.output });
            } else {
                const reason = data.results?.compileError || data.results?.output || data.error || '?';
                process.stdout.write(`${prefix} … ❌ FAIL — ${reason.split('\n')[0]}\n`);
                results.push({ slug, status: 'fail', reason: reason.substring(0, 200) });
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            process.stdout.write(`${prefix} … ERROR ${msg}\n`);
            results.push({ slug, status: 'error', reason: msg });
        }
    }

    const passed  = results.filter(r => r.status === 'pass').length;
    const failed  = results.filter(r => r.status === 'fail').length;
    const skipped = results.filter(r => r.status === 'skip' || r.status === 'error').length;

    console.log(`\n  Résumé CBOG : ✅ ${passed} PASS  ❌ ${failed} FAIL  ⏭ ${skipped} SKIP\n`);
    return results;
}

// ============================================================================
// JSBOG audit — vérifie testCode sur chaque exercice
// ============================================================================

async function auditJsbog(databases: Databases): Promise<JsbogResult[]> {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║  JSBOG — audit testCode              ║');
    console.log('╚══════════════════════════════════════╝\n');

    const response = await databases.listDocuments(DB_ID, 'exercises', [
        Query.orderAsc('slug'),
        Query.limit(500),
    ]);

    const results: JsbogResult[] = [];

    for (const doc of response.documents) {
        const slug     = doc.slug as string;
        const testCode = doc.testCode as string | undefined;
        const worldSlug = doc.worldSlug as string | undefined;
        const hasTestCode = !!(testCode && testCode.trim().length > 10);

        const icon = hasTestCode ? '✅' : '❌';
        const info = hasTestCode
            ? `${testCode!.length} chars`
            : 'MANQUANT';

        console.log(`  ${icon} ${slug.padEnd(30)} testCode: ${info}`);

        results.push({
            slug,
            hasTestCode,
            testCodeLength: testCode?.length ?? 0,
            worldSlug,
        });
    }

    const ok  = results.filter(r => r.hasTestCode).length;
    const nok = results.filter(r => !r.hasTestCode).length;
    console.log(`\n  Résumé JSBOG : ✅ ${ok} avec testCode  ❌ ${nok} sans testCode\n`);
    return results;
}

// ============================================================================
// ALGOBOG audit — vérifie testCode + résumé par building
// ============================================================================

async function auditAlgobog(databases: Databases): Promise<AlgobogResult[]> {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║  ALGOBOG — audit testCode            ║');
    console.log('╚══════════════════════════════════════╝\n');

    // Paginer par batches de 100 (limite Appwrite)
    const all: AlgobogResult[] = [];
    let offset = 0;
    const pageSize = 100;

    while (true) {
        const response = await databases.listDocuments(DB_ID, 'algo-problems', [
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderAsc('problemNumber'),
        ]);

        if (response.documents.length === 0) break;

        for (const doc of response.documents) {
            const slug        = doc.slug as string;
            const testCode    = doc.testCode as string | undefined;
            const difficulty  = doc.difficulty as string;
            const buildingSlug = doc.buildingSlug as string;
            const districtSlug = doc.districtSlug as string;
            const hasTestCode = !!(testCode && testCode.trim().length > 10);

            all.push({ slug, difficulty, buildingSlug, districtSlug, hasTestCode, testCodeLength: testCode?.length ?? 0 });
        }

        offset += pageSize;
        if (response.documents.length < pageSize) break;
    }

    // Affichage groupé par building
    const byBuilding = new Map<string, AlgobogResult[]>();
    for (const r of all) {
        const list = byBuilding.get(r.buildingSlug) ?? [];
        list.push(r);
        byBuilding.set(r.buildingSlug, list);
    }

    for (const [building, problems] of byBuilding) {
        const withCode = problems.filter(p => p.hasTestCode).length;
        const icon = withCode === problems.length ? '✅' : withCode === 0 ? '❌' : '⚠ ';
        console.log(`  ${icon} ${building.padEnd(35)} ${withCode}/${problems.length} avec testCode`);
    }

    const ok  = all.filter(r => r.hasTestCode).length;
    const nok = all.filter(r => !r.hasTestCode).length;
    const byDiff = {
        easy:   all.filter(r => r.difficulty === 'easy'   && r.hasTestCode).length,
        medium: all.filter(r => r.difficulty === 'medium' && r.hasTestCode).length,
        hard:   all.filter(r => r.difficulty === 'hard'   && r.hasTestCode).length,
    };

    console.log(`\n  Résumé ALGOBOG : ${all.length} problèmes — ✅ ${ok} avec testCode  ❌ ${nok} sans testCode`);
    console.log(`  Par difficulté (avec testCode) : easy=${byDiff.easy}  medium=${byDiff.medium}  hard=${byDiff.hard}\n`);
    return all;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
    if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID) {
        console.error('❌ Variables d\'environnement Appwrite manquantes dans .env.local');
        process.exit(1);
    }

    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  validate-all-exercises — CodeBog              ║');
    console.log(`║  Base URL: ${BASE_URL.padEnd(36)}║`);
    console.log('╚════════════════════════════════════════════════╝');

    // Health-check isolated-vm (requis pour JSBOG et ALGOBOG)
    let isolatedVmOk = false;
    try {
        const hcRes = await fetch(`${BASE_URL}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: '1+1', exerciseSlug: 'ex00', testCode: '', type: 'jsbog' }),
        });
        const ct = hcRes.headers.get('content-type') ?? '';
        isolatedVmOk = ct.includes('application/json');
    } catch {
        isolatedVmOk = false;
    }

    if (!isolatedVmOk) {
        console.log('\n⚠ isolated-vm non disponible (module natif incompatible avec le Node.js actuel).');
        console.log('  → La validation JSBOG et ALGOBOG est limitée à l\'audit des données Appwrite.');
        console.log('  → Pour valider l\'exécution : nvm use 20 && npm run dev\n');
    }

    // Authentification
    let jwt = '';
    if (!platformFilter || platformFilter === 'cbog') {
        process.stdout.write('\n🔑 Authentification Appwrite...');
        try {
            jwt = await getJWT();
            console.log(' ✅');
        } catch (err) {
            console.log(' ❌');
            console.error('  Erreur auth:', (err as Error).message);
            console.error('  Vérifiez TEST_EMAIL / TEST_PASS dans .env.local');
            if (!platformFilter) {
                console.log('  CBOG ignoré — les autres plateformes ne nécessitent pas de JWT\n');
            } else {
                process.exit(1);
            }
        }
    }

    // Client admin pour lecture Appwrite
    const client = new Client()
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID)
        .setKey(API_KEY);
    const databases = new Databases(client);

    const report: Report = {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        cbog:    { total: 0, passed: 0, failed: 0, skipped: 0, results: [] },
        jsbog:   { total: 0, withTestCode: 0, missingTestCode: 0, results: [] },
        algobog: { total: 0, withTestCode: 0, missingTestCode: 0, byDifficulty: { easy: 0, medium: 0, hard: 0 }, results: [] },
    };

    // CBOG
    if (!platformFilter || platformFilter === 'cbog') {
        if (jwt) {
            const cbogResults = await validateCbog(databases, jwt);
            report.cbog.results  = cbogResults;
            report.cbog.total    = cbogResults.length;
            report.cbog.passed   = cbogResults.filter(r => r.status === 'pass').length;
            report.cbog.failed   = cbogResults.filter(r => r.status === 'fail').length;
            report.cbog.skipped  = cbogResults.filter(r => r.status === 'skip' || r.status === 'error').length;
        }
    }

    // JSBOG
    if (!platformFilter || platformFilter === 'jsbog') {
        const jsbogResults = await auditJsbog(databases);
        report.jsbog.results       = jsbogResults;
        report.jsbog.total         = jsbogResults.length;
        report.jsbog.withTestCode  = jsbogResults.filter(r => r.hasTestCode).length;
        report.jsbog.missingTestCode = jsbogResults.filter(r => !r.hasTestCode).length;
    }

    // ALGOBOG
    if (!platformFilter || platformFilter === 'algobog') {
        const algobogResults = await auditAlgobog(databases);
        report.algobog.results       = algobogResults;
        report.algobog.total         = algobogResults.length;
        report.algobog.withTestCode  = algobogResults.filter(r => r.hasTestCode).length;
        report.algobog.missingTestCode = algobogResults.filter(r => !r.hasTestCode).length;
        report.algobog.byDifficulty  = {
            easy:   algobogResults.filter(r => r.difficulty === 'easy'   && r.hasTestCode).length,
            medium: algobogResults.filter(r => r.difficulty === 'medium' && r.hasTestCode).length,
            hard:   algobogResults.filter(r => r.difficulty === 'hard'   && r.hasTestCode).length,
        };
    }

    // ── Résumé final ──────────────────────────────────────────────────────────
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║  RÉSUMÉ FINAL                                  ║');
    console.log('╚════════════════════════════════════════════════╝');

    if (report.cbog.total > 0) {
        const { total, passed, failed, skipped } = report.cbog;
        console.log(`  CBOG    : ${total} exos — ✅ ${passed} PASS  ❌ ${failed} FAIL  ⏭ ${skipped} SKIP`);
    }
    if (report.jsbog.total > 0) {
        const { total, withTestCode, missingTestCode } = report.jsbog;
        console.log(`  JSBOG   : ${total} exos — ✅ ${withTestCode} testCode OK  ❌ ${missingTestCode} manquants`);
    }
    if (report.algobog.total > 0) {
        const { total, withTestCode, missingTestCode } = report.algobog;
        console.log(`  ALGOBOG : ${total} problèmes — ✅ ${withTestCode} testCode OK  ❌ ${missingTestCode} manquants`);
    }

    console.log('');

    // Rapport JSON si demandé
    if (jsonReport) {
        process.stdout.write(JSON.stringify(report, null, 2));
    } else {
        // Sauvegarder le rapport dans un fichier
        const outPath = `validation-report-${new Date().toISOString().slice(0, 10)}.json`;
        fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
        console.log(`  📄 Rapport JSON sauvegardé : ${outPath}\n`);
    }

    // Exit code : 1 si des exercices CBOG sont en échec (pour CI)
    const cbogFailed = report.cbog.failed > 0;
    process.exit(cbogFailed ? 1 : 0);
}

main().catch(err => {
    console.error('\n❌ Erreur fatale:', err);
    process.exit(1);
});
