/**
 * AI Exercise Solver — résout tous les exercices JS en live via `claude -p`
 * Puis teste chaque solution localement (node = même isolation que sandbox)
 *
 * Usage:
 *   npx tsx scripts/ai-solve-exercises.ts
 *   npx tsx scripts/ai-solve-exercises.ts --only ex05    # un seul exo
 *   npx tsx scripts/ai-solve-exercises.ts --module module-0
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

// ── Config ────────────────────────────────────────────────────────────────────
const BASE = path.join(process.cwd(), 'scripts/piscine-js-expert');
const TIMEOUT_CLAUDE_MS  = 90_000;
const TIMEOUT_NODE_MS    = 15_000;
const DELAY_BETWEEN_MS   = 3_000;  // éviter le rate limiting du CLI
const MAX_RETRIES        = 2;

// Exercices nécessitant des flags Node spéciaux
const NODE_FLAGS: Record<string, string[]> = {
    ex23: ['--expose-gc'],
};

// ── Args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const onlyExo    = args.includes('--only')   ? args[args.indexOf('--only') + 1]   : null;
const onlyModule = args.includes('--module') ? args[args.indexOf('--module') + 1] : null;

// ── Helpers ───────────────────────────────────────────────────────────────────
function readFile(p: string): string | null {
    try { return fs.readFileSync(p, 'utf-8'); }
    catch { return null; }
}

function stripHints(md: string): string {
    return md.replace(/<!--\s*HINT_START\s*-->[\s\S]*?<!--\s*HINT_END\s*-->/g, '').trim();
}

function callClaude(prompt: string, attempt = 1): string {
    const result = spawnSync('claude', ['-p', prompt, '--allowedTools', 'none'], {
        encoding: 'utf-8',
        timeout: TIMEOUT_CLAUDE_MS,
        maxBuffer: 1024 * 1024 * 4,
    });
    if (result.error || result.status !== 0) {
        const msg = result.stderr || result.error?.message || 'unknown';
        if (attempt < MAX_RETRIES && (String(msg).includes('ETIMEDOUT') || String(msg).includes('ECONNRESET'))) {
            // Attendre 5s avant de réessayer
            const waitMs = 5000 * attempt;
            spawnSync('sleep', [String(waitMs / 1000)]);
            return callClaude(prompt, attempt + 1);
        }
        throw new Error(`claude -p failed: ${msg}`);
    }
    return result.stdout.trim();
}

function extractCode(text: string): string {
    // Extrait le premier bloc ```js ou ```javascript ou le texte brut
    const match = text.match(/```(?:js|javascript)?\n([\s\S]*?)```/);
    if (match) return match[1].trim();
    // Si pas de bloc, retourner tel quel (parfois Claude répond sans backticks)
    return text.trim();
}

function runTest(exDir: string, solution: string, nodeFlags: string[]): {
    passed: number;
    failed: number;
    output: string;
    error: string | null;
} {
    const testCode = readFile(path.join(exDir, 'test.js'));
    if (!testCode) return { passed: 0, failed: 0, output: '', error: 'test.js introuvable' };

    // Créer un fichier temporaire : solution + test
    const combined = solution + '\n\n' + testCode;
    const tmpFile = path.join(exDir, '_ai_solution_tmp.js');

    try {
        fs.writeFileSync(tmpFile, combined, 'utf-8');
        const nodeArgs = [...nodeFlags, tmpFile];
        const result = spawnSync('node', nodeArgs, {
            encoding: 'utf-8',
            timeout: TIMEOUT_NODE_MS,
            cwd: exDir,
        });

        const output = result.stdout + result.stderr;
        const passMatch  = output.match(/Results:\s*(\d+)\s+passed/);
        const failMatch  = output.match(/(\d+)\s+failed/);
        const passed = passMatch  ? parseInt(passMatch[1])  : 0;
        const failed = failMatch  ? parseInt(failMatch[1])  : 0;

        return {
            passed,
            failed,
            output,
            error: result.error ? result.error.message : null,
        };
    } finally {
        try { fs.unlinkSync(tmpFile); } catch { /* ignore */ }
    }
}

// ── Discover exercises ─────────────────────────────────────────────────────────
interface Exercise {
    id: string;       // ex00, ex01, ...
    module: string;   // '' or 'module-0'
    dir: string;
    readmePath: string;
    testPath: string;
}

