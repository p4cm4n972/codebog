/**
 * API route for executing JavaScript code in a sandboxed environment
 * POST /api/execute
 *
 * Supports both cookie-based and JWT authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'node-appwrite';
import { cookies } from 'next/headers';
import { verifyUserFromJWT, isJsLevelUnlocked } from '@/lib/access-control';
import { isProblemUnlocked } from '@/lib/algobog/access-control';
import { executeInSandbox } from '@/lib/sandbox';

/**
 * Detect ALGOBOG problem slugs (format: {title-slug}-{leetcodeNumber})
 * e.g. "two-sum-1", "climbing-stairs-70", "remove-duplicates-26"
 * JSBOG slugs don't end with a dash followed by digits.
 */
const ALGOBOG_SLUG_PATTERN = /^[a-z][a-z0-9-]*-\d+$/;

/**
 * Detect piscine exercise slugs (format: exNN)
 * e.g. "ex00", "ex01", "ex25"
 * These are always accessible to authenticated users (no progression lock).
 */
const PISCINE_SLUG_PATTERN = /^ex\d+$/;

/**
 * Verify authentication via Appwrite session cookie
 */
async function verifySession(): Promise<{ userId: string; unlockAll: boolean } | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

        if (!sessionCookie) {
            return null;
        }

        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
            .setSession(sessionCookie.value);

        const account = new Account(client);
        const user = await account.get();

        // Check if user has admin/moderator role for unlockAll
        const labels = user.labels || [];
        const unlockAll = labels.includes('admin') || labels.includes('moderator');

        return { userId: user.$id, unlockAll };
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        // `type` is optional: 'jsbog' | 'algobog' — if absent, inferred from slug format
        const { code, exerciseSlug, testCode, type } = await request.json();

        if (!code || !exerciseSlug) {
            return NextResponse.json(
                { error: 'Code and exerciseSlug are required' },
                { status: 400 }
            );
        }

        // Try cookie-based authentication first, then JWT as fallback
        let userInfo: { userId: string; unlockAll: boolean } | null = null;

        // 1. Try session cookie
        userInfo = await verifySession();

        // 2. Fallback to JWT if no cookie
        if (!userInfo) {
            const authHeader = request.headers.get('authorization');
            if (authHeader?.startsWith('Bearer ')) {
                const jwt = authHeader.substring(7);
                userInfo = await verifyUserFromJWT(jwt);
            }
        }

        if (!userInfo) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Route to the correct access control based on exercise type.
        // Explicit `type` param is preferred; regex fallback for backward compatibility.
        // CBOG (C exercises) uses /api/submissions/c — not this endpoint.
        const isAlgobog = type === 'algobog' || (!type && ALGOBOG_SLUG_PATTERN.test(exerciseSlug));
        const isPiscine = PISCINE_SLUG_PATTERN.test(exerciseSlug);
        // JSBOG exercises (type='jsbog', slugs like 'fundamentals-ex00') are already
        // gated by /api/jsbog/exercises which validates access before returning testCode.
        // Any authenticated user reaching here has already passed that gate.
        const isJsbog = type === 'jsbog';

        // Piscine exercises (ex00..exNN) are in the `exercises` collection with no
        // progression lock — any authenticated user can submit them.
        const access = isAlgobog
            ? await isProblemUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll)
            : isPiscine || isJsbog
                ? { hasAccess: true }
                : await isJsLevelUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);

        if (!access.hasAccess) {
            return NextResponse.json(
                { error: 'Access denied', reason: access.reason },
                { status: 403 }
            );
        }

        // Execute code in sandbox
        const result = await executeInSandbox(code, testCode);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Execute API error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: (error as Error).message },
            { status: 500 }
        );
    }
}
