/**
 * Sandbox module - Safe JavaScript code execution
 *
 * Provides isolated VM execution for user-submitted code with:
 * - Memory limits
 * - Execution timeouts
 * - Sandboxed console
 * - Test assertions
 */

// Types
export type {
    TestResults,
    ExecutionResult,
    TestTracker,
    ExecuteRequest,
    SandboxConfig,
} from './types';

export { DEFAULT_SANDBOX_CONFIG } from './types';

// Main execution function
export { executeInSandbox } from './vm-runner';

// Assertion utilities (for testing)
export {
    createAssertReference,
    createLogCallback,
    createTestTracker,
} from './assertions';
