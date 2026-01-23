/**
 * Secure API route for JS exercise submissions
 * Server-side validation and submission creation
 * POST /api/submissions/js
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, Query, ID } from 'node-appwrite';
import { verifyUserFromJWT, isJsLevelUnlocked } from '@/lib/access-control';
import { executeInSandbox } from '@/lib/sandbox';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const JS_LEVELS_COLLECTION = 'js-levels';
const JS_SUBMISSIONS_COLLECTION = 'js-submissions';

/**
 * Create an admin Appwrite client (uses API key)
 */
function createAdminClient(): { databases: Databases } {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

    return { databases: new Databases(client) };
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { code, exerciseSlug, testCode } = await request.json();

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
        const access = await isJsLevelUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);

        if (!access.hasAccess) {
            return NextResponse.json(
                { error: 'Access denied', reason: access.reason },
                { status: 403 }
            );
        }

        const { databases } = createAdminClient();

        // Get level info for XP reward and world slug
        const levelResponse = await databases.listDocuments(DATABASE_ID, JS_LEVELS_COLLECTION, [
            Query.equal('slug', exerciseSlug),
            Query.limit(1),
        ]);

        if (levelResponse.documents.length === 0) {
            return NextResponse.json(
                { error: 'Level not found' },
                { status: 404 }
            );
        }

        const level = levelResponse.documents[0];

        // Execute code in sandbox - SERVER-SIDE VALIDATION
        const result = await executeInSandbox(code, testCode);

        // Only create submission if tests passed
        if (result.results.passed) {
            // Check for existing passing submission (anti-farming)
            const existingSubmission = await databases.listDocuments(DATABASE_ID, JS_SUBMISSIONS_COLLECTION, [
                Query.equal('userId', userInfo.userId),
                Query.equal('exerciseSlug', exerciseSlug),
                Query.equal('passed', true),
                Query.limit(1),
            ]);

            const isFirstCompletion = existingSubmission.documents.length === 0;

            // Create submission document - SERVER SIDE
            await databases.createDocument(
                DATABASE_ID,
                JS_SUBMISSIONS_COLLECTION,
                ID.unique(),
                {
                    userId: userInfo.userId,
                    exerciseId: level.$id,
                    exerciseSlug: exerciseSlug,
                    worldSlug: level.worldSlug,
                    code: code,
                    submittedAt: new Date().toISOString(),
                    passed: true,
                    testResults: JSON.stringify(result.results),
                    // Only award XP on first completion
                    xpEarned: isFirstCompletion ? level.xpReward : 0,
                }
            );

            return NextResponse.json({
                ...result,
                submission: {
                    created: true,
                    isFirstCompletion,
                    xpEarned: isFirstCompletion ? level.xpReward : 0,
                }
            });
        }

        // Tests failed - return results without creating submission
        return NextResponse.json({
            ...result,
            submission: {
                created: false,
                reason: 'Tests did not pass',
            }
        });

    } catch (error) {
        console.error('Submission API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}
