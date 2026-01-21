import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

export async function POST(request: NextRequest) {
    try {
        const { exerciseSlug } = await request.json();

        if (!exerciseSlug) {
            return NextResponse.json(
                { error: 'exerciseSlug is required' },
                { status: 400 }
            );
        }

        // Verify user authentication via JWT
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

        // Check access
        const access = await isCExerciseUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);

        return NextResponse.json({
            hasAccess: access.hasAccess,
            reason: access.reason,
            userId: userInfo.userId,
        });
    } catch (error) {
        console.error('Access check error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