function discoverExercises(): Exercise[] {
    const exercises: Exercise[] = [];

    const addModule = (moduleDir: string, moduleName: string) => {
        if (!fs.existsSync(moduleDir)) return;
        const entries = fs.readdirSync(moduleDir).filter(e => /^ex\d+$/.test(e)).sort();
        for (const entry of entries) {
            const dir = path.join(moduleDir, entry);
            const readmePath = path.join(dir, 'README.md');
            const testPath   = path.join(dir, 'test.js');
            if (!fs.existsSync(readmePath) || !fs.existsSync(testPath)) continue;
            exercises.push({ id: entry, module: moduleName, dir, readmePath, testPath });
        }
    };

    if (onlyModule) {
        addModule(path.join(BASE, onlyModule), onlyModule);
    } else if (onlyExo) {
        // Chercher dans tous les modules
        for (const m of ['', 'module-0']) {
            const moduleDir = m ? path.join(BASE, m) : BASE;
            const dir = path.join(moduleDir, onlyExo);
            const readmePath = path.join(dir, 'README.md');
            const testPath   = path.join(dir, 'test.js');
            if (fs.existsSync(readmePath) && fs.existsSync(testPath)) {
                exercises.push({ id: onlyExo, module: m, dir, readmePath, testPath });
                break;
            }
        }
    } else {
        addModule(BASE, '');
        addModule(path.join(BASE, 'module-0'), 'module-0');
    }

    return exercises;
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
    const exercises = discoverExercises();
    console.log(`\n🤖 AI Exercise Solver — ${exercises.length} exercice(s) à résoudre\n`);
    console.log('='.repeat(60));

    const results: { id: string; module: string; passed: number; failed: number; status: string }[] = [];

    for (let i = 0; i < exercises.length; i++) {
        if (i > 0) await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_MS));
        const ex = exercises[i];
        const label = ex.module ? `${ex.module}/${ex.id}` : ex.id;
        process.stdout.write(`\n[${label}] Génération de la solution... `);

        const readme = readFile(ex.readmePath)!;
        const statement = stripHints(readme);
        const testCode  = readFile(ex.testPath)!;

        // Extraire les noms de fonctions/classes requis depuis le commentaire de tête du test
        const testHeader = testCode.split('\n').slice(0, 3).join('\n');

        const prompt = [
            `Tu es un expert JavaScript senior. Implémente la solution complète pour cet exercice.`,
            ``,
            `## Spécification`,
            statement,
            ``,
            `## Fichier de test complet (toutes les fonctions utilisées doivent être définies)`,
            '```js',
            testCode,
            '```',
            ``,
            `RÈGLES STRICTES:`,
            `- Réponds UNIQUEMENT avec le code JavaScript, sans aucune explication ni markdown`,
            `- Pas de \`\`\`js ni \`\`\` dans ta réponse`,
            `- Pas d'import/require/export/module.exports`,
            `- Toutes les fonctions et classes DOIVENT être déclarées à la portée globale (pas dans un objet retourné)`,
            `- Implémente TOUTES les fonctions mentionnées dans le commentaire du test: ${testHeader}`,
        ].join('\n');

        let solution: string;
        try {
            const raw = callClaude(prompt);
            solution = extractCode(raw);
            process.stdout.write('✓\n');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.log(`✗ (claude error: ${msg})`);
            results.push({ id: ex.id, module: ex.module, passed: 0, failed: -1, status: `CLAUDE_ERROR: ${msg}` });
            continue;
        }

        // Tester localement
        process.stdout.write(`[${label}] Exécution des tests... `);
        const nodeFlags = NODE_FLAGS[ex.id] ?? [];
        const testResult = runTest(ex.dir, solution, nodeFlags);

        if (testResult.error) {
            console.log(`✗ (node error: ${testResult.error})`);
            results.push({ id: ex.id, module: ex.module, passed: 0, failed: -1, status: `NODE_ERROR: ${testResult.error}` });
            continue;
        }

        const total = testResult.passed + testResult.failed;
        const allPassed = testResult.failed === 0 && total > 0;
        const emoji = allPassed ? '✅' : '❌';
        console.log(`${emoji} ${testResult.passed}/${total} tests passés`);

        if (!allPassed && testResult.output) {
            // Afficher les tests échoués
            const lines = testResult.output.split('\n').filter(l => l.includes('✗') || l.includes('Error'));
            if (lines.length > 0) {
                console.log('   ' + lines.slice(0, 5).join('\n   '));
            }
        }

        results.push({
            id: ex.id,
            module: ex.module,
            passed: testResult.passed,
            failed: testResult.failed,
            status: allPassed ? 'OK' : 'PARTIAL',
        });
    }


    // ── Récap ──────────────────────────────────────────────────────────────────
    console.log('\n' + '='.repeat(60));
    console.log('RÉCAPITULATIF\n');

    const ok      = results.filter(r => r.status === 'OK');
    const partial = results.filter(r => r.status === 'PARTIAL');
    const errors  = results.filter(r => r.status.startsWith('CLAUDE_ERROR') || r.status.startsWith('NODE_ERROR'));

    console.log(`✅ Réussis    : ${ok.length}/${results.length}`);
    console.log(`⚠️  Partiels   : ${partial.length}/${results.length}`);
    console.log(`❌ Erreurs    : ${errors.length}/${results.length}`);

    if (partial.length > 0) {
        console.log('\nPartiels:');
        for (const r of partial) {
            const label = r.module ? `${r.module}/${r.id}` : r.id;
            console.log(`  - ${label}: ${r.passed} passés, ${r.failed} échoués`);
        }
    }
    if (errors.length > 0) {
        console.log('\nErreurs:');
        for (const r of errors) {
            const label = r.module ? `${r.module}/${r.id}` : r.id;
            console.log(`  - ${label}: ${r.status}`);
        }
    }

    console.log('\n' + '='.repeat(60) + '\n');
    process.exit(errors.length > 0 || partial.length > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
