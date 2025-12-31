import { NextRequest, NextResponse } from 'next/server';
import { VM } from 'vm2';

export async function POST(request: NextRequest) {
  try {
    const { code, exerciseSlug, testCode } = await request.json();

    if (!code || !exerciseSlug) {
      return NextResponse.json(
        { error: 'Code and exerciseSlug are required' },
        { status: 400 }
      );
    }

    // Test results tracker
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const testMessages: string[] = [];

    // Create a sandboxed VM
    const vm = new VM({
      timeout: 5000, // 5 seconds timeout
      sandbox: {
        console: {
          log: (...args: any[]) => {
            testMessages.push(args.join(' '));
          },
        },
        // Simple assertion library
        assert: {
          equal: (actual: any, expected: any, message?: string) => {
            totalTests++;
            if (actual === expected) {
              passedTests++;
              testMessages.push(`✓ ${message || 'Test passed'}`);
            } else {
              failedTests++;
              testMessages.push(`✗ ${message || 'Test failed'}: expected ${expected}, got ${actual}`);
            }
          },
          deepEqual: (actual: any, expected: any, message?: string) => {
            totalTests++;
            if (JSON.stringify(actual) === JSON.stringify(expected)) {
              passedTests++;
              testMessages.push(`✓ ${message || 'Test passed'}`);
            } else {
              failedTests++;
              testMessages.push(`✗ ${message || 'Test failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
            }
          },
          strictEqual: (actual: any, expected: any, message?: string) => {
            totalTests++;
            if (actual === expected) {
              passedTests++;
              testMessages.push(`✓ ${message || 'Test passed'}`);
            } else {
              failedTests++;
              testMessages.push(`✗ ${message || 'Test failed'}: expected ${expected}, got ${actual}`);
            }
          },
          ok: (value: any, message?: string) => {
            totalTests++;
            if (value) {
              passedTests++;
              testMessages.push(`✓ ${message || 'Test passed'}`);
            } else {
              failedTests++;
              testMessages.push(`✗ ${message || 'Test failed'}: value was falsy`);
            }
          },
        },
      },
    });

    try {
      // First, execute the user's code to define functions
      vm.run(code);

      // Then, if testCode exists, run the tests
      if (testCode && testCode.trim()) {
        try {
          vm.run(testCode);
        } catch (testError: any) {
          failedTests++;
          testMessages.push(`✗ Erreur dans les tests: ${testError.message}`);
        }
      } else {
        // No test file, just execute and check for syntax errors
        totalTests = 1;
        passedTests = 1;
        testMessages.push('✓ Code exécuté sans erreur (pas de tests disponibles)');
      }

      const testResults = {
        passed: failedTests === 0 && totalTests > 0,
        totalTests: totalTests || 1,
        passedTests,
        failedTests,
        message: failedTests === 0 ? 'Tous les tests sont passés!' : `${failedTests} test(s) échoué(s)`,
        output: testMessages.join('\n'),
      };

      return NextResponse.json({
        success: true,
        results: testResults,
      });
    } catch (execError: any) {
      return NextResponse.json({
        success: false,
        results: {
          passed: false,
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          message: `Erreur d'exécution`,
          error: execError.message,
        },
      });
    }
  } catch (error: any) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
