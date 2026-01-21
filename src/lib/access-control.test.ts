import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    verifyUserFromJWT,
    isJsWorldUnlocked,
    isJsLevelUnlocked,
    isCExerciseUnlocked,
} from './access-control';

// Mock account.get response
const mockAccountGet = vi.fn();

// Mock databases.listDocuments response
const mockListDocuments = vi.fn();

// Mock node-appwrite
vi.mock('node-appwrite', () => {
    return {
        Client: class MockClient {
            setEndpoint() { return this; }
            setProject() { return this; }
            setKey() { return this; }
            setJWT() { return this; }
        },
        Account: class MockAccount {
            get = mockAccountGet;
        },
        Databases: class MockDatabases {
            listDocuments = mockListDocuments;
        },
        Query: {
            equal: (field: string, value: unknown) => `${field}=${value}`,
            limit: (n: number) => `limit=${n}`,
            orderAsc: (field: string) => `orderAsc=${field}`,
            orderDesc: (field: string) => `orderDesc=${field}`,
        },
    };
});

describe('access-control', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('verifyUserFromJWT', () => {
        it('should return user info for valid JWT', async () => {
            mockAccountGet.mockResolvedValueOnce({
                $id: 'user123',
                email: 'test@example.com',
                prefs: { role: 'user' },
            });

            const result = await verifyUserFromJWT('valid-jwt-token');

            expect(result).toEqual({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
        });

        it('should return unlockAll=true for admin', async () => {
            mockAccountGet.mockResolvedValueOnce({
                $id: 'admin123',
                email: 'admin@example.com',
                prefs: { role: 'admin' },
            });

            const result = await verifyUserFromJWT('admin-jwt-token');

            expect(result).toEqual({
                userId: 'admin123',
                email: 'admin@example.com',
                role: 'admin',
                unlockAll: true,
            });
        });

        it('should return unlockAll=true for moderator', async () => {
            mockAccountGet.mockResolvedValueOnce({
                $id: 'mod123',
                email: 'mod@example.com',
                prefs: { role: 'moderator' },
            });

            const result = await verifyUserFromJWT('mod-jwt-token');

            expect(result).toEqual({
                userId: 'mod123',
                email: 'mod@example.com',
                role: 'moderator',
                unlockAll: true,
            });
        });

        it('should use fallback admin email when no role in prefs', async () => {
            mockAccountGet.mockResolvedValueOnce({
                $id: 'fallback-admin',
                email: 'manuel.adele@gmail.com',
                prefs: {},
            });

            const result = await verifyUserFromJWT('fallback-jwt');

            expect(result).toEqual({
                userId: 'fallback-admin',
                email: 'manuel.adele@gmail.com',
                role: 'admin',
                unlockAll: true,
            });
        });

        it('should return null for invalid JWT', async () => {
            mockAccountGet.mockRejectedValueOnce(new Error('Invalid JWT'));

            const result = await verifyUserFromJWT('invalid-jwt');

            expect(result).toBeNull();
        });

        it('should default to user role when prefs is undefined', async () => {
            mockAccountGet.mockResolvedValueOnce({
                $id: 'user456',
                email: 'noprefs@example.com',
                prefs: undefined,
            });

            const result = await verifyUserFromJWT('jwt-no-prefs');

            expect(result).toEqual({
                userId: 'user456',
                email: 'noprefs@example.com',
                role: 'user',
                unlockAll: false,
            });
        });
    });

    describe('isJsWorldUnlocked', () => {
        it('should return hasAccess=true for unlockAll users', async () => {
            const result = await isJsWorldUnlocked('user123', 'world-1', true);

            expect(result).toEqual({ hasAccess: true });
            expect(mockListDocuments).not.toHaveBeenCalled();
        });

        it('should return hasAccess=false when world not found', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await isJsWorldUnlocked('user123', 'nonexistent-world', false);

            expect(result).toEqual({ hasAccess: false, reason: 'World not found' });
        });

        it('should return hasAccess=true when world has no unlock requirement', async () => {
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: null }],
            });

            const result = await isJsWorldUnlocked('user123', 'world-1', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=true when unlock requirement is invalid JSON', async () => {
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: 'invalid-json' }],
            });

            const result = await isJsWorldUnlocked('user123', 'world-1', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=true when user meets unlock requirement', async () => {
            // First call: get world info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{
                    slug: 'world-2',
                    unlockRequirement: JSON.stringify({ worldSlug: 'world-1', minPercent: 50 }),
                }],
            });
            // Second call: get levels in prerequisite world (2 levels)
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'level-1' },
                    { slug: 'level-2' },
                ],
            });
            // Third call: get user's completed submissions (1 completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'level-1' }],
            });

            const result = await isJsWorldUnlocked('user123', 'world-2', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=false when user does not meet unlock requirement', async () => {
            // First call: get world info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{
                    slug: 'world-2',
                    unlockRequirement: JSON.stringify({ worldSlug: 'world-1', minPercent: 80 }),
                }],
            });
            // Second call: get levels in prerequisite world (4 levels)
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'level-1' },
                    { slug: 'level-2' },
                    { slug: 'level-3' },
                    { slug: 'level-4' },
                ],
            });
            // Third call: get user's completed submissions (1 completed = 25%)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'level-1' }],
            });

            const result = await isJsWorldUnlocked('user123', 'world-2', false);

            expect(result.hasAccess).toBe(false);
            expect(result.reason).toContain('80%');
            expect(result.reason).toContain('25%');
        });

        it('should handle database errors gracefully', async () => {
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await isJsWorldUnlocked('user123', 'world-1', false);

            expect(result).toEqual({ hasAccess: false, reason: 'Error checking access' });
        });
    });

    describe('isJsLevelUnlocked', () => {
        it('should return hasAccess=true for unlockAll users', async () => {
            const result = await isJsLevelUnlocked('user123', 'level-1', true);

            expect(result).toEqual({ hasAccess: true });
            expect(mockListDocuments).not.toHaveBeenCalled();
        });

        it('should return hasAccess=false when level not found', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await isJsLevelUnlocked('user123', 'nonexistent-level', false);

            expect(result).toEqual({ hasAccess: false, reason: 'Level not found' });
        });

        it('should return hasAccess=true for first level in world', async () => {
            // Get level info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'level-1', worldSlug: 'world-1', order: 1 }],
            });
            // Get world info (for world unlock check)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: null }],
            });

            const result = await isJsLevelUnlocked('user123', 'level-1', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=false when world is locked', async () => {
            // Get level info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'level-1', worldSlug: 'world-2', order: 1 }],
            });
            // Get world info (world requires 80% of world-1)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{
                    slug: 'world-2',
                    unlockRequirement: JSON.stringify({ worldSlug: 'world-1', minPercent: 80 }),
                }],
            });
            // Get prerequisite world levels
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'w1-level-1' }, { slug: 'w1-level-2' }],
            });
            // Get user's completions (0%)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });

            const result = await isJsLevelUnlocked('user123', 'level-1', false);

            expect(result.hasAccess).toBe(false);
            expect(result.reason).toContain('World locked');
        });

        it('should return hasAccess=true when previous level is completed', async () => {
            // Get level info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'level-2', worldSlug: 'world-1', order: 2 }],
            });
            // Get world info (no requirement)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: null }],
            });
            // Get all levels in world
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'level-1', title: 'Level 1', order: 1 },
                    { slug: 'level-2', title: 'Level 2', order: 2 },
                ],
            });
            // Check previous level completion
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'level-1', passed: true }],
            });

            const result = await isJsLevelUnlocked('user123', 'level-2', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=false when previous level not completed', async () => {
            // Get level info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'level-2', worldSlug: 'world-1', order: 2 }],
            });
            // Get world info (no requirement)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: null }],
            });
            // Get all levels in world
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'level-1', title: 'Level 1', order: 1 },
                    { slug: 'level-2', title: 'Level 2', order: 2 },
                ],
            });
            // Check previous level completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });
            // Check current level completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });

            const result = await isJsLevelUnlocked('user123', 'level-2', false);

            expect(result.hasAccess).toBe(false);
            expect(result.reason).toContain('Level 1');
        });

        it('should allow re-access to already completed levels', async () => {
            // Get level info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'level-2', worldSlug: 'world-1', order: 2 }],
            });
            // Get world info (no requirement)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'world-1', unlockRequirement: null }],
            });
            // Get all levels in world
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'level-1', title: 'Level 1', order: 1 },
                    { slug: 'level-2', title: 'Level 2', order: 2 },
                ],
            });
            // Check previous level completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });
            // Check current level completion (already completed!)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'level-2', passed: true }],
            });

            const result = await isJsLevelUnlocked('user123', 'level-2', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should handle database errors gracefully', async () => {
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await isJsLevelUnlocked('user123', 'level-1', false);

            expect(result).toEqual({ hasAccess: false, reason: 'Error checking access' });
        });
    });

    describe('isCExerciseUnlocked', () => {
        it('should return hasAccess=true for unlockAll users', async () => {
            const result = await isCExerciseUnlocked('user123', 'exercise-1', true);

            expect(result).toEqual({ hasAccess: true });
            expect(mockListDocuments).not.toHaveBeenCalled();
        });

        it('should return hasAccess=false when exercise not found', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await isCExerciseUnlocked('user123', 'nonexistent-exercise', false);

            expect(result).toEqual({ hasAccess: false, reason: 'Exercise not found' });
        });

        it('should return hasAccess=true for first exercise in week', async () => {
            // Get exercise info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'exercise-1', week: 'week-1', order: 1 }],
            });
            // Get all exercises in week (exercise-1 is first)
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'exercise-1', title: 'Exercise 1', order: 1 },
                    { slug: 'exercise-2', title: 'Exercise 2', order: 2 },
                ],
            });

            const result = await isCExerciseUnlocked('user123', 'exercise-1', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=true when previous exercise is completed', async () => {
            // Get exercise info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'exercise-2', week: 'week-1', order: 2 }],
            });
            // Get all exercises in week
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'exercise-1', title: 'Exercise 1', order: 1 },
                    { slug: 'exercise-2', title: 'Exercise 2', order: 2 },
                ],
            });
            // Check previous exercise completion
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'exercise-1', passed: true }],
            });

            const result = await isCExerciseUnlocked('user123', 'exercise-2', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should return hasAccess=false when previous exercise not completed', async () => {
            // Get exercise info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'exercise-2', week: 'week-1', order: 2 }],
            });
            // Get all exercises in week
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'exercise-1', title: 'Exercise 1', order: 1 },
                    { slug: 'exercise-2', title: 'Exercise 2', order: 2 },
                ],
            });
            // Check previous exercise completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });
            // Check current exercise completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });

            const result = await isCExerciseUnlocked('user123', 'exercise-2', false);

            expect(result.hasAccess).toBe(false);
            expect(result.reason).toContain('Exercise 1');
        });

        it('should allow re-access to already completed exercises', async () => {
            // Get exercise info
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ slug: 'exercise-2', week: 'week-1', order: 2 }],
            });
            // Get all exercises in week
            mockListDocuments.mockResolvedValueOnce({
                documents: [
                    { slug: 'exercise-1', title: 'Exercise 1', order: 1 },
                    { slug: 'exercise-2', title: 'Exercise 2', order: 2 },
                ],
            });
            // Check previous exercise completion (not completed)
            mockListDocuments.mockResolvedValueOnce({
                documents: [],
            });
            // Check current exercise completion (already completed!)
            mockListDocuments.mockResolvedValueOnce({
                documents: [{ exerciseSlug: 'exercise-2', passed: true }],
            });

            const result = await isCExerciseUnlocked('user123', 'exercise-2', false);

            expect(result).toEqual({ hasAccess: true });
        });

        it('should handle database errors gracefully', async () => {
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await isCExerciseUnlocked('user123', 'exercise-1', false);

            expect(result).toEqual({ hasAccess: false, reason: 'Error checking access' });
        });
    });
});
