import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Create mock functions
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

// Mock isolated-vm with proper class
vi.mock('isolated-vm', () => {
    return {
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
    };
});

// Mock access-control
const mockVerifyUserFromJWT = vi.fn();
const mockIsJsLevelUnlocked = vi.fn();

vi.mock('@/lib/access-control', () => ({
    verifyUserFromJWT: (...args: unknown[]) => mockVerifyUserFromJWT(...args),
    isJsLevelUnlocked: (...args: unknown[]) => mockIsJsLevelUnlocked(...args),
}));

function createMockRequest(body: object, withAuth = false): NextRequest {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (withAuth) {
        headers['Authorization'] = 'Bearer valid-jwt-token';
    }
    return new NextRequest('http://localhost:3000/api/execute', {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    });
}

describe('/api/execute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementations for authenticated requests
        mockVerifyUserFromJWT.mockResolvedValue({
            userId: 'user123',
            email: 'test@example.com',
            role: 'user',
            unlockAll: false,
        });
        mockIsJsLevelUnlocked.mockResolvedValue({ hasAccess: true });
    });

    describe('POST - validation', () => {
        it('should return 400 if code is missing', async () => {
            const request = createMockRequest({
                exerciseSlug: 'test-exercise',
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Code and exerciseSlug are required');
        });

        it('should return 400 if exerciseSlug is missing', async () => {
            const request = createMockRequest({
                code: 'console.log("hello")',
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Code and exerciseSlug are required');
        });

        it('should return 400 if both code and exerciseSlug are missing', async () => {
            const request = createMockRequest({});

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Code and exerciseSlug are required');
        });

        it('should return 400 if code is empty string', async () => {
            const request = createMockRequest({
                code: '',
                exerciseSlug: 'test-exercise',
            });

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
            // Note: Route uses unified auth flow - returns same message for all auth failures
            expect(data.error).toBe('Authentication required');
        });

        it('should return 403 if user does not have access to level', async () => {
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
            expect(data.reason).toBe('Complete previous level first');
        });
    });

    describe('POST - execution', () => {
        it('should execute code successfully with valid inputs', async () => {
            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.results).toBeDefined();
            expect(data.results.passed).toBe(true);
        });

        it('should execute code with test code', async () => {
            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
                testCode: 'assert.equal(add(1, 2), 3, "1 + 2 should equal 3");',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        it('should call dispose on isolate after execution', async () => {
            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'test-exercise',
            }, true);

            await POST(request);

            expect(mockDispose).toHaveBeenCalled();
        });

        it('should verify JWT and check level access', async () => {
            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'test-exercise',
            }, true);

            await POST(request);

            expect(mockVerifyUserFromJWT).toHaveBeenCalledWith('valid-jwt-token');
            expect(mockIsJsLevelUnlocked).toHaveBeenCalledWith('user123', 'test-exercise', false);
        });

        it('should pass unlockAll flag for admin users', async () => {
            mockVerifyUserFromJWT.mockResolvedValueOnce({
                userId: 'admin123',
                email: 'admin@example.com',
                role: 'admin',
                unlockAll: true,
            });

            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'locked-exercise',
            }, true);

            await POST(request);

            expect(mockIsJsLevelUnlocked).toHaveBeenCalledWith('admin123', 'locked-exercise', true);
        });
    });

    describe('POST - error handling', () => {
        it('should handle execution errors gracefully', async () => {
            // Reject on compileScript to simulate code execution error
            mockCompileScript.mockRejectedValueOnce(new Error('Syntax error'));

            const request = createMockRequest({
                code: 'invalid javascript {{{{',
                exerciseSlug: 'test-exercise',
            }, true);

            const response = await POST(request);
            const data = await response.json();

            // Execution errors now return 200 with success: false
            // This is better API design - HTTP status reflects request handling, not code execution
            expect(response.status).toBe(200);
            expect(data.success).toBe(false);
            expect(data.results.passed).toBe(false);
            expect(data.results.error).toBe('Syntax error');
        });

    });
});
