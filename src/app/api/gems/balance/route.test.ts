import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock verifyUserFromJWT
const mockVerifyUserFromJWT = vi.fn();
vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

// Mock gems functions
const mockGetGemBalance = vi.fn();
const mockGetTransactionHistory = vi.fn();
vi.mock('@/lib/gems', () => ({
    getGemBalance: (...args: unknown[]) => mockGetGemBalance(...args),
    getTransactionHistory: (...args: unknown[]) => mockGetTransactionHistory(...args),
}));

describe('/api/gems/balance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 401 when no authorization header', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
                method: 'GET',
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('UNAUTHORIZED');
        });

        it('should return 401 when authorization header is invalid format', async () => {
            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
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

            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer invalid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.code).toBe('INVALID_SESSION');
        });

        it('should return balance and transactions for valid user', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });

            mockGetGemBalance.mockResolvedValueOnce({
                balance: 500,
                totalPurchased: 1000,
                totalSpent: 500,
            });

            mockGetTransactionHistory.mockResolvedValueOnce([
                { type: 'purchase', amount: 100, description: 'Pack 100' },
                { type: 'unlock', amount: -25, description: 'Déblocage: level-1' },
            ]);

            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.balance).toBe(500);
            expect(data.totalPurchased).toBe(1000);
            expect(data.totalSpent).toBe(500);
            expect(data.recentTransactions).toHaveLength(2);
        });

        it('should return 0 balance for new user', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'newuser',
                email: 'new@example.com',
                role: 'user',
                unlockAll: false,
            });

            mockGetGemBalance.mockResolvedValueOnce({
                balance: 0,
                totalPurchased: 0,
                totalSpent: 0,
            });

            mockGetTransactionHistory.mockResolvedValueOnce([]);

            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.balance).toBe(0);
            expect(data.recentTransactions).toHaveLength(0);
        });

        it('should return 500 on server error', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'user123',
                email: 'test@example.com',
                role: 'user',
                unlockAll: false,
            });

            mockGetGemBalance.mockRejectedValueOnce(new Error('Database error'));

            const request = new NextRequest('http://localhost:3000/api/gems/balance', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer valid-jwt',
                },
            });

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.code).toBe('SERVER_ERROR');
        });
    });
});
