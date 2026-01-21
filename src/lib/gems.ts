/**
 * Server-side gem system operations
 * Handles balance management, transactions, and exercise unlocks
 */

import { Client, Databases, Query, ID } from 'node-appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

// Collections
const USER_GEMS_COLLECTION = 'user-gems';
const GEM_TRANSACTIONS_COLLECTION = 'gem-transactions';
const EXERCISE_UNLOCKS_COLLECTION = 'exercise-unlocks';

// Types
export interface UserGems {
    $id: string;
    userId: string;
    balance: number;
    totalPurchased: number;
    totalSpent: number;
    updatedAt: string;
}

export interface GemTransaction {
    $id: string;
    userId: string;
    type: 'purchase' | 'unlock' | 'refund';
    amount: number;
    description: string;
    exerciseSlug?: string;
    stripeSessionId?: string;
    createdAt: string;
}

export interface ExerciseUnlock {
    $id: string;
    userId: string;
    exerciseSlug: string;
    exerciseType: 'js' | 'c';
    gemsCost: number;
    unlockedAt: string;
}

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

/**
 * Get or create gem balance for a user
 */
export async function getGemBalance(userId: string): Promise<UserGems> {
    const { databases } = createAdminClient();

    try {
        // Try to find existing balance
        const response = await databases.listDocuments(DATABASE_ID, USER_GEMS_COLLECTION, [
            Query.equal('userId', userId),
            Query.limit(1),
        ]);

        if (response.documents.length > 0) {
            return response.documents[0] as unknown as UserGems;
        }

        // Create new balance document
        const now = new Date().toISOString();
        const newBalance = await databases.createDocument(
            DATABASE_ID,
            USER_GEMS_COLLECTION,
            ID.unique(),
            {
                userId,
                balance: 0,
                totalPurchased: 0,
                totalSpent: 0,
                updatedAt: now,
            }
        );

        return newBalance as unknown as UserGems;
    } catch (error) {
        console.error('Error getting gem balance:', error);
        throw error;
    }
}

/**
 * Add gems to user balance (e.g., after Stripe purchase)
 */
export async function addGems(
    userId: string,
    amount: number,
    description: string,
    stripeSessionId?: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const { databases } = createAdminClient();

    try {
        // Get current balance
        const userGems = await getGemBalance(userId);

        // Update balance
        const now = new Date().toISOString();
        const updatedBalance = await databases.updateDocument(
            DATABASE_ID,
            USER_GEMS_COLLECTION,
            userGems.$id,
            {
                balance: userGems.balance + amount,
                totalPurchased: userGems.totalPurchased + amount,
                updatedAt: now,
            }
        );

        // Create transaction record
        const transaction = await databases.createDocument(
            DATABASE_ID,
            GEM_TRANSACTIONS_COLLECTION,
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
            balance: updatedBalance as unknown as UserGems,
            transaction: transaction as unknown as GemTransaction,
        };
    } catch (error) {
        console.error('Error adding gems:', error);
        throw error;
    }
}

/**
 * Spend gems (e.g., to unlock an exercise)
 */
export async function spendGems(
    userId: string,
    amount: number,
    description: string,
    exerciseSlug?: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const { databases } = createAdminClient();

    try {
        // Get current balance
        const userGems = await getGemBalance(userId);

        // Check sufficient balance
        if (userGems.balance < amount) {
            throw new Error(`Insufficient gems: ${userGems.balance} < ${amount}`);
        }

        // Update balance
        const now = new Date().toISOString();
        const updatedBalance = await databases.updateDocument(
            DATABASE_ID,
            USER_GEMS_COLLECTION,
            userGems.$id,
            {
                balance: userGems.balance - amount,
                totalSpent: userGems.totalSpent + amount,
                updatedAt: now,
            }
        );

        // Create transaction record (negative amount for spending)
        const transaction = await databases.createDocument(
            DATABASE_ID,
            GEM_TRANSACTIONS_COLLECTION,
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
            balance: updatedBalance as unknown as UserGems,
            transaction: transaction as unknown as GemTransaction,
        };
    } catch (error) {
        console.error('Error spending gems:', error);
        throw error;
    }
}

