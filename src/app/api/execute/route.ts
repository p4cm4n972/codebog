import { NextRequest, NextResponse } from 'next/server';
import * as ivm from 'isolated-vm';

export async function POST(request: NextRequest) {
  let isolate: ivm.Isolate | undefined;

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
    isolate = new ivm.Isolate({ memoryLimit: 128 }); // 128MB memory limit
    const context = await isolate.createContext();
    const jail = context.global;

    // Set 'global' reference
    await jail.set('global', jail.derefInto());

    // Set up console.log
    await jail.set('console', new ivm.Reference({
      log: new ivm.Callback((...args: unknown[]) => {
        testMessages.push(args.map(arg => String(arg)).join(' '));
      }),
    }));

    // Set up assertion library
    const assertReference = new ivm.Reference({
      equal: new ivm.Callback((actual: unknown, expected: unknown, message?: string) => {
        totalTests++;
        if (actual === expected) {
          passedTests++;
          testMessages.push(`✓ ${message || 'Test passed'}`);
        } else {
          failedTests++;
          testMessages.push(`✗ ${message || 'Test failed'}: expected ${expected}, got ${actual}`);
        }
      }),
      deepEqual: new ivm.Callback((actual: unknown, expected: unknown, message?: string) => {
        totalTests++;
        if (JSON.stringify(actual) === JSON.stringify(expected)) {
          passedTests++;
          testMessages.push(`✓ ${message || 'Test passed'}`);
        } else {
          failedTests++;
          testMessages.push(`✗ ${message || 'Test failed'}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
      }),
      strictEqual: new ivm.Callback((actual: unknown, expected: unknown, message?: string) => {
        totalTests++;
        if (actual === expected) {
          passedTests++;
          testMessages.push(`✓ ${message || 'Test passed'}`);
        } else {
          failedTests++;
          testMessages.push(`✗ ${message || 'Test failed'}: expected ${expected}, got ${actual}`);
        }
      }),
      ok: new ivm.Callback((value: unknown, message?: string) => {
        totalTests++;
        if (value) {
          passedTests++;
          testMessages.push(`✓ ${message || 'Test passed'}`);
        } else {
          failedTests++;
          testMessages.push(`✗ ${message || 'Test failed'}: value was falsy`);
        }
      }),
    });
    await jail.set('assert', assertReference);


    try {
      // First, execute the user's code to define functions
      const userCodeScript = await isolate.compileScript(code);
      await userCodeScript.run(context, { timeout: 5000 });

      // Then, if testCode exists, run the tests
      if (testCode && testCode.trim()) {
        try {
          const testCodeScript = await isolate.compileScript(testCode);
          await testCodeScript.run(context, { timeout: 5000 });
        } catch (testError: unknown) {
          failedTests++;
          testMessages.push(`✗ Erreur dans les tests: ${(testError as Error).message}`);
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
    } catch (execError: unknown) {
      return NextResponse.json({
        success: false,
        results: {
          passed: false,
          totalTests: 1,
          passedTests: 0,
          failedTests: 1,
          message: `Erreur d'exécution`,
          error: (execError as Error).message,
        },
      });
    }
  } catch (error: unknown) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
      if (isolate) {
          isolate.dispose();
      }
  }
}
