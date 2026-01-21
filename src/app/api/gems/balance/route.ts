/**
 * API route for getting user's gem balance
 * GET /api/gems/balance
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT } from '@/lib/access-control';
import { getGemBalance, getTransactionHistory } from '@/lib/gems';

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

        // Get balance and recent transactions
        const [balance, transactions] = await Promise.all([
            getGemBalance(user.userId),
            getTransactionHistory(user.userId, 10),
        ]);

        return NextResponse.json({
            balance: balance.balance,
            totalPurchased: balance.totalPurchased,
            totalSpent: balance.totalSpent,
            recentTransactions: transactions,
        });
    } catch (error) {
        console.error('Error getting gem balance:', error);
        return NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        );
    }
}
