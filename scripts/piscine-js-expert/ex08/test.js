// Note: Functions are expected to be defined by user code
// (createRateLimiter, retry, createCircuitBreaker, createThrottledQueue, createBatcher)

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
    console.log('Testing Rate Limiter & Retry Patterns...\n');

    // Test 1: retry - succeeds on first attempt
    let attempt1 = 0;
    const result1 = await retry(async () => {
        attempt1++;
        return 'success';
    }, { maxAttempts: 3 });
    assert(result1 === 'success' && attempt1 === 1, 'retry: succeeds on first attempt');

    // Test 2: retry - succeeds on third attempt
    let attempt2 = 0;
    const result2 = await retry(async () => {
        attempt2++;
        if (attempt2 < 3) throw new Error('fail');
        return 'success';
    }, { maxAttempts: 5, initialDelay: 10 });
    assert(result2 === 'success' && attempt2 === 3, 'retry: succeeds on third attempt');

    // Test 3: retry - exhausts attempts
    let attempt3 = 0;
    let caught3 = false;
    try {
        await retry(async () => {
            attempt3++;
            throw new Error('always fails');
        }, { maxAttempts: 3, initialDelay: 10 });
    } catch (err) {
        caught3 = true;
    }
    assert(caught3 && attempt3 === 3, 'retry: throws after max attempts');

    // Test 4: retry - with onRetry callback
    let onRetryCalled = false;
    let attempt4 = 0;
    await retry(async () => {
        attempt4++;
        if (attempt4 < 2) throw new Error('fail');
        return 'done';
    }, {
        maxAttempts: 3,
        initialDelay: 10,
        onRetry: () => { onRetryCalled = true; }
    });
    assert(onRetryCalled, 'retry: calls onRetry callback');

    // Test 5: createThrottledQueue - limits concurrency
    const queue = createThrottledQueue(2);
    let maxConcurrent = 0;
    let currentConcurrent = 0;

    const task = () => new Promise(resolve => {
        currentConcurrent++;
        maxConcurrent = Math.max(maxConcurrent, currentConcurrent);
        setTimeout(() => {
            currentConcurrent--;
            resolve();
        }, 20);
    });

    await queue.addAll([task, task, task, task]);
    assert(maxConcurrent <= 2, `createThrottledQueue: limits to 2 concurrent (was ${maxConcurrent})`);

    // Test 6: createThrottledQueue - returns results in order
    const queue2 = createThrottledQueue(2);
    const results = await queue2.addAll([
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3)
    ]);
    assert(
        JSON.stringify(results) === JSON.stringify([1, 2, 3]),
        'createThrottledQueue: returns results in order'
    );

    // Test 7: createCircuitBreaker - passes through when closed
    let cb7Called = 0;
    const breaker7 = createCircuitBreaker(async () => {
        cb7Called++;
        return 'result';
    }, { failureThreshold: 3 });
    const result7 = await breaker7();
    assert(result7 === 'result' && cb7Called === 1, 'createCircuitBreaker: passes through when closed');

    // Test 8: createCircuitBreaker - opens after failures
    let cb8Called = 0;
    const breaker8 = createCircuitBreaker(async () => {
        cb8Called++;
        throw new Error('fail');
    }, { failureThreshold: 2 });

    try { await breaker8(); } catch {}
    try { await breaker8(); } catch {}

    let openError = false;
    try {
        await breaker8();
    } catch (err) {
        openError = err.message.includes('OPEN');
    }
    assert(openError, 'createCircuitBreaker: opens after failure threshold');

    // Test 9: createRateLimiter - returns promise with result
    const limiter = createRateLimiter(5, 1000);
    const limitedResult = await limiter(async () => 'test');
    assert(limitedResult === 'test', 'createRateLimiter: returns promise with result');

    // Test 10: createBatcher - batches calls
    let batchCalls = 0;
    let batchItems = [];
    const batcher = createBatcher(async (items) => {
        batchCalls++;
        batchItems = items;
        return items.map(x => x * 2);
    }, { maxWaitMs: 50, maxBatchSize: 10 });

    const [b1, b2, b3] = await Promise.all([
        batcher(1),
        batcher(2),
        batcher(3)
    ]);

    assert(batchCalls === 1, 'createBatcher: batches into single call');
    assert(b1 === 2 && b2 === 4 && b3 === 6, 'createBatcher: returns correct results');
    assert(
        JSON.stringify(batchItems) === JSON.stringify([1, 2, 3]),
        'createBatcher: receives all items'
    );

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
