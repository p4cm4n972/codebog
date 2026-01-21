import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromJWT, isCExerciseUnlocked } from '@/lib/access-control';

// Judge0 API configuration - read at runtime, not build time
function getJudge0Config() {
  return {
    apiUrl: process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
    apiKey: process.env.JUDGE0_API_KEY,
    apiHost: process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com',
  };
}

// C language ID in Judge0 (GCC 9.2.0)
const C_LANGUAGE_ID = 50;

// Timeout for polling (max 30 seconds)
const MAX_POLL_ATTEMPTS = 15;
const POLL_INTERVAL = 2000; // 2 seconds

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

interface Judge0Response {
  token?: string;
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: {
    id: number;
    description: string;
  };
  time?: string;
  memory?: number;
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
 * Submit code to Judge0 API
 */
async function submitToJudge0(sourceCode: string): Promise<string> {
  const config = getJudge0Config();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add RapidAPI headers if API key is configured
  if (config.apiKey) {
    headers['X-RapidAPI-Key'] = config.apiKey;
    headers['X-RapidAPI-Host'] = config.apiHost;
  }

  const response = await fetch(`${config.apiUrl}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source_code: Buffer.from(sourceCode).toString('base64'),
      language_id: C_LANGUAGE_ID,
      cpu_time_limit: 5,
      cpu_extra_time: 1,
      wall_time_limit: 10,
      memory_limit: 128000, // 128 MB
      compiler_options: '-Wall -Wextra -Werror',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 submission failed: ${response.status} - ${errorText}`);
  }

  const data: Judge0Response = await response.json();
  if (!data.token) {
    throw new Error('No token received from Judge0');
  }

  return data.token;
}

/**
 * Poll Judge0 for submission result
 */
async function pollJudge0Result(token: string): Promise<Judge0Response> {
  const config = getJudge0Config();
  const headers: Record<string, string> = {};

  if (config.apiKey) {
    headers['X-RapidAPI-Key'] = config.apiKey;
    headers['X-RapidAPI-Host'] = config.apiHost;
  }

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const response = await fetch(
      `${config.apiUrl}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,message,status,time,memory`,
      { headers }
    );

    if (!response.ok) {
      throw new Error(`Judge0 polling failed: ${response.status}`);
    }

    const data: Judge0Response = await response.json();

    // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, 5=Time Limit, etc.
    // If status > 2, execution is complete
    if (data.status && data.status.id > 2) {
      return data;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error('Timeout waiting for Judge0 result');
}

/**
 * Decode base64 string safely
 */
function decodeBase64(encoded: string | null | undefined): string {
  if (!encoded) return '';
  try {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  } catch {
    return encoded;
  }
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

    // Check if Judge0 API is configured
    const config = getJudge0Config();
    if (!config.apiKey && config.apiUrl.includes('rapidapi')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Le service de compilation C n\'est pas configuré. Contactez l\'administrateur.'
        },
        { status: 503 }
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
      // Submit code to Judge0
      const token = await submitToJudge0(completeCode);

      // Poll for result
      const judge0Result = await pollJudge0Result(token);

      // Process result based on status
      const statusId = judge0Result.status?.id || 0;
      const stdout = decodeBase64(judge0Result.stdout);
      const stderr = decodeBase64(judge0Result.stderr);
      const compileOutput = decodeBase64(judge0Result.compile_output);

      // Status 6 = Compilation Error
      if (statusId === 6) {
        result.compiled = false;
        result.compileError = compileOutput || 'Erreur de compilation';
        return NextResponse.json({
          success: false,
          results: result,
        });
      }

      // Status 3 = Accepted (successful execution)
      // Status 4 = Wrong Answer
      // Status 5 = Time Limit Exceeded
      // Status 7-12 = Various runtime errors
      result.compiled = true;

      if (statusId === 5) {
        result.error = 'Timeout - votre code a pris trop de temps';
        result.passed = false;
      } else if (statusId >= 7 && statusId <= 12) {
        result.error = `Erreur d'exécution: ${judge0Result.status?.description || 'Runtime Error'}`;
        if (stderr) {
          result.error += `\n${stderr}`;
        }
        result.passed = false;
      } else {
        result.output = stdout + (stderr ? `\nStderr: ${stderr}` : '');

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

    } catch (judge0Error: unknown) {
      console.error('Judge0 error:', judge0Error);
      return NextResponse.json({
        success: false,
        error: judge0Error instanceof Error ? judge0Error.message : 'Erreur du service de compilation',
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
