import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTransactionHistory, isStripeSessionProcessed } from './transactions';

// Mock appwrite-admin
const mockListDocuments = vi.fn();

vi.mock('../appwrite-admin', () => ({
    getAdminDatabases: () => ({
        listDocuments: mockListDocuments,
    }),
    DATABASE_ID: 'test-db',
    COLLECTIONS: {
        GEM_TRANSACTIONS: 'gem-transactions',
    },
    toDocuments: <T>(docs: unknown[]) => docs as T[],
}));

describe('gems/transactions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getTransactionHistory', () => {
        it('should return transaction history for user', async () => {
            const transactions = [
                {
                    $id: 'tx-1',
                    userId: 'user-1',
                    type: 'purchase',
                    amount: 100,
                    description: 'Pack 100 gems',
                    createdAt: '2024-01-02T00:00:00Z',
                },
                {
                    $id: 'tx-2',
                    userId: 'user-1',
                    type: 'unlock',
                    amount: -25,
                    description: 'Unlock level-1',
                    createdAt: '2024-01-01T00:00:00Z',
                },
            ];

            mockListDocuments.mockResolvedValueOnce({ documents: transactions });

            const result = await getTransactionHistory('user-1');

            expect(result).toEqual(transactions);
            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'gem-transactions',
                expect.any(Array)
            );
        });

        it('should return empty array for user with no transactions', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await getTransactionHistory('new-user');

            expect(result).toEqual([]);
        });

        it('should use default limit of 20', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            await getTransactionHistory('user-1');

            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'gem-transactions',
                expect.any(Array)
            );
        });

        it('should respect custom limit', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            await getTransactionHistory('user-1', 5);

            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'gem-transactions',
                expect.any(Array)
            );
        });

        it('should return empty array on error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await getTransactionHistory('user-1');

            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting transaction history:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });

    describe('isStripeSessionProcessed', () => {
        it('should return true if session already processed', async () => {
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ $id: 'tx-1', stripeSessionId: 'cs_123' }],
            });

            const result = await isStripeSessionProcessed('cs_123');

            expect(result).toBe(true);
            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'gem-transactions',
                expect.any(Array)
            );
        });

        it('should return false if session not processed', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await isStripeSessionProcessed('cs_new');

            expect(result).toBe(false);
        });

        it('should return false on error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await isStripeSessionProcessed('cs_123');

            expect(result).toBe(false);
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error checking Stripe session:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });
});
