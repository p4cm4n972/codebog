/**
 * API route for unlocking an exercise using gems
 * POST /api/gems/unlock
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT } from '@/lib/access-control';
import { getGemBalance, spendGems, createGemUnlock, checkGemUnlock } from '@/lib/gems';
import { getJsUnlockCost, getCUnlockCost } from '@/lib/gem-config';

interface UnlockRequest {
    exerciseSlug: string;
    exerciseType: 'js' | 'c';
    worldSlug?: string;  // For JS exercises
    week?: string;       // For C exercises
    difficulty?: string; // For JS exercises
}

export async function POST(request: NextRequest) {
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

        // Parse request body
        const body: UnlockRequest = await request.json();
        const { exerciseSlug, exerciseType, worldSlug, week, difficulty } = body;

        if (!exerciseSlug || !exerciseType) {
            return NextResponse.json(
                { error: 'Paramètres manquants', code: 'MISSING_PARAMS' },
                { status: 400 }
            );
        }

        if (exerciseType !== 'js' && exerciseType !== 'c') {
            return NextResponse.json(
                { error: 'Type d\'exercice invalide', code: 'INVALID_TYPE' },
                { status: 400 }
            );
        }

        // Check if already unlocked
        const existingUnlock = await checkGemUnlock(user.userId, exerciseSlug);
        if (existingUnlock) {
            return NextResponse.json(
                { error: 'Exercice déjà débloqué', code: 'ALREADY_UNLOCKED' },
                { status: 400 }
            );
        }

        // Calculate cost based on exercise type
        let cost: number;
        if (exerciseType === 'js') {
            cost = getJsUnlockCost(worldSlug || '', difficulty);
        } else {
            cost = getCUnlockCost(week || '');
        }

        // Check balance
        const balance = await getGemBalance(user.userId);
        if (balance.balance < cost) {
            return NextResponse.json({
                error: 'Gemmes insuffisantes',
                code: 'INSUFFICIENT_GEMS',
                required: cost,
                current: balance.balance,
            }, { status: 400 });
        }

        // Spend gems and create unlock
        const description = `Déblocage: ${exerciseSlug}`;
        const { balance: newBalance } = await spendGems(user.userId, cost, description, exerciseSlug);

        await createGemUnlock(user.userId, exerciseSlug, exerciseType, cost);

        return NextResponse.json({
            success: true,
            exerciseSlug,
            gemsCost: cost,
            newBalance: newBalance.balance,
        });
    } catch (error) {
        console.error('Error unlocking exercise:', error);

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes('Insufficient gems')) {
                return NextResponse.json(
                    { error: 'Gemmes insuffisantes', code: 'INSUFFICIENT_GEMS' },
                    { status: 400 }
                );
            }
            if (error.message.includes('already unlocked')) {
                return NextResponse.json(
                    { error: 'Exercice déjà débloqué', code: 'ALREADY_UNLOCKED' },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/gems/unlock?exerciseSlug=xxx
 * Check the unlock cost for an exercise
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const exerciseSlug = searchParams.get('exerciseSlug');
        const exerciseType = searchParams.get('exerciseType') as 'js' | 'c' | null;
        const worldSlug = searchParams.get('worldSlug');
        const week = searchParams.get('week');
        const difficulty = searchParams.get('difficulty');

        if (!exerciseSlug || !exerciseType) {
            return NextResponse.json(
                { error: 'Paramètres manquants', code: 'MISSING_PARAMS' },
                { status: 400 }
            );
        }

        // Calculate cost
        let cost: number;
        if (exerciseType === 'js') {
            cost = getJsUnlockCost(worldSlug || '', difficulty || undefined);
        } else {
            cost = getCUnlockCost(week || '');
        }

        // Check if user is authenticated and if already unlocked
        const authHeader = request.headers.get('Authorization');
        let isUnlocked = false;
        let userBalance = 0;

        if (authHeader?.startsWith('Bearer ')) {
            const jwt = authHeader.substring(7);
            const user = await verifyUserFromJWT(jwt);

            if (user) {
                const [unlock, balance] = await Promise.all([
                    checkGemUnlock(user.userId, exerciseSlug),
                    getGemBalance(user.userId),
                ]);

                isUnlocked = !!unlock;
                userBalance = balance.balance;
            }
        }

        return NextResponse.json({
            exerciseSlug,
            cost,
            isUnlocked,
            userBalance,
            canAfford: userBalance >= cost,
        });
    } catch (error) {
        console.error('Error getting unlock cost:', error);
        return NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}
