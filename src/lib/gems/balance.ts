/**
 * Gem balance management operations
 */

import { Query, ID } from 'node-appwrite';
import { getAdminDatabases, DATABASE_ID, COLLECTIONS, toDocument } from '../appwrite-admin';
import type { UserGems, GemTransaction } from './types';

/**
 * Get or create gem balance for a user
 */
export async function getGemBalance(userId: string): Promise<UserGems> {
    const databases = getAdminDatabases();

    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USER_GEMS, [
        Query.equal('userId', userId),
        Query.limit(1),
    ]);

    if (response.documents.length > 0) {
        return toDocument<UserGems>(response.documents[0]);
    }

    // Create new balance document for new user
    const now = new Date().toISOString();
    const newBalance = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USER_GEMS,
        ID.unique(),
        {
            userId,
            balance: 0,
            totalPurchased: 0,
            totalSpent: 0,
            updatedAt: now,
        }
    );

    return toDocument<UserGems>(newBalance);
}

/**
 * Add gems to user balance (after Stripe purchase)
 */
export async function addGems(
    userId: string,
    amount: number,
    description: string,
    stripeSessionId?: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const databases = getAdminDatabases();
    const userGems = await getGemBalance(userId);
    const now = new Date().toISOString();

    const updatedBalance = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_GEMS,
        userGems.$id,
        {
            balance: userGems.balance + amount,
            totalPurchased: userGems.totalPurchased + amount,
            updatedAt: now,
        }
    );

    const transaction = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.GEM_TRANSACTIONS,
        ID.unique(),
        {
            userId,
            type: 'purchase',
            amount,
            description,
            stripeSessionId: stripeSessionId || null,
            createdAt: now,
        }
    );

    return {
        balance: toDocument<UserGems>(updatedBalance),
        transaction: toDocument<GemTransaction>(transaction),
    };
}

/**
 * Spend gems (to unlock an exercise)
 */
export async function spendGems(
    userId: string,
    amount: number,
    description: string,
    exerciseSlug?: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const databases = getAdminDatabases();
    const userGems = await getGemBalance(userId);

    if (userGems.balance < amount) {
        throw new Error(`Insufficient gems: ${userGems.balance} < ${amount}`);
    }

    const now = new Date().toISOString();

    const updatedBalance = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_GEMS,
        userGems.$id,
        {
            balance: userGems.balance - amount,
            totalSpent: userGems.totalSpent + amount,
            updatedAt: now,
        }
    );

    const transaction = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.GEM_TRANSACTIONS,
        ID.unique(),
        {
            userId,
            type: 'unlock',
            amount: -amount,
            description,
            exerciseSlug: exerciseSlug || null,
            createdAt: now,
        }
    );

    return {
        balance: toDocument<UserGems>(updatedBalance),
        transaction: toDocument<GemTransaction>(transaction),
    };
}

/**
 * Refund gems (if something went wrong)
 */
export async function refundGems(
    userId: string,
    amount: number,
    description: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const databases = getAdminDatabases();
    const userGems = await getGemBalance(userId);
    const now = new Date().toISOString();

    const updatedBalance = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USER_GEMS,
        userGems.$id,
        {
            balance: userGems.balance + amount,
            totalSpent: Math.max(0, userGems.totalSpent - amount),
            updatedAt: now,
        }
    );

    const transaction = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.GEM_TRANSACTIONS,
        ID.unique(),
        {
            userId,
            type: 'refund',
            amount,
            description,
            createdAt: now,
        }
    );

    return {
        balance: toDocument<UserGems>(updatedBalance),
        transaction: toDocument<GemTransaction>(transaction),
    };
}
