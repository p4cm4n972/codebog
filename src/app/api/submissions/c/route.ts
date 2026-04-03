/**
 * Secure API route for C exercise submissions
 *
 * Execution backend: Judge0 CE (Community Edition)
 *   - Open-source, powers LeetCode / Codeforces
 *   - POST /submissions?wait=true → synchronous result
 *   - Language ID 50 = C (GCC 9.2.0)
 *
 * Flow:
 *   1. Auth + access check
 *   2. Load exercise (testCode + expectedOutput) from Appwrite
 *   3. Build full source = userCode + testCode
 *   4. Execute via Judge0 CE
 *   5. Anti-cheat on submitted source (output comparison vs expectedOutput)
 *   6. Save submission if passed + not dryRun
 *
 * POST /api/submissions/c
 * Body: { code: string, exerciseSlug: string, dryRun?: boolean }
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION = 'c-exercises';
const C_SUBMISSIONS_COLLECTION = 'c-submissions';

// Judge0 CE — Community Edition public instance (ce.judge0.com is the free public endpoint)
// Language 50 = C (GCC 9.2.0)
const JUDGE0_API = 'https://ce.judge0.com';
const JUDGE0_LANG_C = 50;

interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    status: { id: number; description: string };
    time: string | null;
    memory: number | null;
    message?: string;
}

interface TestResult {
    compiled: boolean;
    passed: boolean;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    output: string;
    compileError?: string;
    error?: string;
}

function createAdminClient(): { databases: Databases } {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);
    return { databases: new Databases(client) };
}

/** Normalise output — trim, unify line endings, strip trailing spaces per line */
function normalizeOutput(output: string): string {
    return output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
}

/**
 * Build the complete C source.
 * If testCode provides its own main(), use it; otherwise add a minimal main.
 */