/**
 * Refund gems (e.g., if something went wrong)
 */
export async function refundGems(
    userId: string,
    amount: number,
    description: string
): Promise<{ balance: UserGems; transaction: GemTransaction }> {
    const { databases } = createAdminClient();

    try {
        const userGems = await getGemBalance(userId);

        const now = new Date().toISOString();
        const updatedBalance = await databases.updateDocument(
            DATABASE_ID,
            USER_GEMS_COLLECTION,
            userGems.$id,
            {
                balance: userGems.balance + amount,
                totalSpent: Math.max(0, userGems.totalSpent - amount),
                updatedAt: now,
            }
        );

        const transaction = await databases.createDocument(
            DATABASE_ID,
            GEM_TRANSACTIONS_COLLECTION,
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
            balance: updatedBalance as unknown as UserGems,
            transaction: transaction as unknown as GemTransaction,
        };
    } catch (error) {
        console.error('Error refunding gems:', error);
        throw error;
    }
}

/**
 * Check if an exercise is unlocked via gems
 */
export async function checkGemUnlock(
    userId: string,
    exerciseSlug: string
): Promise<ExerciseUnlock | null> {
    const { databases } = createAdminClient();

    try {
        const response = await databases.listDocuments(DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, [
            Query.equal('userId', userId),
            Query.equal('exerciseSlug', exerciseSlug),
            Query.limit(1),
        ]);

        if (response.documents.length > 0) {
            return response.documents[0] as unknown as ExerciseUnlock;
        }

        return null;
    } catch (error) {
        console.error('Error checking gem unlock:', error);
        return null;
    }
}

/**
 * Create an exercise unlock record after spending gems
 */
export async function createGemUnlock(
    userId: string,
    exerciseSlug: string,
    exerciseType: 'js' | 'c',
    gemsCost: number
): Promise<ExerciseUnlock> {
    const { databases } = createAdminClient();

    try {
        // Check if already unlocked
        const existing = await checkGemUnlock(userId, exerciseSlug);
        if (existing) {
            throw new Error('Exercise already unlocked');
        }

        const now = new Date().toISOString();
        const unlock = await databases.createDocument(
            DATABASE_ID,
            EXERCISE_UNLOCKS_COLLECTION,
            ID.unique(),
            {
                userId,
                exerciseSlug,
                exerciseType,
                gemsCost,
                unlockedAt: now,
            }
        );

        return unlock as unknown as ExerciseUnlock;
    } catch (error) {
        console.error('Error creating gem unlock:', error);
        throw error;
    }
}

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(
    userId: string,
    limit: number = 20
): Promise<GemTransaction[]> {
    const { databases } = createAdminClient();

    try {
        const response = await databases.listDocuments(DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, [
            Query.equal('userId', userId),
            Query.orderDesc('createdAt'),
            Query.limit(limit),
        ]);

        return response.documents as unknown as GemTransaction[];
    } catch (error) {
        console.error('Error getting transaction history:', error);
        return [];
    }
}

/**
 * Get user's unlocked exercises
 */
export async function getUnlockedExercises(userId: string): Promise<ExerciseUnlock[]> {
    const { databases } = createAdminClient();

    try {
        const response = await databases.listDocuments(DATABASE_ID, EXERCISE_UNLOCKS_COLLECTION, [
            Query.equal('userId', userId),
            Query.orderDesc('unlockedAt'),
            Query.limit(100),
        ]);

        return response.documents as unknown as ExerciseUnlock[];
    } catch (error) {
        console.error('Error getting unlocked exercises:', error);
        return [];
    }
}

/**
 * Check if a Stripe session has already been processed
 * Prevents duplicate gem credits from webhook retries
 */
export async function isStripeSessionProcessed(stripeSessionId: string): Promise<boolean> {
    const { databases } = createAdminClient();

    try {
        const response = await databases.listDocuments(DATABASE_ID, GEM_TRANSACTIONS_COLLECTION, [
            Query.equal('stripeSessionId', stripeSessionId),
            Query.limit(1),
        ]);

        return response.documents.length > 0;
    } catch (error) {
        console.error('Error checking Stripe session:', error);
        return false;
    }
}
