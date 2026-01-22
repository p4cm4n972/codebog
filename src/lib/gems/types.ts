/**
 * Type definitions for the gem system
 */

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

export type TransactionType = GemTransaction['type'];