function buildSource(userCode: string, testCode: string | undefined): string {
    if (testCode?.includes('int main')) {
        return `${userCode}\n\n${testCode}`;
    }
    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${userCode}

int main(void) {
    printf("Code compiled and executed successfully!\\n");
    return 0;
}
`;
}

/**
 * Parse test output — count [PASS]/[FAIL] markers from the test harness.
 * Only activated when a real test harness is present (testCode has int main).
 */
function parseTestOutput(output: string, hasHarness: boolean): { passed: number; failed: number; total: number } {
    if (!hasHarness) {
        const ok = output.trim().length > 0;
        return { passed: ok ? 1 : 0, failed: 0, total: 1 };
    }
    let passed = 0;
    let failed = 0;
    for (const line of output.split('\n')) {
        if (line.match(/^(Test\s+\d+|✓|\[PASS\]|OK:)/i)) passed++;
        else if (line.match(/^(✗|\[FAIL\]|ERROR:|FAILED:)/i)) failed++;
    }
    if (passed === 0 && failed === 0 && output.trim().length > 0) passed = 1;
    return { passed, failed, total: passed + failed || 1 };
}

/**
 * Anti-cheat: detect hardcoded expected output in the submitted source.
 * Heuristic: if the first few non-trivial lines of expectedOutput appear as
 * string literals in the code, it's almost certainly a hardcoded answer.
 */
function detectCheat(code: string, expectedOutput: string): { cheating: boolean; reason?: string } {
    const lines = normalizeOutput(expectedOutput)
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2);

    for (const line of lines.slice(0, 3)) {
        if (code.includes(`"${line}"`) || code.includes(`'${line}'`)) {
            return { cheating: true, reason: 'Sortie attendue détectée en dur dans le code source' };
        }
    }
    return { cheating: false };
}

async function executeWithJudge0(sourceCode: string): Promise<Judge0Response> {
    const response = await fetch(`${JUDGE0_API}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language_id: JUDGE0_LANG_C,
            source_code: sourceCode,
            compile_timeout: 10,
            run_timeout: 5,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Judge0 API ${response.status}: ${errorText}`);
    }

    return response.json();
}

export async function POST(request: NextRequest) {
    try {
        const { code, exerciseSlug, dryRun = false } = await request.json();

        if (!code || !exerciseSlug) {
            return NextResponse.json({ error: 'code et exerciseSlug sont requis' }, { status: 400 });
        }

        // ── Auth ─────────────────────────────────────────────────────────────
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
        }
        const jwt = authHeader.substring(7);
        const userInfo = await verifyUserFromJWT(jwt);
        if (!userInfo) {
            return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 401 });
        }

        // ── Access control ────────────────────────────────────────────────────
        const access = await isCExerciseUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);
        if (!access.hasAccess) {
            return NextResponse.json({ error: 'Accès refusé', reason: access.reason }, { status: 403 });
        }

        const { databases } = createAdminClient();

        // ── Load exercise ────────────────────────────────────────────────────
        const exerciseResponse = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
            Query.equal('slug', exerciseSlug),
            Query.limit(1),
        ]);
        if (exerciseResponse.documents.length === 0) {
            return NextResponse.json({ error: 'Exercice introuvable' }, { status: 404 });
        }

        const exercise = exerciseResponse.documents[0];
        const testCode = exercise.testCode as string | undefined;
        const expectedOutput = exercise.expectedOutput as string | undefined;
        const hasHarness = !!(testCode?.includes('int main'));

        // ── Execute via Judge0 ────────────────────────────────────────────────
        const sourceCode = buildSource(code, testCode);
        let judgeResult: Judge0Response;
        try {
            judgeResult = await executeWithJudge0(sourceCode);
        } catch (err) {
            console.error('Judge0 error:', err);
            return NextResponse.json({
                success: false,
                error: err instanceof Error ? err.message : 'Service de compilation indisponible',
                submission: { created: false, reason: 'Execution error' },
            }, { status: 502 });
        }

        // Status 6 = Compilation Error
        if (judgeResult.status.id === 6) {
            return NextResponse.json({
                success: false,
                results: {
                    compiled: false,
                    passed: false,
                    output: '',
                    compileError: judgeResult.compile_output || judgeResult.stderr || 'Erreur de compilation',
                    passedTests: 0, failedTests: 0, totalTests: 0,
                } satisfies TestResult,
                submission: { created: false, reason: 'Compilation failed' },
            });
        }

        // Status 5 = Time Limit Exceeded; 11-13 = Runtime Error
        if (judgeResult.status.id !== 3) {
            return NextResponse.json({
                success: false,
                results: {
                    compiled: true,
                    passed: false,
                    output: judgeResult.stdout || '',
                    error: judgeResult.stderr || `${judgeResult.status.description}`,
                    passedTests: 0, failedTests: 0, totalTests: 0,
                } satisfies TestResult,
                submission: { created: false, reason: judgeResult.status.description },
            });
        }

        // ── Compilation + execution succeeded ─────────────────────────────────
        const rawOutput = judgeResult.stdout || '';
        const normalizedActual = normalizeOutput(rawOutput);
        const testStats = parseTestOutput(normalizedActual, hasHarness);
        const passed = testStats.failed === 0 && testStats.passed > 0;

        const result: TestResult = {
            compiled: true,
            passed,
            output: normalizedActual,
            passedTests: testStats.passed,
            failedTests: testStats.failed,
            totalTests: testStats.total,
        };

        // ── Dry run — return result without saving ────────────────────────────
        if (dryRun) {
            return NextResponse.json({
                success: passed,
                results: result,
                submission: { created: false, reason: 'Dry run' },
            });
        }

        // ── Submission — validate output then save ────────────────────────────
        if (!passed) {
            return NextResponse.json({
                success: false,
                results: result,
                submission: { created: false, reason: 'Tests failed' },
            });
        }

        // Anti-cheat: only meaningful when expectedOutput is stored
        if (expectedOutput) {
            const cheat = detectCheat(code, expectedOutput);
            if (cheat.cheating) {
                return NextResponse.json({
                    success: false,
                    cheatDetected: true,
                    results: {
                        ...result,
                        passed: false,
                        error: `[CHEAT] ${cheat.reason}. Soumission refusée.`,
                    },
                    submission: { created: false, reason: 'Cheat detected' },
                });
            }

            // Output must match stored expected output (prevents prompt-injection tricks)
            if (normalizedActual !== normalizeOutput(expectedOutput)) {
                return NextResponse.json({
                    success: false,
                    results: { ...result, passed: false },
                    submission: { created: false, reason: 'Output mismatch vs expected' },
                });
            }
        }

        // ── Persist submission ───────────────────────────────────────────────
        const existingSubmission = await databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION, [
            Query.equal('userId', userInfo.userId),
            Query.equal('exerciseSlug', exerciseSlug),
            Query.equal('passed', true),
            Query.limit(1),
        ]);
        const isFirstCompletion = existingSubmission.documents.length === 0;

        await databases.createDocument(DATABASE_ID, C_SUBMISSIONS_COLLECTION, ID.unique(), {
            userId: userInfo.userId,
            exerciseId: exercise.$id,
            exerciseSlug,
            code,
            submittedAt: new Date().toISOString(),
            passed: true,
            compiled: true,
            testResults: JSON.stringify(result),
        });

        return NextResponse.json({
            success: true,
            results: result,
            submission: {
                created: true,
                isFirstCompletion,
            },
        });

    } catch (err: unknown) {
        console.error('C Submission API error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Erreur interne' },
            { status: 500 }
        );
    }
}
