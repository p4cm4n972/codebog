/**
 * Gem system - barrel export
 *
 * This module provides a unified API for the gem system:
 * - Balance management (get, add, spend, refund)
 * - Transaction history
 * - Exercise unlocks
 */

// Types
export type { UserGems, GemTransaction, ExerciseUnlock, TransactionType } from './types';

// Balance operations
export { getGemBalance, addGems, spendGems, refundGems } from './balance';

// Transaction operations
export { getTransactionHistory, isStripeSessionProcessed } from './transactions';

// Unlock operations
export { checkGemUnlock, createGemUnlock, getUnlockedExercises } from './unlocks';
