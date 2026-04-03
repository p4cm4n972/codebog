/**
 * Client-side C compiler using @wasmer/sdk
 *
 * Architecture:
 *   1. Lazy-load GCC from Wasmer registry (cached in browser after first load)
 *   2. Compile C code → WASM binary via clang (wasm32-wasi target)
 *   3. Execute the resulting WASM with runWasix
 *   4. Return stdout for dry-run display and server-side validation
 *
 * The Wasmer runtime + GCC binary are fetched once (~20MB) and cached
 * in IndexedDB — subsequent compilations are fully offline.
 */

import type { Directory as WasmerDirectory } from '@wasmer/sdk';

export interface CompileResult {
  compiled: boolean;
  passed: boolean;
  output: string;
  compileError?: string;
  error?: string;
  passedTests: number;
  failedTests: number;
  totalTests: number;
}

// Singleton cache — init + package load happens once per page session
let sdkInitialized = false;
let cachedClang: Awaited<ReturnType<typeof loadGcc>> | null = null;

async function loadGcc() {
  const { init, Wasmer } = await import('@wasmer/sdk');
  if (!sdkInitialized) {
    await init();
    sdkInitialized = true;
  }
  // clang/clang: LLVM/Clang compiler targeting wasm32-wasi, official Wasmer registry package
  return Wasmer.fromRegistry('clang/clang');
}

async function getClang() {
  if (!cachedClang) cachedClang = await loadGcc();
  return cachedClang;
}

export function normalizeOutput(output: string): string {
  return output.trim().replace(/\r\n/g, '\n').replace(/\s+$/gm, '');
}

function parseTestOutput(output: string, hasTestHarness: boolean) {
  if (!hasTestHarness) {
    return { passed: output.trim().length > 0 ? 1 : 0, failed: 0, total: 1 };
  }
  let passed = 0;
  let failed = 0;
  for (const line of output.split('\n')) {
    if (line.match(/^(Test\s+\d+|✓|\[PASS\]|OK:)/i)) passed++;
    else if (line.match(/^(✗|\[FAIL\]|ERROR:|FAILED:)/i)) failed++;
  }
  if (passed === 0 && failed === 0 && output.trim().length > 0) passed = 1;
  return { passed, failed, total: passed + failed || 1 };
}

/**
 * Compile and run C code entirely in the browser via WASM.
 * Does NOT save anything to the database — dry run only.
 */
export async function compileAndRun(
  userCode: string,
  testCode: string | undefined,
): Promise<CompileResult> {
  const hasTestHarness = !!(testCode?.includes('int main'));
  const source = hasTestHarness
    ? `${userCode}\n\n${testCode}`
    : `${userCode}\n\nint main(void) { return 0; }`;

  let gcc: Awaited<ReturnType<typeof getClang>>;
  try {
    gcc = await getClang();
  } catch (err) {
    return {
      compiled: false, passed: false, output: '',
      compileError: `Chargement du compilateur WASM échoué : ${err instanceof Error ? err.message : String(err)}`,
      passedTests: 0, failedTests: 0, totalTests: 0,
    };
  }

  // clang/clang may expose the compiler as entrypoint or as commands['clang']
  const clangCmd = gcc.entrypoint ?? (gcc as unknown as { commands: Record<string, NonNullable<typeof gcc.entrypoint>> }).commands['clang'];
  if (!clangCmd) {
    return {
      compiled: false, passed: false, output: '',
      compileError: 'Le package clang/clang ne fournit pas de commande clang',
      passedTests: 0, failedTests: 0, totalTests: 0,
    };
  }

  const { Directory, runWasix } = await import('@wasmer/sdk');

  try {
    // ── Step 1: compile C → wasm32-wasi binary ──────────────────────────
    const srcDir: WasmerDirectory = new Directory({ 'main.c': source });

    // clang/clang is pre-configured for wasm32-wasi — no --target flag needed.
    // First arg is the source file directly (not the compiler name).
    const compileInstance = await clangCmd.run({
      args: ['/src/main.c', '-o', '/src/prog.wasm', '-lm'],
      mount: { '/src': srcDir },
      cwd: '/src',
    });
    const compileResult = await compileInstance.wait();

    if (compileResult.code !== 0) {
      const stderr = compileResult.stderr || compileResult.stdout || 'Erreur de compilation (code ' + compileResult.code + ')';
      console.error('[c-compiler] clang stderr:', stderr);
      return {
        compiled: false, passed: false, output: '',
        compileError: stderr,
        passedTests: 0, failedTests: 0, totalTests: 0,
      };
    }

    // ── Step 2: extract compiled WASM binary ────────────────────────────
    const wasmBytes = await srcDir.readFile('/prog.wasm');

    // ── Step 3: execute the compiled WASM with WASI runtime ─────────────
    // Copy into a plain ArrayBuffer — TypeScript requires BufferSource backed
    // by ArrayBuffer (not the ArrayBufferLike that readFile() may return).
    const wasmBuffer = new Uint8Array(wasmBytes).buffer;
    const module = await WebAssembly.compile(wasmBuffer);
    const runInstance = await runWasix(module, {});
    const runResult = await runInstance.wait();

    if (runResult.code !== 0 && !runResult.stdout) {
      return {
        compiled: true, passed: false, output: '',
        error: runResult.stderr || `Exit code: ${runResult.code}`,
        passedTests: 0, failedTests: 0, totalTests: 0,
      };
    }

    const output = normalizeOutput(runResult.stdout);
    const stats = parseTestOutput(output, hasTestHarness);

    return {
      compiled: true,
      passed: stats.failed === 0 && stats.passed > 0,
      output,
      passedTests: stats.passed,
      failedTests: stats.failed,
      totalTests: stats.total,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur d\'exécution WASM';
    console.error('[c-compiler] caught:', msg);
    return {
      compiled: false, passed: false, output: '',
      compileError: msg,
      passedTests: 0, failedTests: 0, totalTests: 0,
    };
  }
}
