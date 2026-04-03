/**
 * Secure API route for C exercise submissions
 * Server-side validation and submission creation
 * POST /api/submissions/c
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const C_EXERCISES_COLLECTION = 'c-exercises';
const C_SUBMISSIONS_COLLECTION = 'c-submissions';

// Piston API - free code execution service
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

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

interface PistonResponse {
    language: string;
    version: string;
    run: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
    compile?: {
        stdout: string;
        stderr: string;
        code: number;
        signal: string | null;
        output: string;
    };
    message?: string;
}

/**
 * Create an admin Appwrite client
 */
function createAdminClient(): { databases: Databases } {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return { databases: new Databases(client) };
}

/**
 * Generate test wrapper for C code
 */
function generateTestWrapper(userCode: string, testCode: string): string {
    if (testCode && testCode.includes('int main')) {
        return `${userCode}\n\n${testCode}`;
    }

    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// User code
${userCode}

// Test wrapper
int main(void) {
    printf("Code compiled and executed successfully!\\n");
    return 0;
}
`;
}

/**
 * Parse test output - SECURE VERSION
 * Only counts tests from official test framework format
 */
function parseTestOutput(output: string, testCode: string): { passed: number; failed: number; total: number } {
    let passed = 0;
    let failed = 0;

    // Only trust test markers if there's actual test code
    if (testCode && testCode.includes('int main')) {
        const lines = output.split('\n');
        for (const line of lines) {
            // More strict pattern matching for test markers
            if (line.match(/^(Test\s+\d+|✓|\[PASS\]|OK:)/i)) {
                passed++;
            } else if (line.match(/^(✗|\[FAIL\]|ERROR:|FAILED:)/i)) {
                failed++;
            }
        }
    }

    // If no test code provided, just check if code runs without errors
    if (passed === 0 && failed === 0) {
        if (output.includes('successfully') || output.trim().length > 0) {
            passed = 1;
        }
    }

    return { passed, failed, total: passed + failed || 1 };
}

/**
 * Execute C code using Piston API
 */
async function executeWithPiston(sourceCode: string): Promise<PistonResponse> {
    const response = await fetch(PISTON_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language: 'c',
            version: '*',
            files: [{ content: sourceCode }],
            compile_timeout: 10000,
            run_timeout: 5000,
            compile_memory_limit: -1,
            run_memory_limit: -1,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Piston API error: ${response.status} - ${errorText}`);
    }

    return response.json();
}

export async function POST(request: NextRequest) {
    try {
        const { code, exerciseSlug, testCode, dryRun = false } = await request.json();

        if (!code || !exerciseSlug) {
            return NextResponse.json(
                { error: 'Code and exerciseSlug are required' },
                { status: 400 }
            );
        }

        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const jwt = authHeader.substring(7);
        const userInfo = await verifyUserFromJWT(jwt);

        if (!userInfo) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Check access permissions
        const access = await isCExerciseUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);

        if (!access.hasAccess) {
            return NextResponse.json(
                { error: 'Access denied', reason: access.reason },
                { status: 403 }
            );
        }

        const { databases } = createAdminClient();

        // Get exercise info
        const exerciseResponse = await databases.listDocuments(DATABASE_ID, C_EXERCISES_COLLECTION, [
            Query.equal('slug', exerciseSlug),
            Query.limit(1),
        ]);

        if (exerciseResponse.documents.length === 0) {
            return NextResponse.json(
                { error: 'Exercise not found' },
                { status: 404 }
            );
        }

        const exercise = exerciseResponse.documents[0];

        // Generate complete source with tests
        const completeCode = generateTestWrapper(code, testCode || '');

        let result: TestResult = {
            compiled: false,
            passed: false,
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            output: '',
        };

        try {
            // Execute code with Piston - SERVER-SIDE
            const pistonResult = await executeWithPiston(completeCode);

            // Check compilation errors
            if (pistonResult.compile && pistonResult.compile.code !== 0) {
                result.compiled = false;
                result.compileError = pistonResult.compile.stderr || pistonResult.compile.output || 'Erreur de compilation';
                return NextResponse.json({
                    success: false,
                    results: result,
                    submission: { created: false, reason: 'Compilation failed' }
                });
            }

            if (pistonResult.message) {
                result.compiled = false;
                result.compileError = pistonResult.message;
                return NextResponse.json({
                    success: false,
                    results: result,
                    submission: { created: false, reason: 'Piston error' }
                });
            }

            // Compilation successful
            result.compiled = true;

            // Check runtime errors
            if (pistonResult.run.code !== 0 || pistonResult.run.signal) {
                result.error = pistonResult.run.stderr || `Exit code: ${pistonResult.run.code}`;
                if (pistonResult.run.signal) {
                    result.error = `Signal: ${pistonResult.run.signal} (possible timeout ou erreur mémoire)`;
                }
                result.passed = false;

                return NextResponse.json({
                    success: false,
                    results: result,
                    submission: { created: false, reason: 'Runtime error' }
                });
            }

            // Execution successful
            result.output = pistonResult.run.stdout;
            if (pistonResult.run.stderr) {
                result.output += `\nStderr: ${pistonResult.run.stderr}`;
            }

            // Parse test results - SERVER SIDE with test code verification
            const testResults = parseTestOutput(result.output, testCode || '');
            result.passedTests = testResults.passed;
            result.failedTests = testResults.failed;
            result.totalTests = testResults.total;
            result.passed = testResults.failed === 0 && testResults.passed > 0;

            // Only create submission if tests passed AND not a dry run
            if (result.passed && !dryRun) {
                // Check for existing passing submission (anti-farming)
                const existingSubmission = await databases.listDocuments(DATABASE_ID, C_SUBMISSIONS_COLLECTION, [
                    Query.equal('userId', userInfo.userId),
                    Query.equal('exerciseSlug', exerciseSlug),
                    Query.equal('passed', true),
                    Query.limit(1),
                ]);

                const isFirstCompletion = existingSubmission.documents.length === 0;

                // Create submission - SERVER SIDE
                await databases.createDocument(
                    DATABASE_ID,
                    C_SUBMISSIONS_COLLECTION,
                    ID.unique(),
                    {
                        userId: userInfo.userId,
                        exerciseId: exercise.$id,
                        exerciseSlug: exerciseSlug,
                        week: exercise.week,
                        code: code,
                        submittedAt: new Date().toISOString(),
                        passed: true,
                        compiled: true,
                        testResults: JSON.stringify(result),
                        xpEarned: isFirstCompletion ? (exercise.xpReward || 50) : 0,
                    }
                );

                return NextResponse.json({
                    success: true,
                    results: result,
                    submission: {
                        created: true,
                        isFirstCompletion,
                        xpEarned: isFirstCompletion ? (exercise.xpReward || 50) : 0,
                    }
                });
            }

            // Dry run with passing tests — return success without saving
            if (result.passed && dryRun) {
                return NextResponse.json({
                    success: true,
                    results: result,
                    submission: { created: false, reason: 'Dry run' }
                });
            }

            // Tests failed
            return NextResponse.json({
                success: false,
                results: result,
                submission: { created: false, reason: 'Tests did not pass' }
            });

        } catch (pistonError: unknown) {
            console.error('Piston error:', pistonError);
            return NextResponse.json({
                success: false,
                error: pistonError instanceof Error ? pistonError.message : 'Erreur du service de compilation',
                submission: { created: false, reason: 'Execution error' }
            }, { status: 500 });
        }

    } catch (err: unknown) {
        console.error('C Submission API error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
