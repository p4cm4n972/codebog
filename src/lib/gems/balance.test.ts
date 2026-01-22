import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGemBalance, addGems, spendGems, refundGems } from './balance';

// Mock appwrite-admin
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();
const mockUpdateDocument = vi.fn();

vi.mock('../appwrite-admin', () => ({
    getAdminDatabases: () => ({
        listDocuments: mockListDocuments,
        createDocument: mockCreateDocument,
        updateDocument: mockUpdateDocument,
    }),
    DATABASE_ID: 'test-db',
    COLLECTIONS: {
        USER_GEMS: 'user-gems',
        GEM_TRANSACTIONS: 'gem-transactions',
    },
    toDocument: <T>(doc: unknown) => doc as T,
}));

describe('gems/balance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getGemBalance', () => {
        it('should return existing balance', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 500,
                totalPurchased: 1000,
                totalSpent: 500,
                updatedAt: '2024-01-01T00:00:00Z',
            };

            mockListDocuments.mockResolvedValueOnce({
                documents: [existingBalance],
            });

            const result = await getGemBalance('user-1');

            expect(result).toEqual(existingBalance);
            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'user-gems',
                expect.any(Array)
            );
        });

        it('should create new balance for new user', async () => {
            const newBalance = {
                $id: 'new-balance-123',
                userId: 'new-user',
                balance: 0,
                totalPurchased: 0,
                totalSpent: 0,
                updatedAt: expect.any(String),
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [] });
            mockCreateDocument.mockResolvedValueOnce(newBalance);

            const result = await getGemBalance('new-user');

            expect(result.userId).toBe('new-user');
            expect(result.balance).toBe(0);
            expect(mockCreateDocument).toHaveBeenCalledWith(
                'test-db',
                'user-gems',
                expect.any(String),
                expect.objectContaining({
                    userId: 'new-user',
                    balance: 0,
                    totalPurchased: 0,
                    totalSpent: 0,
                })
            );
        });
    });

    describe('addGems', () => {
        it('should add gems and create purchase transaction', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 100,
                totalPurchased: 100,
                totalSpent: 0,
            };

            const updatedBalance = {
                ...existingBalance,
                balance: 200,
                totalPurchased: 200,
            };

            const transaction = {
                $id: 'tx-123',
                userId: 'user-1',
                type: 'purchase',
                amount: 100,
                description: 'Pack 100 gems',
                stripeSessionId: 'cs_123',
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce(updatedBalance);
            mockCreateDocument.mockResolvedValueOnce(transaction);

            const result = await addGems('user-1', 100, 'Pack 100 gems', 'cs_123');

            expect(result.balance.balance).toBe(200);
            expect(result.transaction.type).toBe('purchase');
            expect(result.transaction.amount).toBe(100);

            expect(mockUpdateDocument).toHaveBeenCalledWith(
                'test-db',
                'user-gems',
                'balance-123',
                expect.objectContaining({
                    balance: 200,
                    totalPurchased: 200,
                })
            );

            expect(mockCreateDocument).toHaveBeenCalledWith(
                'test-db',
                'gem-transactions',
                expect.any(String),
                expect.objectContaining({
                    userId: 'user-1',
                    type: 'purchase',
                    amount: 100,
                    stripeSessionId: 'cs_123',
                })
            );
        });

        it('should work without stripeSessionId', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 0,
                totalPurchased: 0,
                totalSpent: 0,
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce({ ...existingBalance, balance: 50 });
            mockCreateDocument.mockResolvedValueOnce({
                $id: 'tx-123',
                type: 'purchase',
                stripeSessionId: null,
            });

            const result = await addGems('user-1', 50, 'Bonus gems');

            expect(result.transaction.stripeSessionId).toBeNull();
        });
    });

    describe('spendGems', () => {
        it('should spend gems and create unlock transaction', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 100,
                totalPurchased: 100,
                totalSpent: 0,
            };

            const updatedBalance = {
                ...existingBalance,
                balance: 75,
                totalSpent: 25,
            };

            const transaction = {
                $id: 'tx-123',
                userId: 'user-1',
                type: 'unlock',
                amount: -25,
                description: 'Déblocage: level-1',
                exerciseSlug: 'level-1',
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce(updatedBalance);
            mockCreateDocument.mockResolvedValueOnce(transaction);

            const result = await spendGems('user-1', 25, 'Déblocage: level-1', 'level-1');

            expect(result.balance.balance).toBe(75);
            expect(result.transaction.type).toBe('unlock');
            expect(result.transaction.amount).toBe(-25);

            expect(mockUpdateDocument).toHaveBeenCalledWith(
                'test-db',
                'user-gems',
                'balance-123',
                expect.objectContaining({
                    balance: 75,
                    totalSpent: 25,
                })
            );
        });

        it('should throw error when insufficient balance', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 10,
                totalPurchased: 10,
                totalSpent: 0,
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });

            await expect(spendGems('user-1', 25, 'Déblocage: level-1'))
                .rejects.toThrow('Insufficient gems: 10 < 25');

            expect(mockUpdateDocument).not.toHaveBeenCalled();
            expect(mockCreateDocument).not.toHaveBeenCalled();
        });

        it('should work without exerciseSlug', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 100,
                totalPurchased: 100,
                totalSpent: 0,
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce({ ...existingBalance, balance: 80 });
            mockCreateDocument.mockResolvedValueOnce({
                $id: 'tx-123',
                type: 'unlock',
                exerciseSlug: null,
            });

            const result = await spendGems('user-1', 20, 'Generic spend');

            expect(result.transaction.exerciseSlug).toBeNull();
        });
    });

    describe('refundGems', () => {
        it('should refund gems and create refund transaction', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 75,
                totalPurchased: 100,
                totalSpent: 25,
            };

            const updatedBalance = {
                ...existingBalance,
                balance: 100,
                totalSpent: 0,
            };

            const transaction = {
                $id: 'tx-123',
                userId: 'user-1',
                type: 'refund',
                amount: 25,
                description: 'Refund for error',
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce(updatedBalance);
            mockCreateDocument.mockResolvedValueOnce(transaction);

            const result = await refundGems('user-1', 25, 'Refund for error');

            expect(result.balance.balance).toBe(100);
            expect(result.balance.totalSpent).toBe(0);
            expect(result.transaction.type).toBe('refund');
            expect(result.transaction.amount).toBe(25);
        });

        it('should not allow negative totalSpent', async () => {
            const existingBalance = {
                $id: 'balance-123',
                userId: 'user-1',
                balance: 50,
                totalPurchased: 100,
                totalSpent: 10,
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingBalance] });
            mockUpdateDocument.mockResolvedValueOnce({
                ...existingBalance,
                balance: 100,
                totalSpent: 0, // Should be max(0, 10-50)
            });
            mockCreateDocument.mockResolvedValueOnce({ $id: 'tx-123' });

            await refundGems('user-1', 50, 'Big refund');

            expect(mockUpdateDocument).toHaveBeenCalledWith(
                'test-db',
                'user-gems',
                'balance-123',
                expect.objectContaining({
                    totalSpent: 0, // Math.max(0, 10-50) = 0
                })
            );
        });
    });
});
