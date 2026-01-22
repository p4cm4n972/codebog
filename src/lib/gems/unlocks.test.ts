import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkGemUnlock, createGemUnlock, getUnlockedExercises } from './unlocks';

// Mock appwrite-admin
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();

vi.mock('../appwrite-admin', () => ({
    getAdminDatabases: () => ({
        listDocuments: mockListDocuments,
        createDocument: mockCreateDocument,
    }),
    DATABASE_ID: 'test-db',
    COLLECTIONS: {
        EXERCISE_UNLOCKS: 'exercise-unlocks',
    },
    toDocument: <T>(doc: unknown) => doc as T,
    toDocuments: <T>(docs: unknown[]) => docs as T[],
}));

describe('gems/unlocks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('checkGemUnlock', () => {
        it('should return unlock record if exercise is unlocked', async () => {
            const unlock = {
                $id: 'unlock-1',
                userId: 'user-1',
                exerciseSlug: 'level-1',
                exerciseType: 'js',
                gemsCost: 25,
                unlockedAt: '2024-01-01T00:00:00Z',
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [unlock] });

            const result = await checkGemUnlock('user-1', 'level-1');

            expect(result).toEqual(unlock);
            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'exercise-unlocks',
                expect.any(Array)
            );
        });

        it('should return null if exercise is not unlocked', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await checkGemUnlock('user-1', 'locked-level');

            expect(result).toBeNull();
        });

        it('should return null on error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await checkGemUnlock('user-1', 'level-1');

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error checking gem unlock:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });

    describe('createGemUnlock', () => {
        it('should create unlock record for new exercise', async () => {
            const newUnlock = {
                $id: 'unlock-new',
                userId: 'user-1',
                exerciseSlug: 'level-2',
                exerciseType: 'js',
                gemsCost: 25,
                unlockedAt: expect.any(String),
            };

            // First call: check if already unlocked (no)
            mockListDocuments.mockResolvedValueOnce({ documents: [] });
            // Second call: create document
            mockCreateDocument.mockResolvedValueOnce(newUnlock);

            const result = await createGemUnlock('user-1', 'level-2', 'js', 25);

            expect(result.userId).toBe('user-1');
            expect(result.exerciseSlug).toBe('level-2');
            expect(result.exerciseType).toBe('js');
            expect(result.gemsCost).toBe(25);

            expect(mockCreateDocument).toHaveBeenCalledWith(
                'test-db',
                'exercise-unlocks',
                expect.any(String),
                expect.objectContaining({
                    userId: 'user-1',
                    exerciseSlug: 'level-2',
                    exerciseType: 'js',
                    gemsCost: 25,
                    unlockedAt: expect.any(String),
                })
            );
        });

        it('should create unlock for C exercise', async () => {
            const newUnlock = {
                $id: 'unlock-c',
                userId: 'user-1',
                exerciseSlug: 'week1-ex1',
                exerciseType: 'c',
                gemsCost: 10,
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [] });
            mockCreateDocument.mockResolvedValueOnce(newUnlock);

            const result = await createGemUnlock('user-1', 'week1-ex1', 'c', 10);

            expect(result.exerciseType).toBe('c');
            expect(mockCreateDocument).toHaveBeenCalledWith(
                'test-db',
                'exercise-unlocks',
                expect.any(String),
                expect.objectContaining({
                    exerciseType: 'c',
                })
            );
        });

        it('should throw error if exercise already unlocked', async () => {
            const existingUnlock = {
                $id: 'unlock-1',
                userId: 'user-1',
                exerciseSlug: 'level-1',
            };

            mockListDocuments.mockResolvedValueOnce({ documents: [existingUnlock] });

            await expect(createGemUnlock('user-1', 'level-1', 'js', 25))
                .rejects.toThrow('Exercise already unlocked');

            expect(mockCreateDocument).not.toHaveBeenCalled();
        });
    });

    describe('getUnlockedExercises', () => {
        it('should return all unlocked exercises for user', async () => {
            const unlocks = [
                {
                    $id: 'unlock-1',
                    userId: 'user-1',
                    exerciseSlug: 'level-3',
                    exerciseType: 'js',
                    gemsCost: 50,
                    unlockedAt: '2024-01-02T00:00:00Z',
                },
                {
                    $id: 'unlock-2',
                    userId: 'user-1',
                    exerciseSlug: 'level-2',
                    exerciseType: 'js',
                    gemsCost: 25,
                    unlockedAt: '2024-01-01T00:00:00Z',
                },
            ];

            mockListDocuments.mockResolvedValueOnce({ documents: unlocks });

            const result = await getUnlockedExercises('user-1');

            expect(result).toEqual(unlocks);
            expect(result.length).toBe(2);
            expect(mockListDocuments).toHaveBeenCalledWith(
                'test-db',
                'exercise-unlocks',
                expect.any(Array)
            );
        });

        it('should return empty array for user with no unlocks', async () => {
            mockListDocuments.mockResolvedValueOnce({ documents: [] });

            const result = await getUnlockedExercises('new-user');

            expect(result).toEqual([]);
        });

        it('should return empty array on error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            mockListDocuments.mockRejectedValueOnce(new Error('Database error'));

            const result = await getUnlockedExercises('user-1');

            expect(result).toEqual([]);
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting unlocked exercises:',
                expect.any(Error)
            );
            consoleSpy.mockRestore();
        });
    });
});
