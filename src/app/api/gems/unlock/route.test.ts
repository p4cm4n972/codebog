import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

// Mock verifyUserFromJWT
const mockVerifyUserFromJWT = vi.fn();
vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

// Mock gems functions
const mockGetGemBalance = vi.fn();
const mockSpendGems = vi.fn();
const mockCreateGemUnlock = vi.fn();
const mockCheckGemUnlock = vi.fn();
vi.mock('@/lib/gems', () => ({
    getGemBalance: (...args: unknown[]) => mockGetGemBalance(...args),
    spendGems: (...args: unknown[]) => mockSpendGems(...args),
    createGemUnlock: (...args: unknown[]) => mockCreateGemUnlock(...args),
    checkGemUnlock: (...args: unknown[]) => mockCheckGemUnlock(...args),
}));

// Mock gem-config functions
const mockGetJsUnlockCost = vi.fn();
const mockGetCUnlockCost = vi.fn();
vi.mock('@/lib/gem-config', () => ({
    getJsUnlockCost: (...args: unknown[]) => mockGetJsUnlockCost(...args),
    getCUnlockCost: (...args: unknown[]) => mockGetCUnlockCost(...args),
}));

describe('/api/gems/unlock', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock values
        mockGetJsUnlockCost.mockReturnValue(25);
        mockGetCUnlockCost.mockReturnValue(20);
    });

    describe('POST', () => {
        it('should return 401 when no authorization header', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'js' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('UNAUTHORIZED');
        });

        it('should return 401 when JWT is invalid', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce(null);

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer invalid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'js' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('INVALID_SESSION');
        });

        it('should return 400 when missing required parameters', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1' }), // Missing exerciseType
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.code).toBe('MISSING_PARAMS');
        });

        it('should return 400 when exercise type is invalid', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'python' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.code).toBe('INVALID_TYPE');
        });

        it('should return 400 when exercise is already unlocked', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce({ exerciseSlug: 'level-1' }); // Already unlocked

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'js' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.code).toBe('ALREADY_UNLOCKED');
        });

        it('should return 400 when insufficient gems', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce(null); // Not unlocked yet
            mockGetGemBalance.mockResolvedValueOnce({ balance: 10 }); // Only 10 gems
            mockGetJsUnlockCost.mockReturnValue(25); // Costs 25

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'js', worldSlug: 'world-1' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.code).toBe('INSUFFICIENT_GEMS');
            expect(data.required).toBe(25);
            expect(data.current).toBe(10);
        });

        it('should successfully unlock JS exercise with sufficient gems', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce(null);
            mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });
            mockGetJsUnlockCost.mockReturnValue(25);
            mockSpendGems.mockResolvedValueOnce({ balance: { balance: 75 } });
            mockCreateGemUnlock.mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exerciseSlug: 'level-1',
                    exerciseType: 'js',
                    worldSlug: 'world-1',
                }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.exerciseSlug).toBe('level-1');
            expect(data.gemsCost).toBe(25);
            expect(data.newBalance).toBe(75);

            // Verify gems were spent
            expect(mockSpendGems).toHaveBeenCalledWith('user123', 25, 'Déblocage: level-1', 'level-1');
            expect(mockCreateGemUnlock).toHaveBeenCalledWith('user123', 'level-1', 'js', 25);
        });

        it('should successfully unlock C exercise', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce(null);
            mockGetGemBalance.mockResolvedValueOnce({ balance: 50 });
            mockGetCUnlockCost.mockReturnValue(20);
            mockSpendGems.mockResolvedValueOnce({ balance: { balance: 30 } });
            mockCreateGemUnlock.mockResolvedValueOnce({});

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    exerciseSlug: 'ft_putchar',
                    exerciseType: 'c',
                    week: 'week-1',
                }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.exerciseSlug).toBe('ft_putchar');
            expect(data.gemsCost).toBe(20);
            expect(data.newBalance).toBe(30);
        });

        it('should return 500 on server error', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockRejectedValueOnce(new Error('Database error'));

            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ exerciseSlug: 'level-1', exerciseType: 'js' }),
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.code).toBe('SERVER_ERROR');
        });
    });

    describe('GET', () => {
        it('should return 400 when missing parameters', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/unlock', {
                method: 'GET',
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.code).toBe('MISSING_PARAMS');
        });

        it('should return unlock cost without auth', async () => {
            mockGetJsUnlockCost.mockReturnValue(25);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlock?exerciseSlug=level-1&exerciseType=js&worldSlug=world-1',
                { method: 'GET' }
            );

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.exerciseSlug).toBe('level-1');
            expect(data.cost).toBe(25);
            expect(data.isUnlocked).toBe(false);
            expect(data.userBalance).toBe(0);
            expect(data.canAfford).toBe(false);
        });

        it('should return unlock cost with auth and balance', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce(null);
            mockGetGemBalance.mockResolvedValueOnce({ balance: 100 });
            mockGetJsUnlockCost.mockReturnValue(25);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlock?exerciseSlug=level-1&exerciseType=js&worldSlug=world-1',
                {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer valid-jwt' },
                }
            );

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.cost).toBe(25);
            expect(data.isUnlocked).toBe(false);
            expect(data.userBalance).toBe(100);
            expect(data.canAfford).toBe(true);
        });

        it('should indicate when exercise is already unlocked', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });
            mockCheckGemUnlock.mockResolvedValueOnce({ exerciseSlug: 'level-1' }); // Already unlocked
            mockGetGemBalance.mockResolvedValueOnce({ balance: 50 });
            mockGetCUnlockCost.mockReturnValue(20);

            const request = new NextRequest(
                'http://localhost:3000/api/gems/unlock?exerciseSlug=ft_putchar&exerciseType=c&week=week-1',
                {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer valid-jwt' },
                }
            );

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.isUnlocked).toBe(true);
        });
    });
});
