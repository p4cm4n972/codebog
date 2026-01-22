/**
 * Gem system - re-exports for backward compatibility
 *
 * @deprecated Import from '@/lib/gems/index' or specific submodules instead
 *
 * Structure:
 * - @/lib/gems/types      - Type definitions
 * - @/lib/gems/balance    - Balance operations (get, add, spend, refund)
 * - @/lib/gems/transactions - Transaction history, Stripe session checks
 * - @/lib/gems/unlocks    - Exercise unlock operations
 */

export * from './gems/index';
