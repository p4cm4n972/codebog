/**
 * Isolated VM runner for safe JavaScript code execution
 */

import * as ivm from 'isolated-vm';
import type { ExecutionResult, TestResults, SandboxConfig, TestTracker } from './types';
import { DEFAULT_SANDBOX_CONFIG } from './types';
import {
    createAssertReference,
    createLogCallback,
    createTestTracker,
    CONSOLE_SETUP_SCRIPT,
} from './assertions';

/**
 * Execute user code in an isolated sandbox with optional test code
 */
export async function executeInSandbox(
    userCode: string,
    testCode?: string,
    config: SandboxConfig = DEFAULT_SANDBOX_CONFIG
): Promise<ExecutionResult> {
    let isolate: ivm.Isolate | undefined;

    try {
        const tracker = createTestTracker();

        // Create isolated VM
        isolate = new ivm.Isolate({ memoryLimit: config.memoryLimit });
        const context = await isolate.createContext();
        const jail = context.global;

        // Set up sandbox environment
        await setupSandboxEnvironment(isolate, context, jail, tracker);

        // Execute user code and tests
        const results = await runCodeWithTests(
            isolate,
            context,
            userCode,
            testCode,
            tracker,
            config.timeout
        );

        return { success: true, results };
    } catch (error) {
        return {
            success: false,
            results: createErrorResult(error as Error),
        };
    } finally {
        if (isolate) {
            isolate.dispose();
        }
    }
}

/**
 * Set up the sandbox environment with console and assertions
 */
async function setupSandboxEnvironment(
    isolate: ivm.Isolate,
    context: ivm.Context,
    jail: ivm.Reference<Record<string | number | symbol, unknown>>,
    tracker: TestTracker
): Promise<void> {
    // Set 'global' reference
    await jail.set('global', jail.derefInto());

    // Set up console.log
    const logCallback = createLogCallback(tracker);
    await jail.set('_log', logCallback);

    // Create console object
    const consoleSetup = await isolate.compileScript(CONSOLE_SETUP_SCRIPT);
    await consoleSetup.run(context);

    // Set up assertion library
    const assertReference = createAssertReference(tracker);
    await jail.set('assert', assertReference);
}

/**
 * Run user code and optional test code
 */
async function runCodeWithTests(
    isolate: ivm.Isolate,
    context: ivm.Context,
    userCode: string,
    testCode: string | undefined,
    tracker: TestTracker,
    timeout: number
): Promise<TestResults> {
    try {
        // Execute user code
        const userCodeScript = await isolate.compileScript(userCode);
        await userCodeScript.run(context, { timeout });

        // Run tests if provided
        if (testCode && testCode.trim()) {
            await runTestCode(isolate, context, testCode, tracker, timeout);
        } else {
            // No tests - just verify code runs
            tracker.totalTests = 1;
            tracker.passedTests = 1;
            tracker.messages.push('✓ Code exécuté sans erreur (pas de tests disponibles)');
        }

        return createSuccessResult(tracker);
    } catch (execError) {
        return createExecutionErrorResult(execError as Error);
    }
}

/**
 * Run test code and parse results
 */
async function runTestCode(
    isolate: ivm.Isolate,
    context: ivm.Context,
    testCode: string,
    tracker: TestTracker,
    timeout: number
): Promise<void> {
    try {
        const testCodeScript = await isolate.compileScript(testCode);
        await testCodeScript.run(context, { timeout });

        // Parse test results from console output
        parseTestOutput(tracker);
    } catch (testError) {
        tracker.failedTests++;
        tracker.totalTests++;
        tracker.messages.push(`✗ Erreur dans les tests: ${(testError as Error).message}`);
    }
}

/**
 * Parse test markers from output messages
 */
function parseTestOutput(tracker: TestTracker): void {
    for (const msg of tracker.messages) {
        if (msg.startsWith('✓') || msg.includes('✓ ')) {
            tracker.passedTests++;
            tracker.totalTests++;
        } else if (msg.startsWith('✗') || msg.includes('✗ ')) {
            tracker.failedTests++;
            tracker.totalTests++;
        }
    }
}

/**
 * Create success result from tracker
 */
function createSuccessResult(tracker: TestTracker): TestResults {
    return {
        passed: tracker.failedTests === 0 && tracker.totalTests > 0,
        totalTests: tracker.totalTests || 1,
        passedTests: tracker.passedTests,
        failedTests: tracker.failedTests,
        message: tracker.failedTests === 0
            ? 'Tous les tests sont passés!'
            : `${tracker.failedTests} test(s) échoué(s)`,
        output: tracker.messages.join('\n'),
    };
}

/**
 * Create error result for execution errors
 */
function createExecutionErrorResult(error: Error): TestResults {
    return {
        passed: false,
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        message: `Erreur d'exécution`,
        output: '',
        error: error.message,
    };
}

/**
 * Create error result for general errors
 */
function createErrorResult(error: Error): TestResults {
    return {
        passed: false,
        totalTests: 1,
        passedTests: 0,
        failedTests: 1,
        message: 'Erreur interne',
        output: '',
        error: error.message,
    };
}
