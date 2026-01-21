import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

const execAsync = promisify(exec);

// Timeout for compilation and execution (in ms)
const COMPILE_TIMEOUT = 10000; // 10 seconds
const EXEC_TIMEOUT = 5000; // 5 seconds

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

export async function POST(request: NextRequest) {
  const tmpDir = os.tmpdir();
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const workDir = path.join(tmpDir, `cbog-${uniqueId}`);
  const sourceFile = path.join(workDir, 'solution.c');
  const executableFile = path.join(workDir, 'solution');

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

    // Create temporary directory
    await fs.mkdir(workDir, { recursive: true });

    // Generate the complete source code with tests
    const completeCode = generateTestWrapper(code, testCode || '');

    // Write source file
    await fs.writeFile(sourceFile, completeCode);

    let result: TestResult = {
      compiled: false,
      passed: false,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      output: '',
    };

    // Compile the code
    try {
      await execAsync(
        `gcc -Wall -Wextra -Werror -o "${executableFile}" "${sourceFile}" 2>&1`,
        { timeout: COMPILE_TIMEOUT }
      );
      result.compiled = true;
    } catch (compileError: unknown) {
      const error = compileError as { stderr?: string; stdout?: string; message?: string };
      result.compiled = false;
      result.compileError = error.stderr || error.stdout || error.message || 'Compilation failed';

      return NextResponse.json({
        success: false,
        results: result,
      });
    }

    // Execute the code
    try {
      const { stdout, stderr } = await execAsync(
        `"${executableFile}" 2>&1`,
        {
          timeout: EXEC_TIMEOUT,
          maxBuffer: 1024 * 1024, // 1MB buffer
        }
      );

      result.output = stdout + (stderr ? `\nStderr: ${stderr}` : '');

      // Parse test results
      const testResults = parseTestOutput(result.output);
      result.passedTests = testResults.passed;
      result.failedTests = testResults.failed;
      result.totalTests = testResults.total;
      result.passed = testResults.failed === 0 && testResults.passed > 0;

    } catch (execError: unknown) {
      const error = execError as { stderr?: string; stdout?: string; message?: string; killed?: boolean; signal?: string };

      if (error.killed || error.signal === 'SIGTERM') {
        result.error = 'Execution timeout - votre code a pris trop de temps';
      } else {
        result.error = error.stderr || error.stdout || error.message || 'Execution failed';
      }
      result.passed = false;
    }

    return NextResponse.json({
      success: result.passed,
      results: result,
    });

  } catch (err: unknown) {
    console.error('Execute-C error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  } finally {
    // Cleanup temporary files
    try {
      await fs.rm(workDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}
