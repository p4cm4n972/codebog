/**
 * Gem transaction history operations
 */

import { Query } from 'node-appwrite';
import { getAdminDatabases, DATABASE_ID, COLLECTIONS, toDocuments } from '../appwrite-admin';
import type { GemTransaction } from './types';

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(
    userId: string,
    limit: number = 20
): Promise<GemTransaction[]> {
    const databases = getAdminDatabases();

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.GEM_TRANSACTIONS, [
            Query.equal('userId', userId),
            Query.orderDesc('createdAt'),
            Query.limit(limit),
        ]);

        return toDocuments<GemTransaction>(response.documents);
    } catch (error) {
        console.error('Error getting transaction history:', error);
        return [];
    }
}

/**
 * Check if a Stripe session has already been processed
 * Prevents duplicate gem credits from webhook retries (idempotency)
 */
export async function isStripeSessionProcessed(stripeSessionId: string): Promise<boolean> {
    const databases = getAdminDatabases();

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.GEM_TRANSACTIONS, [
            Query.equal('stripeSessionId', stripeSessionId),
            Query.limit(1),
        ]);

        return response.documents.length > 0;
    } catch (error) {
        console.error('Error checking Stripe session:', error);
        return false;
    }
}
