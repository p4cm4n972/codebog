/**
 * API route for fetching user's gem transaction history
 * GET /api/gems/transactions
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT } from '@/lib/access-control';
import { getTransactionHistory } from '@/lib/gems';

export async function GET(request: NextRequest) {
    try {
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

        // Get transaction history
        const transactions = await getTransactionHistory(userInfo.userId, 20);

        return NextResponse.json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
