import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    GEM_PACKS,
    JS_DIFFICULTY_COSTS,
    C_WEEK_COSTS,
    isValidPackId,
    getGemPack,
    getJsUnlockCost,
    getCUnlockCost,
} from './gem-config';

// Mock Appwrite
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();
const mockUpdateDocument = vi.fn();

vi.mock('node-appwrite', () => ({
    Client: class MockClient {
        setEndpoint() { return this; }
        setProject() { return this; }
        setKey() { return this; }
    },
    Databases: class MockDatabases {
        listDocuments = mockListDocuments;
        createDocument = mockCreateDocument;
        updateDocument = mockUpdateDocument;
    },
    Query: {
        equal: (field: string, value: unknown) => `${field}=${value}`,
        limit: (n: number) => `limit=${n}`,
        orderDesc: (field: string) => `orderDesc=${field}`,
    },
    ID: {
        unique: () => 'unique-id',
    },
}));

describe('gem-config', () => {
    describe('GEM_PACKS', () => {
        it('should have 3 packs defined', () => {
            expect(GEM_PACKS).toHaveLength(3);
        });

        it('should have correct pack_100 configuration', () => {
            const pack = GEM_PACKS.find(p => p.id === 'pack_100');
            expect(pack).toBeDefined();
            expect(pack?.gems).toBe(100);
            expect(pack?.price).toBe(200); // 2€ in cents
        });

        it('should have correct pack_500 configuration with bonus', () => {
            const pack = GEM_PACKS.find(p => p.id === 'pack_500');
            expect(pack).toBeDefined();
            expect(pack?.gems).toBe(500);
            expect(pack?.price).toBe(800); // 8€ in cents (25% bonus)
        });

        it('should have correct pack_1000 configuration with bonus', () => {
            const pack = GEM_PACKS.find(p => p.id === 'pack_1000');
            expect(pack).toBeDefined();
            expect(pack?.gems).toBe(1000);
            expect(pack?.price).toBe(1500); // 15€ in cents (33% bonus)
        });
    });

    describe('isValidPackId', () => {
        it('should return true for valid pack IDs', () => {
            expect(isValidPackId('pack_100')).toBe(true);
            expect(isValidPackId('pack_500')).toBe(true);
            expect(isValidPackId('pack_1000')).toBe(true);
        });

        it('should return false for invalid pack IDs', () => {
            expect(isValidPackId('pack_50')).toBe(false);
            expect(isValidPackId('invalid')).toBe(false);
            expect(isValidPackId('')).toBe(false);
        });
    });

    describe('getGemPack', () => {
        it('should return pack for valid ID', () => {
            const pack = getGemPack('pack_100');
            expect(pack).toBeDefined();
            expect(pack?.id).toBe('pack_100');
        });

        it('should return undefined for invalid ID', () => {
            const pack = getGemPack('invalid' as any);
            expect(pack).toBeUndefined();
        });
    });

    describe('JS_DIFFICULTY_COSTS', () => {
        it('should have correct difficulty costs', () => {
            expect(JS_DIFFICULTY_COSTS.easy).toBe(10);
            expect(JS_DIFFICULTY_COSTS.medium).toBe(25);
            expect(JS_DIFFICULTY_COSTS.hard).toBe(50);
        });
    });

    describe('C_WEEK_COSTS', () => {
        it('should have costs for all weeks', () => {
            expect(C_WEEK_COSTS['c00']).toBe(10);
            expect(C_WEEK_COSTS['c01']).toBe(15);
            expect(C_WEEK_COSTS['c02']).toBe(20);
            expect(C_WEEK_COSTS['c03']).toBe(30);
            expect(C_WEEK_COSTS['c04']).toBe(40);
        });
    });

    describe('getJsUnlockCost', () => {
        it('should return cost for known world slugs', () => {
            expect(getJsUnlockCost('variables')).toBe(10);
            expect(getJsUnlockCost('loops')).toBe(10);
            expect(getJsUnlockCost('functions')).toBe(25);
            expect(getJsUnlockCost('objects')).toBe(50);
        });

        it('should return cost based on difficulty for unknown worlds', () => {
            expect(getJsUnlockCost('unknown', 'easy')).toBe(10);
            expect(getJsUnlockCost('unknown', 'medium')).toBe(25);
            expect(getJsUnlockCost('unknown', 'hard')).toBe(50);
        });

        it('should return default cost for unknown world and difficulty', () => {
            expect(getJsUnlockCost('unknown')).toBe(25);
        });
    });

    describe('getCUnlockCost', () => {
        it('should return correct cost for known weeks', () => {
            expect(getCUnlockCost('c00')).toBe(10);
            expect(getCUnlockCost('c01')).toBe(15);
            expect(getCUnlockCost('c02')).toBe(20);
        });

        it('should return default cost for unknown weeks', () => {
            expect(getCUnlockCost('unknown')).toBe(25);
        });
    });
});

describe('gems service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('checkGemUnlock', () => {
        it('should return null when no unlock exists', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const { checkGemUnlock } = await import('./gems');
            const result = await checkGemUnlock('user123', 'level-1');

            expect(result).toBeNull();
        });

        it('should return unlock document when exists', async () => {
            const mockUnlock = {
                $id: 'unlock-1',
                userId: 'user123',
                exerciseSlug: 'level-1',
                exerciseType: 'js',
                gemsCost: 25,
                unlockedAt: '2024-01-01T00:00:00.000Z',
            };
            mockListDocuments.mockResolvedValueOnce({ documents: [mockUnlock] });

            const { checkGemUnlock } = await import('./gems');
            const result = await checkGemUnlock('user123', 'level-1');

            expect(result).toEqual(mockUnlock);
        });

        it('should return null on error', async () => {
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const { checkGemUnlock } = await import('./gems');
            const result = await checkGemUnlock('user123', 'level-1');

            expect(result).toBeNull();
        });
    });

    describe('isStripeSessionProcessed', () => {
        it('should return false when session not found', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const { isStripeSessionProcessed } = await import('./gems');
            const result = await isStripeSessionProcessed('session-123');

            expect(result).toBe(false);
        });

        it('should return true when session exists', async () => {
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ stripeSessionId: 'session-123' }],
            });

            const { isStripeSessionProcessed } = await import('./gems');
            const result = await isStripeSessionProcessed('session-123');

            expect(result).toBe(true);
        });
    });
});
