import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeInSandbox } from './vm-runner';

// Mock functions
const mockRun = vi.fn().mockResolvedValue(undefined);
const mockCompileScript = vi.fn().mockResolvedValue({ run: mockRun });
const mockContextGlobalSet = vi.fn().mockResolvedValue(undefined);
const mockDerefInto = vi.fn().mockReturnValue({});
const mockCreateContext = vi.fn().mockResolvedValue({
    global: {
        set: mockContextGlobalSet,
        derefInto: mockDerefInto,
    },
});
const mockDispose = vi.fn();

// Mock isolated-vm
vi.mock('isolated-vm', () => ({
    default: {
        Isolate: class MockIsolate {
            createContext = mockCreateContext;
            compileScript = mockCompileScript;
            dispose = mockDispose;
        },
        Reference: class MockReference<T> {
            constructor(public value: T) {}
        },
        Callback: class MockCallback {
            constructor(public fn: (...args: unknown[]) => void) {}
        },
    },
    Isolate: class MockIsolate {
        createContext = mockCreateContext;
        compileScript = mockCompileScript;
        dispose = mockDispose;
    },
    Reference: class MockReference<T> {
        constructor(public value: T) {}
    },
    Callback: class MockCallback {
        constructor(public fn: (...args: unknown[]) => void) {}
    },
}));

describe('sandbox/vm-runner', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRun.mockResolvedValue(undefined);
        mockCompileScript.mockResolvedValue({ run: mockRun });
    });

    describe('executeInSandbox', () => {
        it('should execute simple code successfully', async () => {
            const result = await executeInSandbox('const x = 1;');

            expect(result.success).toBe(true);
            expect(result.results.passed).toBe(true);
            expect(mockDispose).toHaveBeenCalled();
        });

        it('should set up sandbox environment', async () => {
            await executeInSandbox('const x = 1;');

            // Verify context was created
            expect(mockCreateContext).toHaveBeenCalled();

            // Verify global setup calls
            expect(mockContextGlobalSet).toHaveBeenCalledWith('global', expect.anything());
            expect(mockContextGlobalSet).toHaveBeenCalledWith('_log', expect.anything());
            expect(mockContextGlobalSet).toHaveBeenCalledWith('assert', expect.anything());
        });

        it('should compile and run user code', async () => {
            const userCode = 'function add(a, b) { return a + b; }';

            await executeInSandbox(userCode);

            // compileScript is called multiple times: console setup + user code
            expect(mockCompileScript).toHaveBeenCalled();
            expect(mockRun).toHaveBeenCalled();
        });

        it('should execute with test code when provided', async () => {
            const userCode = 'function add(a, b) { return a + b; }';
            const testCode = 'assert.equal(add(1, 2), 3);';

            await executeInSandbox(userCode, testCode);

            // Should compile console setup, user code, and test code
            expect(mockCompileScript).toHaveBeenCalledTimes(3);
        });

        it('should return success without tests when testCode is empty', async () => {
            const result = await executeInSandbox('const x = 1;', '');

            expect(result.success).toBe(true);
            expect(result.results.passed).toBe(true);
            expect(result.results.message).toContain('Tous les tests sont passés');
        });

        it('should return success without tests when testCode is whitespace', async () => {
            const result = await executeInSandbox('const x = 1;', '   ');

            expect(result.success).toBe(true);
            expect(result.results.passed).toBe(true);
        });

        it('should handle compilation errors', async () => {
            mockCompileScript.mockRejectedValueOnce(new Error('SyntaxError: Unexpected token'));

            const result = await executeInSandbox('invalid javascript {{{');

            expect(result.success).toBe(false);
            expect(result.results.passed).toBe(false);
            expect(result.results.error).toContain('SyntaxError');
        });

        it('should handle runtime errors in user code', async () => {
            // First call (console setup) succeeds, second call (user code) fails
            mockCompileScript
                .mockResolvedValueOnce({ run: mockRun })
                .mockResolvedValueOnce({
                    run: vi.fn().mockRejectedValue(new Error('ReferenceError: x is not defined')),
                });

            const result = await executeInSandbox('console.log(undefinedVar);');

            // Runtime errors return success: true (execution happened) with results.passed: false
            expect(result.success).toBe(true);
            expect(result.results.passed).toBe(false);
            expect(result.results.error).toContain('ReferenceError');
        });

        it('should handle errors in test code', async () => {
            // Console setup and user code succeed, test code fails
            mockCompileScript
                .mockResolvedValueOnce({ run: mockRun }) // console setup
                .mockResolvedValueOnce({ run: mockRun }) // user code
                .mockResolvedValueOnce({
                    run: vi.fn().mockRejectedValue(new Error('Test error')),
                });

            const result = await executeInSandbox('const x = 1;', 'assert.fail();');

            expect(result.success).toBe(true); // Execution itself succeeded
            expect(result.results.output).toContain('Erreur dans les tests');
        });

        it('should always dispose isolate even on error', async () => {
            mockCompileScript.mockRejectedValueOnce(new Error('Error'));

            await executeInSandbox('bad code');

            expect(mockDispose).toHaveBeenCalled();
        });

        it('should use custom config when provided', async () => {
            const customConfig = { memoryLimit: 256, timeout: 10000 };

            await executeInSandbox('const x = 1;', undefined, customConfig);

            // The isolate should be created (we can't easily verify memory limit in mock)
            expect(mockCreateContext).toHaveBeenCalled();
        });

        it('should return proper result structure on success', async () => {
            const result = await executeInSandbox('const x = 1;');

            expect(result).toHaveProperty('success', true);
            expect(result).toHaveProperty('results');
            expect(result.results).toHaveProperty('passed');
            expect(result.results).toHaveProperty('totalTests');
            expect(result.results).toHaveProperty('passedTests');
            expect(result.results).toHaveProperty('failedTests');
            expect(result.results).toHaveProperty('message');
            expect(result.results).toHaveProperty('output');
        });

        it('should return proper result structure on error', async () => {
            mockCompileScript.mockRejectedValueOnce(new Error('Test error'));

            const result = await executeInSandbox('bad code');

            expect(result.success).toBe(false);
            expect(result.results.passed).toBe(false);
            expect(result.results.totalTests).toBe(1);
            expect(result.results.failedTests).toBe(1);
            expect(result.results.error).toBe('Test error');
        });
    });
});
