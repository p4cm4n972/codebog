/**
 * API route for executing JavaScript code in a sandboxed environment
 * POST /api/execute
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT, isJsLevelUnlocked } from '@/lib/access-control';
import { executeInSandbox } from '@/lib/sandbox';

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
