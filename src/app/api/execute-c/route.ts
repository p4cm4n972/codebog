import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

// Piston API - free code execution service (no API key required)
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

interface TestResult {
  compiled: boolean;
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  output: string;
  compileError?: string;
  error?: string;
}

interface PistonResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
  message?: string;
}

/**
 * Generate a simple test wrapper for C code
 */
function generateTestWrapper(userCode: string, testCode: string): string {
  // If testCode is provided and has a main function, use it
  if (testCode && testCode.includes('int main')) {
    return `${userCode}\n\n${testCode}`;
  }

  // Otherwise, create a basic test wrapper
  return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// User code
${userCode}

// Test wrapper
int main(void) {
    printf("Code compiled and executed successfully!\\n");
    return 0;
}
`;
}

/**
 * Parse test output to extract results
 */
function parseTestOutput(output: string): { passed: number; failed: number; total: number } {
  let passed = 0;
  let failed = 0;

  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('✓') || line.includes('PASS') || line.includes('OK')) {
      passed++;
    } else if (line.includes('✗') || line.includes('FAIL') || line.includes('ERROR')) {
      failed++;
    }
  }

  // If no explicit test markers, consider it passed if there's output and no errors
  if (passed === 0 && failed === 0 && output.trim()) {
    passed = 1;
  }

  return { passed, failed, total: passed + failed || 1 };
}

/**
 * Execute C code using Piston API
 */
async function executeWithPiston(sourceCode: string): Promise<PistonResponse> {
  const response = await fetch(PISTON_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      language: 'c',
      version: '*',
      files: [{ content: sourceCode }],
      compile_timeout: 10000,
      run_timeout: 5000,
      compile_memory_limit: -1,
      run_memory_limit: -1,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Piston API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  try {
    const { code, exerciseSlug, testCode } = await request.json();

    if (!code || !exerciseSlug) {
      return NextResponse.json(
        { success: false, error: 'Code and exerciseSlug are required' },
        { status: 400 }
      );
    }

    // Verify user authentication via JWT
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const jwt = authHeader.substring(7);
    const userInfo = await verifyUserFromJWT(jwt);

    if (!userInfo) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has access to this exercise
    const access = await isCExerciseUnlocked(userInfo.userId, exerciseSlug, userInfo.unlockAll);

    if (!access.hasAccess) {
      return NextResponse.json(
        { error: 'Access denied', reason: access.reason },
        { status: 403 }
      );
    }

    // Generate the complete source code with tests
    const completeCode = generateTestWrapper(code, testCode || '');

    let result: TestResult = {
      compiled: false,
      passed: false,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      output: '',
    };

    try {
      // Execute code with Piston
      const pistonResult = await executeWithPiston(completeCode);

      // Check for compilation errors
      if (pistonResult.compile && pistonResult.compile.code !== 0) {
        result.compiled = false;
        result.compileError = pistonResult.compile.stderr || pistonResult.compile.output || 'Erreur de compilation';
        return NextResponse.json({
          success: false,
          results: result,
        });
      }

      // Check for error message from Piston
      if (pistonResult.message) {
        result.compiled = false;
        result.compileError = pistonResult.message;
        return NextResponse.json({
          success: false,
          results: result,
        });
      }

      // Compilation successful
      result.compiled = true;

      // Check runtime errors
      if (pistonResult.run.code !== 0 || pistonResult.run.signal) {
        result.error = pistonResult.run.stderr || `Exit code: ${pistonResult.run.code}`;
        if (pistonResult.run.signal) {
          result.error = `Signal: ${pistonResult.run.signal} (possible timeout ou erreur mémoire)`;
        }
        result.passed = false;
      } else {
        // Execution successful
        result.output = pistonResult.run.stdout;
        if (pistonResult.run.stderr) {
          result.output += `\nStderr: ${pistonResult.run.stderr}`;
        }

        // Parse test results
        const testResults = parseTestOutput(result.output);
        result.passedTests = testResults.passed;
        result.failedTests = testResults.failed;
        result.totalTests = testResults.total;
        result.passed = testResults.failed === 0 && testResults.passed > 0;
      }

      return NextResponse.json({
        success: result.passed,
        results: result,
      });

    } catch (pistonError: unknown) {
      console.error('Piston error:', pistonError);
      return NextResponse.json({
        success: false,
        error: pistonError instanceof Error ? pistonError.message : 'Erreur du service de compilation',
      }, { status: 500 });
    }

  } catch (err: unknown) {
    console.error('Execute-C error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
