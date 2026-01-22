/**
 * Test assertion utilities for the sandbox execution system
 */

import * as ivm from 'isolated-vm';
import type { TestTracker } from './types';

/**
 * Create an assertion callback that tracks test results
 */
function createAssertCallback(
    tracker: TestTracker,
    compareFn: (actual: unknown, expected: unknown) => boolean,
    formatError: (actual: unknown, expected: unknown) => string
): ivm.Callback {
    return new ivm.Callback((actual: unknown, expected: unknown, message?: string) => {
        tracker.totalTests++;
        if (compareFn(actual, expected)) {
            tracker.passedTests++;
            tracker.messages.push(`✓ ${message || 'Test passed'}`);
        } else {
            tracker.failedTests++;
            tracker.messages.push(`✗ ${message || 'Test failed'}: ${formatError(actual, expected)}`);
        }
    });
}

/**
 * Create the assertion library reference for the sandbox
 */
export function createAssertReference(tracker: TestTracker): ivm.Reference<object> {
    return new ivm.Reference({
        equal: createAssertCallback(
            tracker,
            (actual, expected) => actual === expected,
            (actual, expected) => `expected ${expected}, got ${actual}`
        ),
        deepEqual: createAssertCallback(
            tracker,
            (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected),
            (actual, expected) => `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
        ),
        strictEqual: createAssertCallback(
            tracker,
            (actual, expected) => actual === expected,
            (actual, expected) => `expected ${expected}, got ${actual}`
        ),
        ok: new ivm.Callback((value: unknown, message?: string) => {
            tracker.totalTests++;
            if (value) {
                tracker.passedTests++;
                tracker.messages.push(`✓ ${message || 'Test passed'}`);
            } else {
                tracker.failedTests++;
                tracker.messages.push(`✗ ${message || 'Test failed'}: value was falsy`);
            }
        }),
    });
}

/**
 * Create a console.log callback that captures output
 */
export function createLogCallback(tracker: TestTracker): ivm.Reference<(...args: unknown[]) => void> {
    return new ivm.Reference((...args: unknown[]) => {
        tracker.messages.push(args.map(arg => String(arg)).join(' '));
    });
}

/**
 * Console setup script for the isolate
 */
export const CONSOLE_SETUP_SCRIPT = `
const console = {
    log: (...args) => _log.applySync(undefined, args),
    error: (...args) => _log.applySync(undefined, args),
    warn: (...args) => _log.applySync(undefined, args),
    info: (...args) => _log.applySync(undefined, args)
};
`;

/**
 * Create a new test tracker
 */
export function createTestTracker(): TestTracker {
    return {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        messages: [],
    };
}
