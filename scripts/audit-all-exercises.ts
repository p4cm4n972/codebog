/**
 * audit-all-exercises.ts
 *
 * Audit complet de TOUS les exercices en ligne dans Appwrite :
 *   - js-levels  : exercices JSBOG (9 worlds)
 *   - c-exercises: exercices CBOG
 *
 * Critères de validation :
 *   - testCode   : non-vide, marqueurs ✓/✗ (pas ✅/❌), pas de solution implémentée
 *   - statement  : non-vide, > 150 chars, pas de solution complète exposée
 *   - starterCode: non-vide (js-levels uniquement)
 *
 * Usage :
 *   npx tsx scripts/audit-all-exercises.ts
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ============================================================================
// Configuration
// ============================================================================

const ENDPOINT   = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY    = process.env.NEXT_APPWRITE_KEY!;
const DB_ID      = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID) {
    console.error('Variables d\'environnement Appwrite manquantes dans .env.local');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// ============================================================================
// Types
// ============================================================================

type Severity = 'critical' | 'warning';

interface ExerciseIssue {
    message: string;
    severity: Severity;
}

interface ExerciseAudit {
    slug: string;
    title: string;
    testCodeLen: number;
    statementLen: number;
    issues: ExerciseIssue[];
}

// ============================================================================
// Worlds JS (9 worlds définis dans sync-js-worldmap.ts)
// ============================================================================

const JS_WORLDS = [
    'fondations',
    'fp-valley',
    'async-forest',
    'closures-cave',
    'oop-temple',
    'meta-tower',
    'perf-peak',
    'itmade-arena',
    'summit'
] as const;

// Fonctions JS connues qui devraient être implémentées par l'user
// et dont la présence dans testCode indiquerait une fuite de solution
const JS_SOLUTION_PATTERNS = [
    // Fonctions leetcode/algorithmes courants
    /function\s+twoSum\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+maxProfit\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+climbStairs\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+longestCommonPrefix\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+isValid\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+mergeTwoLists\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+maxSubArray\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+plusOne\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+mySqrt\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+compose\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+curry\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+memoize\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+pipe\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+debounce\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+throttle\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+deepClone\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+flatten\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+groupBy\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+chunk\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+zip\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+partition\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+createCounter\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+createEventEmitter\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+createObservable\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+createChannel\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+retryWithBackoff\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+promisePool\s*\([^)]*\)\s*\{[^}]{20,}/,
    /function\s+asyncPipe\s*\([^)]*\)\s*\{[^}]{20,}/,
];

// Patterns de solution dans statement (bloc de code avec implémentation non-triviale)
// Detect a markdown code block that contains function body logic
const STATEMENT_SOLUTION_PATTERNS = [
    // Code fence with a return statement containing logic (not just a stub)
    /```(?:js|javascript)[\s\S]{0,200}return\s+.{30,}[\s\S]{0,200}```/,
    // Code fence with multiple statements (if, for, while, etc.) indicating full implementation
    /```(?:js|javascript)[\s\S]{0,100}(?:for|while|if)\s*\([^)]+\)[\s\S]{0,300}```/,
];

// ============================================================================
// Fonctions d'analyse
// ============================================================================

function analyzeTestCodeJS(testCode: string | undefined): ExerciseIssue[] {
    const issues: ExerciseIssue[] = [];

    if (!testCode || testCode.trim().length === 0) {
        issues.push({ message: 'testCode vide ou absent', severity: 'critical' });
        return issues;
    }

    // Vérifier marqueurs ✓/✗ (output parseable par parseTestOutput)
    const hasCorrectMarkers = /[✓✗]/.test(testCode);
    const hasWrongMarkers   = /[✅❌]/.test(testCode);

    if (hasWrongMarkers) {
        issues.push({
            message: `testCode utilise ✅/❌ au lieu de ✓/✗ (parseTestOutput ne les détectera pas)`,
            severity: 'critical'
        });
    }

    if (!hasCorrectMarkers) {
        // Pas forcément critique si c'est un test qui génère des marqueurs à l'exécution
        // Mais on le signale en avertissement
        issues.push({
            message: 'testCode sans marqueurs ✓/✗ (résultats non parsés par le runner)',
            severity: 'warning'
        });
    }

    // Vérifier qu'il n'y a pas de solution implémentée dans testCode
    for (const pattern of JS_SOLUTION_PATTERNS) {
        if (pattern.test(testCode)) {
            const match = testCode.match(pattern);
            const snippet = match ? match[0].substring(0, 60).replace(/\n/g, ' ') : '';
            issues.push({
                message: `testCode contient une implémentation de solution : "${snippet}..."`,
                severity: 'critical'
            });
            break; // Un seul avertissement suffit
        }
    }

    return issues;
}

function analyzeTestCodeC(testCode: string | undefined, slug: string): ExerciseIssue[] {
    const issues: ExerciseIssue[] = [];

    if (!testCode || testCode.trim().length === 0) {
        issues.push({ message: 'testCode vide ou absent', severity: 'critical' });
        return issues;
    }

    // Pour C : vérifier marqueurs ✓/✗
    const hasCorrectMarkers = /[✓✗]/.test(testCode);
    const hasWrongMarkers   = /[✅❌]/.test(testCode);

    if (hasWrongMarkers) {
        issues.push({
            message: `testCode utilise ✅/❌ au lieu de ✓/✗ (parseTestOutput ne les détectera pas)`,
            severity: 'critical'
        });
    }

    if (!hasCorrectMarkers) {
        issues.push({
            message: 'testCode sans marqueurs ✓/✗ (résultats non parsés par le runner)',
            severity: 'warning'
        });
    }

    // Pour C : détecter si le testCode contient une implémentation complète de la fonction exercice
    // Pattern : nom de fonction tiré du slug (ex: ft_strlen -> int ft_strlen( ... { body })
    // On extrait le "base name" du slug (ex: "ft-strlen-day1" -> "ft_strlen")
    const slugParts = slug.split('-');
    const possibleFuncNames: string[] = [];

    // Tentative d'extraction du nom de fonction depuis le slug
    // Patterns courants : "ft-strlen", "ft-putchar", "ft-strcat" etc.
    for (let i = 0; i < slugParts.length - 1; i++) {
        const candidate = slugParts.slice(i, i + 2).join('_');
        possibleFuncNames.push(candidate);
    }
    // Aussi le slug complet converti
    possibleFuncNames.push(slug.replace(/-/g, '_'));

    for (const funcName of possibleFuncNames) {
        // Cherche une définition de fonction C avec corps non-trivial
        const cFuncPattern = new RegExp(
            `(?:int|char|void|size_t|unsigned|long|double|float)\\s+\\*?\\s*${funcName}\\s*\\([^)]*\\)\\s*\\{[^}]{30,}`,
            'i'
        );
        if (cFuncPattern.test(testCode)) {
            issues.push({
                message: `testCode contient l'implémentation de ${funcName}() (solution exposée)`,
                severity: 'critical'
            });
            break;
        }
    }

    return issues;
}

function analyzeStatement(statement: string | undefined): ExerciseIssue[] {
    const issues: ExerciseIssue[] = [];

    if (!statement || statement.trim().length === 0) {
        issues.push({ message: 'statement vide ou absent', severity: 'critical' });
        return issues;
    }

    if (statement.trim().length < 150) {
        issues.push({
            message: `statement trop court (${statement.trim().length} chars < 150) — probablement pas un vrai énoncé`,
            severity: 'warning'
        });
    }

    // Vérifier si statement contient une solution complète dans un bloc de code
    for (const pattern of STATEMENT_SOLUTION_PATTERNS) {
        if (pattern.test(statement)) {
            issues.push({
                message: 'statement contient un bloc de code avec implémentation complète (solution exposée)',
                severity: 'critical'
            });
            break;
        }
    }

    return issues;
}

function analyzeStarterCode(starterCode: string | undefined): ExerciseIssue[] {
    const issues: ExerciseIssue[] = [];

    if (!starterCode || starterCode.trim().length === 0) {
        issues.push({ message: 'starterCode vide ou absent', severity: 'critical' });
    }

    return issues;
}

// ============================================================================
// Récupération paginée depuis Appwrite
// ============================================================================

async function fetchAllDocuments(collectionId: string, extraQueries: string[] = []): Promise<any[]> {
    const all: any[] = [];
    let offset = 0;
    const pageSize = 200;

    while (true) {
        const response = await databases.listDocuments(DB_ID, collectionId, [
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderAsc('$createdAt'),
        ]);

        all.push(...response.documents);
        offset += pageSize;

        if (response.documents.length < pageSize) break;
    }

    return all;
}

async function fetchByWorld(worldSlug: string): Promise<any[]> {
    const all: any[] = [];
    let offset = 0;
    const pageSize = 200;

    while (true) {
        const response = await databases.listDocuments(DB_ID, 'js-levels', [
            Query.equal('worldSlug', worldSlug),
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderAsc('order'),
        ]);

        all.push(...response.documents);
        offset += pageSize;

        if (response.documents.length < pageSize) break;
    }

    return all;
}

// ============================================================================
// Affichage
// ============================================================================

function formatExerciseLine(audit: ExerciseAudit): string {
    const criticals = audit.issues.filter(i => i.severity === 'critical');
    const warnings  = audit.issues.filter(i => i.severity === 'warning');

    if (criticals.length > 0) {
        const problems = criticals.map(i => i.message).join(' | ');
        return `  ❌ ${audit.slug} - "${audit.title}" - PROBLEME: ${problems}`;
    } else if (warnings.length > 0) {
        const warns = warnings.map(i => i.message).join(' | ');
        return `  ⚠️  ${audit.slug} - "${audit.title}" - AVERTISSEMENT: ${warns}`;
    } else {
        return `  ✅ ${audit.slug} - "${audit.title}" (testCode: ${audit.testCodeLen}chars, statement: ${audit.statementLen}chars)`;
    }
}

// ============================================================================
// Audit JSBOG (js-levels)
// ============================================================================

interface WorldAuditResult {
    worldSlug: string;
    exercises: ExerciseAudit[];
}

async function auditJsLevels(): Promise<WorldAuditResult[]> {
    const results: WorldAuditResult[] = [];

    for (const worldSlug of JS_WORLDS) {
        const docs = await fetchByWorld(worldSlug);

        const audits: ExerciseAudit[] = docs.map(doc => {
            const testCode    = doc.testCode    as string | undefined;
            const statement   = doc.statement   as string | undefined;
            const starterCode = doc.starterCode as string | undefined;

            const issues: ExerciseIssue[] = [
                ...analyzeTestCodeJS(testCode),
                ...analyzeStatement(statement),
                ...analyzeStarterCode(starterCode),
            ];

            return {
                slug:          doc.slug          as string,
                title:         doc.title         as string || '(sans titre)',
                testCodeLen:   testCode?.trim().length ?? 0,
                statementLen:  statement?.trim().length ?? 0,
                issues,
            };
        });

        results.push({ worldSlug, exercises: audits });
    }

    return results;
}

// ============================================================================
// Audit CBOG (c-exercises)
// ============================================================================

async function auditCExercises(): Promise<ExerciseAudit[]> {
    const docs = await fetchAllDocuments('c-exercises');

    return docs.map(doc => {
        const testCode  = doc.testCode  as string | undefined;
        const statement = doc.statement as string | undefined;
        const slug      = doc.slug      as string;

        const issues: ExerciseIssue[] = [
            ...analyzeTestCodeC(testCode, slug),
            ...analyzeStatement(statement),
            // Pas de starterCode requis pour C (le code de démarrage est géré différemment)
        ];

        return {
            slug,
            title:        doc.title as string || '(sans titre)',
            testCodeLen:  testCode?.trim().length ?? 0,
            statementLen: statement?.trim().length ?? 0,
            issues,
        };
    });
}

// ============================================================================
// Résumé
// ============================================================================

function countOperational(audits: ExerciseAudit[]): number {
    return audits.filter(a => a.issues.filter(i => i.severity === 'critical').length === 0).length;
}

function countCriticals(audits: ExerciseAudit[]): number {
    return audits.filter(a => a.issues.some(i => i.severity === 'critical')).length;
}

function countWarnings(audits: ExerciseAudit[]): number {
    return audits.filter(a =>
        a.issues.some(i => i.severity === 'warning') &&
        a.issues.filter(i => i.severity === 'critical').length === 0
    ).length;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
    console.log('\n=== AUDIT COMPLET DES EXERCICES EN LIGNE ===\n');

    // ── JSBOG ─────────────────────────────────────────────────────────────────
    const worldResults = await auditJsLevels();

    let totalJsExercises = 0;
    let totalJsOperational = 0;
    let totalJsCriticals = 0;
    let totalJsWarnings = 0;

    for (const { worldSlug, exercises } of worldResults) {
        const worldName = worldSlug.toUpperCase().replace(/-/g, ' ');
        console.log(`[js-levels] ${worldName} (${exercises.length} exos)`);

        if (exercises.length === 0) {
            console.log('  (aucun exercice trouvé pour ce world)');
        } else {
            for (const audit of exercises) {
                console.log(formatExerciseLine(audit));
            }
        }

        console.log('');

        totalJsExercises    += exercises.length;
        totalJsOperational  += countOperational(exercises);
        totalJsCriticals    += countCriticals(exercises);
        totalJsWarnings     += countWarnings(exercises);
    }

    // ── CBOG ──────────────────────────────────────────────────────────────────
    const cAudits = await auditCExercises();

    console.log(`[c-exercises] (${cAudits.length} exos)`);
    for (const audit of cAudits) {
        console.log(formatExerciseLine(audit));
    }
    console.log('');

    const cOperational = countOperational(cAudits);
    const cCriticals   = countCriticals(cAudits);
    const cWarnings    = countWarnings(cAudits);

    // ── RÉSUMÉ ────────────────────────────────────────────────────────────────
    const totalCriticals = totalJsCriticals + cCriticals;
    const totalWarnings  = totalJsWarnings  + cWarnings;

    console.log('=== RÉSUMÉ ===');
    console.log(`js-levels:    ${totalJsOperational}/${totalJsExercises} opérationnels (sans problème critique)`);
    console.log(`c-exercises:  ${cOperational}/${cAudits.length} opérationnels (sans problème critique)`);
    console.log(`Problèmes critiques: ${totalCriticals}`);
    console.log(`Avertissements:      ${totalWarnings}`);
    console.log('');

    // Détail par world pour JS
    console.log('--- Détail par world (js-levels) ---');
    for (const { worldSlug, exercises } of worldResults) {
        const ok = countOperational(exercises);
        const crit = countCriticals(exercises);
        const warn = countWarnings(exercises);
        const status = crit > 0 ? '❌' : warn > 0 ? '⚠️ ' : '✅';
        console.log(`  ${status} ${worldSlug.padEnd(20)} ${ok}/${exercises.length} OK  |  critiques: ${crit}  avertissements: ${warn}`);
    }

    console.log('');
}

main().catch(err => {
    console.error('Erreur fatale:', err);
    process.exit(1);
});
