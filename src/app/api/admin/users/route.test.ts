import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

// Create mock instances
const mockAccountGet = vi.fn();
const mockUsersList = vi.fn();
const mockDbListDocuments = vi.fn();

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
            list = mockUsersList;
        },
        Databases: class MockDatabases {
            listDocuments = mockDbListDocuments;
        },
        Query: {
            limit: vi.fn().mockReturnValue('limit:100'),
        },
    };
});

import { headers } from 'next/headers';

const mockHeaders = headers as ReturnType<typeof vi.fn>;

describe('/api/admin/users', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET - authentication', () => {
        it('should return 401 if no authorization header', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue(null),
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Unauthorized - No token provided');
        });

        it('should return 401 if authorization header does not start with Bearer', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Basic some-token'),
            });

            const response = await GET();
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

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.error).toBe('Forbidden - Admin only');
        });

        it('should return 403 if user is moderator (not admin)', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'user-123',
                email: 'mod@example.com',
                prefs: { role: 'moderator' },
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.error).toBe('Forbidden - Admin only');
        });
    });

    describe('GET - success', () => {
        it('should return users list for admin', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'admin-123',
                email: 'admin@example.com',
                prefs: { role: 'admin' },
            });

            mockUsersList.mockResolvedValue({
                users: [
                    {
                        $id: 'user-1',
                        name: 'Test User',
                        email: 'test@example.com',
                        emailVerification: true,
                        $createdAt: '2024-01-01T00:00:00.000Z',
                        accessedAt: new Date().toISOString(),
                        prefs: { role: 'user' },
                    },
                ],
                total: 1,
            });

            mockDbListDocuments.mockResolvedValue({
                documents: [],
                total: 0,
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.users).toBeDefined();
            expect(data.stats).toBeDefined();
            expect(data.users).toHaveLength(1);
            expect(data.users[0].email).toBe('test@example.com');
        });

        it('should allow fallback admin email', async () => {
            mockHeaders.mockResolvedValue({
                get: vi.fn().mockReturnValue('Bearer valid-jwt-token'),
            });

            mockAccountGet.mockResolvedValue({
                $id: 'admin-123',
                email: 'manuel.adele@gmail.com',
                prefs: {},
            });

            mockUsersList.mockResolvedValue({
                users: [],
                total: 0,
            });

            mockDbListDocuments.mockResolvedValue({
                documents: [],
                total: 0,
            });

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.users).toBeDefined();
        });
    });
});
