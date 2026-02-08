/**
 * API route for getting user's exercise unlocks
 * GET /api/gems/unlocks
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT } from '@/lib/access-control';
import { getUnlockedExercises } from '@/lib/gems/unlocks';

export async function GET(request: NextRequest) {
    try {
        // Get JWT from Authorization header
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Non autorisé', code: 'UNAUTHORIZED' },
                { status: 401 }
            );
        }

        const jwt = authHeader.substring(7);
        const user = await verifyUserFromJWT(jwt);

        if (!user) {
            return NextResponse.json(
                { error: 'Session invalide', code: 'INVALID_SESSION' },
                { status: 401 }
            );
        }

        // Optional filter by exercise type
        const { searchParams } = new URL(request.url);
        const exerciseType = searchParams.get('exerciseType');

        // Get all unlocks
        let unlocks = await getUnlockedExercises(user.userId);

        // Filter by type if specified
        if (exerciseType && (exerciseType === 'js' || exerciseType === 'c')) {
            unlocks = unlocks.filter(u => u.exerciseType === exerciseType);
        }

        return NextResponse.json({
            unlocks,
            total: unlocks.length,
        });
    } catch (error) {
        console.error('Error getting exercise unlocks:', error);
        return NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}
