// Note: Functions are expected to be defined by user code

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        passed++;
    } else {
        console.error(`✗ ${message}`);
        failed++;
    }
}

async function runTests() {
    console.log('Testing Async Control Flow...\n');

    // Test 1: retry - succeeds on first attempt
    let attempt1 = 0;
    await retry(async () => {
        attempt1++;
        return 'success';
    }, { maxAttempts: 3 });
    assert(attempt1 === 1, 'retry: succeeds on first attempt');

    // Test 2: retry - succeeds on third attempt
    let attempt2 = 0;
    const result2 = await retry(async () => {
        attempt2++;
        if (attempt2 < 3) throw new Error('fail');
        return 'success';
    }, { maxAttempts: 5, delay: 10 });
    assert(attempt2 === 3 && result2 === 'success', 'retry: succeeds on third attempt');

    // Test 3: retry - exhausts attempts
    let attempt3 = 0;
    try {
        await retry(async () => {
            attempt3++;
            throw new Error('always fails');
        }, { maxAttempts: 3, delay: 10 });
        assert(false, 'retry: should throw after max attempts');
    } catch (err) {
        assert(attempt3 === 3, 'retry: tries exactly maxAttempts times');
    }

    // Test 4: retry - with shouldRetry
    let attempt4 = 0;
    try {
        await retry(async () => {
            attempt4++;
            const err = new Error('do not retry');
            err.code = 'NO_RETRY';
            throw err;
        }, {
            maxAttempts: 5,
            delay: 10,
            shouldRetry: (err) => err.code !== 'NO_RETRY'
        });
    } catch (err) {
        assert(attempt4 === 1, 'retry: respects shouldRetry predicate');
    }

    // Test 5: timeout - resolves in time
    const fast = new Promise(resolve => setTimeout(() => resolve('done'), 50));
    const result5 = await timeout(fast, 100);
    assert(result5 === 'done', 'timeout: resolves if promise is fast enough');

    // Test 6: timeout - times out
    try {
        const slow = new Promise(resolve => setTimeout(() => resolve('done'), 200));
        await timeout(slow, 50);
        assert(false, 'timeout: should throw timeout error');
    } catch (err) {
        assert(err.message.includes('timeout') || err.message.includes('timed out'), 'timeout: throws on timeout');
    }

    // Test 7: parallel - with concurrency 1 (sequential)
    const order7 = [];
    const tasks7 = [
        async () => { order7.push(1); await sleep(50); return 1; },
        async () => { order7.push(2); await sleep(50); return 2; },
        async () => { order7.push(3); await sleep(50); return 3; }
    ];
    const results7 = await parallel(tasks7, 1);
    assert(
        JSON.stringify(results7) === JSON.stringify([1, 2, 3]) &&
        JSON.stringify(order7) === JSON.stringify([1, 2, 3]),
        'parallel: concurrency=1 executes sequentially'
    );

    // Test 8: parallel - with concurrency 2
    const start8 = Date.now();
    const tasks8 = [
        async () => { await sleep(100); return 1; },
        async () => { await sleep(100); return 2; },
        async () => { await sleep(100); return 3; },
        async () => { await sleep(100); return 4; }
    ];
    const results8 = await parallel(tasks8, 2);
    const duration8 = Date.now() - start8;
    assert(
        JSON.stringify(results8) === JSON.stringify([1, 2, 3, 4]) &&
        duration8 >= 200 && duration8 < 300,
        `parallel: concurrency=2 takes ~200ms (took ${duration8}ms)`
    );

    // Test 9: parallel - handles errors
    const tasks9 = [
        async () => 1,
        async () => { throw new Error('task error'); },
        async () => 3
    ];
    try {
        await parallel(tasks9, 2);
        assert(false, 'parallel: should propagate errors');
    } catch (err) {
        assert(err.message === 'task error', 'parallel: propagates task errors');
    }

    // Test 10: waterfall - basic sequence
    const results10 = await waterfall([
        async () => 5,
        async (x) => x * 2,
        async (x) => x + 3
    ]);
    assert(results10 === 13, 'waterfall: (5 * 2) + 3 = 13');

    // Test 11: waterfall - passes values
    const results11 = await waterfall([
        async () => ({ user: 'Alice' }),
        async (data) => ({ ...data, age: 30 }),
        async (data) => ({ ...data, role: 'admin' })
    ]);
    assert(
        results11.user === 'Alice' && results11.age === 30 && results11.role === 'admin',
        'waterfall: correctly passes and accumulates data'
    );

    // Test 12: waterfall - stops on error
    try {
        await waterfall([
            async () => 1,
            async (x) => { throw new Error('waterfall error'); },
            async (x) => x + 1  // Should not execute
        ]);
        assert(false, 'waterfall: should stop on error');
    } catch (err) {
        assert(err.message === 'waterfall error', 'waterfall: propagates errors');
    }

    // Test 13: promisify - basic callback function
    function callbackFn(value, callback) {
        setTimeout(() => callback(null, value * 2), 10);
    }
    const promisified = promisify(callbackFn);
    const result13 = await promisified(5);
    assert(result13 === 10, 'promisify: converts callback to promise');

    // Test 14: promisify - with error
    function errorCallback(callback) {
        setTimeout(() => callback(new Error('callback error')), 10);
    }
    const promisifiedError = promisify(errorCallback);
    try {
        await promisifiedError();
        assert(false, 'promisify: should reject on callback error');
    } catch (err) {
        assert(err.message === 'callback error', 'promisify: rejects with callback error');
    }

    // Test 15: promisify - multiple arguments
    function multiArgCallback(a, b, c, callback) {
        setTimeout(() => callback(null, a + b + c), 10);
    }
    const promisifiedMulti = promisify(multiArgCallback);
    const result15 = await promisifiedMulti(1, 2, 3);
    assert(result15 === 6, 'promisify: handles multiple arguments');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));

    // process.exit not available in sandbox
}

// Helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

runTests();
