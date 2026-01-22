/**
 * Type definitions for the JavaScript sandbox execution system
 */

export interface TestResults {
    passed: boolean;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    message: string;
    output: string;
    error?: string;
}

export interface ExecutionResult {
    success: boolean;
    results: TestResults;
}

export interface TestTracker {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    messages: string[];
}

export interface ExecuteRequest {
    code: string;
    exerciseSlug: string;
    testCode?: string;
}

export interface SandboxConfig {
    memoryLimit: number;  // in MB
    timeout: number;      // in ms
}

export const DEFAULT_SANDBOX_CONFIG: SandboxConfig = {
    memoryLimit: 128,
    timeout: 5000,
};
