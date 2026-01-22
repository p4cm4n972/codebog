import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock access-control
const mockVerifyUserFromJWT = vi.fn();

vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
}));

// Mock gems service
const mockGetTransactionHistory = vi.fn();

vi.mock('@/lib/gems', () => ({
    getTransactionHistory: (...args: unknown[]) => mockGetTransactionHistory(...args),
}));

function createMockRequest(withAuth = false): NextRequest {
    const headers: Record<string, string> = {};
    if (withAuth) {
        headers['Authorization'] = 'Bearer valid-jwt-token';
    }
    return new NextRequest('http://localhost:3000/api/gems/transactions', {
        method: 'GET',
        headers,
    });
}

describe('/api/gems/transactions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockVerifyUserFromJWT.mockResolvedValue({
            userId: 'user123',
            email: 'test@example.com',
        });
    });

    describe('GET', () => {
        it('should return 401 if no authorization header', async () => {
            const request = createMockRequest(false);

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Authentication required');
        });

        it('should return 401 if JWT is invalid', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce(null);

            const request = createMockRequest(true);

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Invalid or expired token');
        });

        it('should return transaction history for authenticated user', async () => {
            const mockTransactions = [
                {
                    $id: 'tx-1',
                    userId: 'user123',
                    type: 'purchase',
                    amount: 100,
                    description: 'Pack 100 gems',
                    createdAt: '2024-01-02T00:00:00Z',
                },
                {
                    $id: 'tx-2',
                    userId: 'user123',
                    type: 'unlock',
                    amount: -25,
                    description: 'Unlock level-1',
                    createdAt: '2024-01-01T00:00:00Z',
                },
            ];

            mockGetTransactionHistory.mockResolvedValueOnce(mockTransactions);

            const request = createMockRequest(true);

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.transactions).toEqual(mockTransactions);
            expect(mockGetTransactionHistory).toHaveBeenCalledWith('user123', 20);
        });

        it('should return empty array if user has no transactions', async () => {
            mockGetTransactionHistory.mockResolvedValueOnce([]);

            const request = createMockRequest(true);

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.transactions).toEqual([]);
        });

        it('should return 500 on server error', async () => {
            mockGetTransactionHistory.mockRejectedValueOnce(new Error('Database error'));

            const request = createMockRequest(true);

            const response = await GET(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal server error');
        });
    });
});
