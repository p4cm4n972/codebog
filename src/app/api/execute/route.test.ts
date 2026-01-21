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

function createMockRequest(body: object): NextRequest {
    return new NextRequest('http://localhost:3000/api/execute', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

describe('/api/execute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
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

    describe('POST - execution', () => {
        it('should execute code successfully with valid inputs', async () => {
            const request = createMockRequest({
                code: 'function add(a, b) { return a + b; }',
                exerciseSlug: 'test-exercise',
            });

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
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
        });

        it('should call dispose on isolate after execution', async () => {
            const request = createMockRequest({
                code: 'const x = 1;',
                exerciseSlug: 'test-exercise',
            });

            await POST(request);

            expect(mockDispose).toHaveBeenCalled();
        });
    });

    describe('POST - error handling', () => {
        it('should handle execution errors gracefully', async () => {
            // Reject on compileScript to simulate code execution error
            mockCompileScript.mockRejectedValueOnce(new Error('Syntax error'));

            const request = createMockRequest({
                code: 'invalid javascript {{{{',
                exerciseSlug: 'test-exercise',
            });

            const response = await POST(request);
            const data = await response.json();

            // The outer catch returns 500 for unexpected errors
            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal server error');
        });

    });
});
