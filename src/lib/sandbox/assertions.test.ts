import { describe, it, expect, vi } from 'vitest';
import {
    createTestTracker,
    createLogCallback,
    createAssertReference,
    CONSOLE_SETUP_SCRIPT,
} from './assertions';

// Mock isolated-vm
vi.mock('isolated-vm', () => ({
    default: {
        Callback: class MockCallback {
            constructor(public fn: (...args: unknown[]) => void) {}
            // Allow calling the callback directly for testing
            call(...args: unknown[]) {
                return this.fn(...args);
            }
        },
        Reference: class MockReference<T> {
            constructor(public value: T) {}
        },
    },
    Callback: class MockCallback {
        constructor(public fn: (...args: unknown[]) => void) {}
        call(...args: unknown[]) {
            return this.fn(...args);
        }
    },
    Reference: class MockReference<T> {
        constructor(public value: T) {}
    },
}));

describe('sandbox/assertions', () => {
    describe('createTestTracker', () => {
        it('should create a tracker with zero counts', () => {
            const tracker = createTestTracker();

            expect(tracker.totalTests).toBe(0);
            expect(tracker.passedTests).toBe(0);
            expect(tracker.failedTests).toBe(0);
            expect(tracker.messages).toEqual([]);
        });

        it('should create independent tracker instances', () => {
            const tracker1 = createTestTracker();
            const tracker2 = createTestTracker();

            tracker1.totalTests = 5;
            tracker1.messages.push('test');

            expect(tracker2.totalTests).toBe(0);
            expect(tracker2.messages).toEqual([]);
        });
    });

    describe('createLogCallback', () => {
        it('should capture log messages', () => {
            const tracker = createTestTracker();
            const logCallback = createLogCallback(tracker);

            // Access the underlying function and call it (mock returns object with value property)
            const logFn = (logCallback as unknown as { value: (...args: unknown[]) => void }).value;
            logFn('Hello', 'World');

            expect(tracker.messages).toContain('Hello World');
        });

        it('should convert non-string arguments to strings', () => {
            const tracker = createTestTracker();
            const logCallback = createLogCallback(tracker);

            const logFn = (logCallback as unknown as { value: (...args: unknown[]) => void }).value;
            logFn(42, true, { key: 'value' });

            expect(tracker.messages).toContain('42 true [object Object]');
        });

        it('should handle single argument', () => {
            const tracker = createTestTracker();
            const logCallback = createLogCallback(tracker);

            const logFn = (logCallback as unknown as { value: (...args: unknown[]) => void }).value;
            logFn('Single message');

            expect(tracker.messages).toContain('Single message');
        });
    });

    describe('createAssertReference', () => {
        // Helper type for mock assert object
        type MockAssertObj = {
            equal: { fn: (a: unknown, b: unknown, msg?: string) => void };
            deepEqual: { fn: (a: unknown, b: unknown, msg?: string) => void };
            strictEqual: { fn: (a: unknown, b: unknown, msg?: string) => void };
            ok: { fn: (value: unknown, msg?: string) => void };
        };

        function getAssertObj(tracker: ReturnType<typeof createTestTracker>): MockAssertObj {
            const assertRef = createAssertReference(tracker);
            return (assertRef as unknown as { value: MockAssertObj }).value;
        }

        it('should create assert object with equal, deepEqual, strictEqual, ok', () => {
            const tracker = createTestTracker();
            const assertObj = getAssertObj(tracker);

            expect(assertObj).toHaveProperty('equal');
            expect(assertObj).toHaveProperty('deepEqual');
            expect(assertObj).toHaveProperty('strictEqual');
            expect(assertObj).toHaveProperty('ok');
        });

        describe('assert.equal', () => {
            it('should pass when values are equal', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.equal.fn(5, 5, 'Five equals five');

                expect(tracker.passedTests).toBe(1);
                expect(tracker.failedTests).toBe(0);
                expect(tracker.messages[0]).toContain('✓');
            });

            it('should fail when values are not equal', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.equal.fn(5, 10, 'Should fail');

                expect(tracker.passedTests).toBe(0);
                expect(tracker.failedTests).toBe(1);
                expect(tracker.messages[0]).toContain('✗');
                expect(tracker.messages[0]).toContain('expected 10, got 5');
            });
        });

        describe('assert.deepEqual', () => {
            it('should pass for equal objects', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.deepEqual.fn({ a: 1 }, { a: 1 }, 'Objects equal');

                expect(tracker.passedTests).toBe(1);
                expect(tracker.failedTests).toBe(0);
            });

            it('should fail for different objects', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.deepEqual.fn({ a: 1 }, { a: 2 }, 'Objects differ');

                expect(tracker.passedTests).toBe(0);
                expect(tracker.failedTests).toBe(1);
            });

            it('should pass for equal arrays', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.deepEqual.fn([1, 2, 3], [1, 2, 3], 'Arrays equal');

                expect(tracker.passedTests).toBe(1);
            });
        });

        describe('assert.strictEqual', () => {
            it('should pass for strictly equal values', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.strictEqual.fn('test', 'test', 'Strings equal');

                expect(tracker.passedTests).toBe(1);
            });

            it('should fail for type-different values', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.strictEqual.fn('5', 5, 'Type mismatch');

                expect(tracker.failedTests).toBe(1);
            });
        });

        describe('assert.ok', () => {
            it('should pass for truthy values', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.ok.fn(true, 'Is truthy');
                assertObj.ok.fn(1, 'Number is truthy');
                assertObj.ok.fn('string', 'String is truthy');

                expect(tracker.passedTests).toBe(3);
                expect(tracker.failedTests).toBe(0);
            });

            it('should fail for falsy values', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.ok.fn(false, 'Is falsy');

                expect(tracker.failedTests).toBe(1);
                expect(tracker.messages[0]).toContain('value was falsy');
            });

            it('should fail for null and undefined', () => {
                const tracker = createTestTracker();
                const assertObj = getAssertObj(tracker);

                assertObj.ok.fn(null, 'Null');
                assertObj.ok.fn(undefined, 'Undefined');

                expect(tracker.failedTests).toBe(2);
            });
        });

        it('should use default message when not provided', () => {
            const tracker = createTestTracker();
            const assertObj = getAssertObj(tracker);

            assertObj.equal.fn(1, 1);

            expect(tracker.messages[0]).toContain('Test passed');
        });
    });

    describe('CONSOLE_SETUP_SCRIPT', () => {
        it('should be a non-empty string', () => {
            expect(typeof CONSOLE_SETUP_SCRIPT).toBe('string');
            expect(CONSOLE_SETUP_SCRIPT.length).toBeGreaterThan(0);
        });

        it('should define console object with log, error, warn, info', () => {
            expect(CONSOLE_SETUP_SCRIPT).toContain('console');
            expect(CONSOLE_SETUP_SCRIPT).toContain('log');
            expect(CONSOLE_SETUP_SCRIPT).toContain('error');
            expect(CONSOLE_SETUP_SCRIPT).toContain('warn');
            expect(CONSOLE_SETUP_SCRIPT).toContain('info');
        });
    });
});
