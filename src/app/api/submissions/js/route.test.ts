import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock isolated-vm
const mockContextGlobalSet = vi.fn().mockResolvedValue(undefined);
const mockScriptRun = vi.fn().mockResolvedValue(undefined);
const mockCompileScript = vi.fn().mockResolvedValue({ run: mockScriptRun });
const mockCreateContext = vi.fn().mockResolvedValue({
    global: {
        set: mockContextGlobalSet,
        derefInto: vi.fn().mockReturnValue({}),
    },
});
const mockDispose = vi.fn();

vi.mock('isolated-vm', () => ({
    default: {
        Isolate: class MockIsolate {
            createContext = mockCreateContext;
            compileScript = mockCompileScript;
            dispose = mockDispose;
        },
        Reference: class MockReference {
            constructor(public value: unknown) {}
        },
        Callback: class MockCallback {
            constructor(public fn: unknown) {}
        },
    },
    Isolate: class MockIsolate {
        createContext = mockCreateContext;
        compileScript = mockCompileScript;
        dispose = mockDispose;
    },
    Reference: class MockReference {
        constructor(public value: unknown) {}
    },
    Callback: class MockCallback {
        constructor(public fn: unknown) {}
    },
}));

// Mock access-control
const mockVerifyUserFromJWT = vi.fn();
const mockIsJsLevelUnlocked = vi.fn();

vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
    isJsLevelUnlocked: (...args: unknown[]) => mockIsJsLevelUnlocked(...args),
}));

// Mock node-appwrite
const mockListDocuments = vi.fn();
const mockCreateDocument = vi.fn();

vi.mock('node-appwrite', () => ({
    Client: class MockClient {
        setEndpoint = vi.fn().mockReturnThis();
        setProject = vi.fn().mockReturnThis();
        setKey = vi.fn().mockReturnThis();
    },
    Databases: class MockDatabases {
        listDocuments = mockListDocuments;
        createDocument = mockCreateDocument;
    },
    Query: {
        equal: (field: string, value: unknown) => `${field}=${value}`,
        limit: (n: number) => `limit=${n}`,
    },
    ID: {
        unique: () => 'unique-id-123',
    },
}));

function createMockRequest(body: object, withAuth = false): NextRequest {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (withAuth) {
        headers['Authorization'] = 'Bearer valid-jwt-token';
    }
    return new NextRequest('http://localhost:3000/api/submissions/js', {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
}

describe('/api/submissions/js', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementations
        mockVerifyUserFromJWT.mockResolvedValue({
            userId: 'user123',
            email: 'test@example.com',
            role: 'user',
            unlockAll: false,
        });
        mockIsJsLevelUnlocked.mockResolvedValue({ hasAccess: true });

        // Mock level document
        mockListDocuments.mockResolvedValue({
            documents: [{
                $id: 'level-id-123',
                slug: 'test-exercise',
                worldSlug: 'fondations',
                xpReward: 50,
            }],
        });

        // Mock create document success
        mockCreateDocument.mockResolvedValue({ $id: 'submission-id-123' });
    });

    describe('POST - validation', () => {
        it('should return 400 if code is missing', async () => {
            const request = createMockRequest({
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Code and exerciseSlug are required');
        });

        it('should return 400 if exerciseSlug is missing', async () => {
            const request = createMockRequest({
                code: 'console.log("hello")',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Code and exerciseSlug are required');
        });
    });

    describe('POST - authentication', () => {
        it('should return 401 if no authorization header', async () => {
            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'test-exercise',
            }, false);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Authentication required');
        });

        it('should return 401 if JWT is invalid', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce(null);

            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Invalid or expired token');
        });

        it('should return 403 if user does not have access', async () => {
            mockIsJsLevelUnlocked.mockResolvedValueOnce({
                hasAccess: false,
                reason: 'Complete previous level first',
            });

            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'locked-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(403);
            expect(data.error).toBe('Access denied');
        });
    });

    describe('POST - submission creation', () => {
        it('should create submission only when tests pass', async () => {
            // Mock no existing submission (first completion)
            mockListDocuments
                .mockResolvedValueOnce({ documents: [{ $id: 'level-id', slug: 'test-exercise', worldSlug: 'fondations', xpReward: 50 }] }) // level query
                .mockResolvedValueOnce({ documents: [] }); // no existing submission

            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.results.passed).toBe(true);
            expect(data.submission.created).toBe(true);
            expect(data.submission.isFirstCompletion).toBe(true);
            expect(data.submission.xpEarned).toBe(50);
            expect(mockCreateDocument).toHaveBeenCalled();
        });

        it('should not award XP on subsequent completions', async () => {
            // Mock existing passing submission
            mockListDocuments
                .mockResolvedValueOnce({ documents: [{ $id: 'level-id', slug: 'test-exercise', worldSlug: 'fondations', xpReward: 50 }] }) // level
                .mockResolvedValueOnce({ documents: [{ $id: 'existing-submission' }] }); // existing submission

            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.submission.created).toBe(true);
            expect(data.submission.isFirstCompletion).toBe(false);
            expect(data.submission.xpEarned).toBe(0); // No XP for repeat completion
        });

        it('should not create submission when tests fail', async () => {
            // Make tests fail by mocking a compile error
            mockCompileScript.mockRejectedValueOnce(new Error('Syntax error'));

            const request = createMockRequest({
                code: 'invalid code {{{',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.results.passed).toBe(false);
            expect(data.submission.created).toBe(false);
            // createDocument should only be called for level lookup, not submission
        });
    });

    describe('POST - server-side validation', () => {
        it('should execute tests server-side, not trust client results', async () => {
            // This test verifies that the server actually runs the tests
            // and doesn't just accept whatever the client sends
            mockListDocuments
                .mockResolvedValueOnce({ documents: [{ $id: 'level-id', slug: 'test-exercise', worldSlug: 'fondations', xpReward: 50 }] })
                .mockResolvedValueOnce({ documents: [] });

            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
                testCode: 'assert.equal(add(1, 2), 3);',
            }, true);

            await POST(request);

            // Verify sandbox execution was called
            expect(mockCompileScript).toHaveBeenCalled();
            expect(mockScriptRun).toHaveBeenCalled();
        });
    });
});
