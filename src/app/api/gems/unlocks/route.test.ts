import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock verifyUserFromJWT
const mockVerifyUserFromJWT = vi.fn();
vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

// Mock getUnlockedExercises
const mockGetUnlockedExercises = vi.fn();
vi.mock('@/lib/gems/unlocks', () => ({
    getUnlockedExercises: (...args: unknown[]) => mockGetUnlockedExercises(...args),
}));

describe('/api/gems/unlocks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 401 when no authorization header', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('UNAUTHORIZED');
            expect(data.error).toBe('Non autorisé');
        });

        it('should return 401 when authorization header is malformed', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
                headers: {
                    'Authorization': 'InvalidFormat token123',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('UNAUTHORIZED');
        });

        it('should return 401 when JWT is invalid', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce(null);

            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer invalid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('INVALID_SESSION');
            expect(data.error).toBe('Session invalide');
        });

        it('should return all unlocks for authenticated user', async () => {
            const unlocks = [
                {
                    $id: 'unlock-1',
                    userId: 'user123',
                    exerciseSlug: 'level-1',
                    exerciseType: 'js',
                    gemsCost: 25,
                    unlockedAt: '2024-01-01T00:00:00Z',
                },
                {
                    $id: 'unlock-2',
                    userId: 'user123',
                    exerciseSlug: 'ft_putchar',
                    exerciseType: 'c',
                    gemsCost: 20,
                    unlockedAt: '2024-01-02T00:00:00Z',
                },
                {
                    $id: 'unlock-3',
                    userId: 'user123',
                    exerciseSlug: 'level-2',
                    exerciseType: 'js',
                    gemsCost: 25,
                    unlockedAt: '2024-01-03T00:00:00Z',
                },
            ];

            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockResolvedValueOnce(unlocks);

            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.unlocks).toEqual(unlocks);
            expect(data.total).toBe(3);
            expect(mockGetUnlockedExercises).toHaveBeenCalledWith('user123');
        });

        it('should filter unlocks by exerciseType=js', async () => {
            const allUnlocks = [
                {
                    $id: 'unlock-1',
                    userId: 'user123',
                    exerciseSlug: 'level-1',
                    exerciseType: 'js',
                    gemsCost: 25,
                },
                {
                    $id: 'unlock-2',
                    userId: 'user123',
                    exerciseSlug: 'ft_putchar',
                    exerciseType: 'c',
                    gemsCost: 20,
                },
                {
                    $id: 'unlock-3',
                    userId: 'user123',
                    exerciseSlug: 'level-2',
                    exerciseType: 'js',
                    gemsCost: 25,
                },
            ];

            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockResolvedValueOnce(allUnlocks);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlocks?exerciseType=js',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer valid-jwt',
                    },
                }
            );

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.unlocks.length).toBe(2);
            expect(data.total).toBe(2);
            expect(data.unlocks.every((u: { exerciseType: string }) => u.exerciseType === 'js')).toBe(true);
        });

        it('should filter unlocks by exerciseType=c', async () => {
            const allUnlocks = [
                {
                    $id: 'unlock-1',
                    userId: 'user123',
                    exerciseSlug: 'level-1',
                    exerciseType: 'js',
                    gemsCost: 25,
                },
                {
                    $id: 'unlock-2',
                    userId: 'user123',
                    exerciseSlug: 'ft_putchar',
                    exerciseType: 'c',
                    gemsCost: 20,
                },
                {
                    $id: 'unlock-3',
                    userId: 'user123',
                    exerciseSlug: 'ft_strlen',
                    exerciseType: 'c',
                    gemsCost: 20,
                },
            ];

            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockResolvedValueOnce(allUnlocks);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlocks?exerciseType=c',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer valid-jwt',
                    },
                }
            );

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.unlocks.length).toBe(2);
            expect(data.total).toBe(2);
            expect(data.unlocks.every((u: { exerciseType: string }) => u.exerciseType === 'c')).toBe(true);
        });

        it('should ignore invalid exerciseType filter', async () => {
            const allUnlocks = [
                {
                    $id: 'unlock-1',
                    userId: 'user123',
                    exerciseSlug: 'level-1',
                    exerciseType: 'js',
                    gemsCost: 25,
                },
                {
                    $id: 'unlock-2',
                    userId: 'user123',
                    exerciseSlug: 'ft_putchar',
                    exerciseType: 'c',
                    gemsCost: 20,
                },
            ];

            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockResolvedValueOnce(allUnlocks);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlocks?exerciseType=python',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer valid-jwt',
                    },
                }
            );

            const response = await GET(request);
            const data = await response.json();

            // Should return all unlocks (invalid filter is ignored)
            expect(response.status).toBe(200);
            expect(data.unlocks.length).toBe(2);
            expect(data.total).toBe(2);
        });

        it('should return empty array when user has no unlocks', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'new-user',
                email: 'new@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockResolvedValueOnce([]);

            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.unlocks).toEqual([]);
            expect(data.total).toBe(0);
        });

        it('should return 500 on server error', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
            });
            mockGetUnlockedExercises.mockRejectedValueOnce(new Error('Database error'));

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            const request = new NextRequest('http://localhost:3000/api/gems/unlocks', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.code).toBe('SERVER_ERROR');
            expect(data.error).toBe('Erreur serveur');
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error getting exercise unlocks:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });
});
