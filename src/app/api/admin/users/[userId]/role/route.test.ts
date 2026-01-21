import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';

// Create mock instances
const mockAccountGet = vi.fn();
const mockUsersGet = vi.fn();
const mockUsersUpdatePrefs = vi.fn();

// Mock next/headers
vi.mock('next/headers', () => ({
    headers: vi.fn(),
}));

// Mock node-appwrite with proper class constructors
vi.mock('node-appwrite', () => {
    return {
        Client: class MockClient {
            setEndpoint() { return this; }
            setProject() { return this; }
            setJWT() { return this; }
            setKey() { return this; }
        },
        Account: class MockAccount {
            get = mockAccountGet;
        },
        Users: class MockUsers {
            get = mockUsersGet;
            updatePrefs = mockUsersUpdatePrefs;
        },
    };
});

import { headers } from 'next/headers';

const mockHeaders = headers as ReturnType<typeof vi.fn>;

function createMockRequest(body: object): Request {
    return new Request('http://localhost:3000/api/admin/users/user-123/role', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer valid-jwt-token',
        },
    });
}

describe('/api/admin/users/[userId]/role', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('PATCH - validation', () => {
        it('should return 400 if role is missing', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            const request = createMockRequest({});
            const params = Promise.resolve({ userId: 'user-123' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Invalid role');
        });

        it('should return 400 if role is invalid', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            const request = createMockRequest({ role: 'superadmin' });
            const params = Promise.resolve({ userId: 'user-123' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Invalid role');
        });

        it('should accept valid roles: user, moderator, admin', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'admin-123',
                email: 'admin@example.com',
                prefs: { role: 'admin' },
            });

            mockUsersGet.mockResolvedValue({
                $id: 'user-123',
                prefs: {},
            });

            mockUsersUpdatePrefs.mockResolvedValue({});

            for (const role of ['user', 'moderator', 'admin']) {
                const request = new Request('http://localhost:3000/api/admin/users/user-123/role', {
                    method: 'PATCH',
                    body: JSON.stringify({ role }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer valid-jwt-token',
                    },
                });
                const params = Promise.resolve({ userId: 'user-123' });

                const response = await PATCH(request, { params });
                expect(response.status).toBe(200);
            }
        });
    });

    describe('PATCH - authentication', () => {
        it('should return 401 if no authorization header', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue(null),
            });

            const request = createMockRequest({ role: 'moderator' });
            const params = Promise.resolve({ userId: 'user-123' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Unauthorized - No token provided');
        });

        it('should return 403 if user is not admin', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'user-123',
                email: 'regular@example.com',
                prefs: { role: 'user' },
            });

            const request = createMockRequest({ role: 'moderator' });
            const params = Promise.resolve({ userId: 'user-456' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.error).toBe('Forbidden - Admin only');
        });

        it('should return 403 if user is moderator (not admin)', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'mod-123',
                email: 'mod@example.com',
                prefs: { role: 'moderator' },
            });

            const request = createMockRequest({ role: 'user' });
            const params = Promise.resolve({ userId: 'user-456' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.error).toBe('Forbidden - Admin only');
        });
    });

    describe('PATCH - success', () => {
        it('should update user role successfully', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'admin-123',
                email: 'admin@example.com',
                prefs: { role: 'admin' },
            });

            mockUsersGet.mockResolvedValue({
                $id: 'user-123',
                prefs: { someOtherPref: 'value' },
            });

            mockUsersUpdatePrefs.mockResolvedValue({});

            const request = createMockRequest({ role: 'moderator' });
            const params = Promise.resolve({ userId: 'user-123' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.userId).toBe('user-123');
            expect(data.role).toBe('moderator');
        });

        it('should work with fallback admin email', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'admin-123',
                email: 'manuel.adele@gmail.com',
                prefs: {},
            });

            mockUsersGet.mockResolvedValue({
                $id: 'user-123',
                prefs: {},
            });

            mockUsersUpdatePrefs.mockResolvedValue({});

            const request = createMockRequest({ role: 'admin' });
            const params = Promise.resolve({ userId: 'user-123' });

            const response = await PATCH(request, { params });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });
    });
});
