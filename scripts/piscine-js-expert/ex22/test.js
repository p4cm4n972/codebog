// Note: Functions are expected to be defined by user code
// (measurePerformance, memoize, memoizeLRU, memoizeTTL, debounce, throttle, batchProcess, createObjectPool, lazy)

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
    console.log('Testing Performance & Optimization...\n');

    // Test 1: measurePerformance - returns stats
    const stats1 = measurePerformance(() => {
        let sum = 0;
        for (let i = 0; i < 100; i++) sum += i;
        return sum;
    }, 100);
    assert(stats1.iterations === 100, 'measurePerformance: has iterations');
    assert(typeof stats1.mean === 'number', 'measurePerformance: has mean');
    assert(typeof stats1.median === 'number', 'measurePerformance: has median');
    assert(typeof stats1.min === 'number', 'measurePerformance: has min');
    assert(typeof stats1.max === 'number', 'measurePerformance: has max');

    // Test 2: memoize - caches results
    let callCount2 = 0;
    const fn2 = memoize((n) => {
        callCount2++;
        return n * 2;
    });
    fn2(5);
    fn2(5);
    assert(callCount2 === 1, 'memoize: caches results');

    // Test 3: memoize - handles multiple arguments
    const fn3 = memoize((a, b) => a + b);
    assert(fn3(1, 2) === 3, 'memoize: handles multiple args');
    assert(fn3(1, 2) === 3, 'memoize: cached multiple args');
    assert(fn3(2, 1) === 3, 'memoize: different order is new');

    // Test 4: memoizeLRU - evicts least recently used
    let callCount4 = 0;
    const fn4 = memoizeLRU((n) => {
        callCount4++;
        return n * 2;
    }, 2);
    fn4(1);
    fn4(2);
    fn4(3);
    fn4(1);
    assert(callCount4 === 4, 'memoizeLRU: evicts LRU (4 calls)');

    // Test 5: memoizeLRU - keeps recently used
    let callCount5 = 0;
    const fn5 = memoizeLRU((n) => {
        callCount5++;
        return n;
    }, 2);
    fn5(1);
    fn5(2);
    fn5(1);
    fn5(3);
    fn5(1);
    assert(callCount5 < 5, 'memoizeLRU: keeps recently used');

    // Test 6: memoizeTTL - caches with TTL
    let callCount6 = 0;
    const fn6 = memoizeTTL((n) => {
        callCount6++;
        return n;
    }, 50);
    fn6(1);
    fn6(1);
    assert(callCount6 === 1, 'memoizeTTL: caches initially');

    // Wait for TTL to expire
    await new Promise(r => setTimeout(r, 60));
    fn6(1);
    assert(callCount6 === 2, 'memoizeTTL: expires after TTL');

    // Test 7: debounce - delays execution
    let debounceCount = 0;
    const debounced7 = debounce(() => debounceCount++, 30);
    debounced7();
    assert(debounceCount === 0, 'debounce: delays execution');
    await new Promise(r => setTimeout(r, 40));
    assert(debounceCount === 1, 'debounce: executes after delay');

    // Test 8: debounce - resets on subsequent calls
    let debounceCount8 = 0;
    const debounced8 = debounce(() => debounceCount8++, 50);
    debounced8();
    await new Promise(r => setTimeout(r, 20));
    debounced8();
    await new Promise(r => setTimeout(r, 20));
    debounced8();
    await new Promise(r => setTimeout(r, 60));
    assert(debounceCount8 === 1, 'debounce: resets timer on calls');

    // Test 9: throttle - executes immediately
    let throttleCount9 = 0;
    const throttled9 = throttle(() => throttleCount9++, 100);
    throttled9();
    assert(throttleCount9 === 1, 'throttle: executes immediately');

    // Test 10: throttle - limits frequency
    let throttleCount10 = 0;
    const throttled10 = throttle(() => throttleCount10++, 50);
    throttled10();
    throttled10();
    throttled10();
    assert(throttleCount10 === 1, 'throttle: limits frequency');
    await new Promise(r => setTimeout(r, 60));
    throttled10();
    assert(throttleCount10 === 2, 'throttle: allows after interval');

    // Test 11: batchProcess - processes in batches
    const items11 = [1, 2, 3, 4, 5];
    const results11 = await batchProcess(items11, 2, (x) => x * 2);
    assert(JSON.stringify(results11) === JSON.stringify([2, 4, 6, 8, 10]), 'batchProcess: processes all items');

    // Test 12: createObjectPool - reuses objects
    let factoryCount12 = 0;
    const factory12 = () => { factoryCount12++; return { value: 0 }; };
    const pool12 = createObjectPool(factory12, 2);
    const obj12a = pool12.acquire();
    pool12.release(obj12a);
    const obj12b = pool12.acquire();
    assert(obj12a === obj12b, 'createObjectPool: reuses objects');

    // Test 13: createObjectPool - pre-populates pool
    let factoryCount13 = 0;
    const factory13 = () => { factoryCount13++; return {}; };
    createObjectPool(factory13, 5);
    assert(factoryCount13 === 5, 'createObjectPool: pre-populates');

    // Test 14: createObjectPool - tracks stats
    const pool14 = createObjectPool(() => ({}), 3);
    pool14.acquire();
    pool14.acquire();
    const stats14 = pool14.stats;
    assert(stats14.active === 2, 'createObjectPool: tracks active');
    assert(stats14.available === 1, 'createObjectPool: tracks available');

    // Test 15: createObjectPool - throws when exhausted
    const pool15 = createObjectPool(() => ({}), 1, 1);
    pool15.acquire();
    let exhaustedThrown = false;
    try {
        pool15.acquire();
    } catch (e) {
        exhaustedThrown = true;
    }
    assert(exhaustedThrown, 'createObjectPool: throws when exhausted');

    // Test 16: lazy - not evaluated until accessed
    let lazyCount16 = 0;
    const lazy16 = lazy(() => { lazyCount16++; return 'computed'; });
    assert(lazyCount16 === 0, 'lazy: not evaluated initially');
    assert(lazy16.value === 'computed', 'lazy: returns computed value');
    assert(lazyCount16 === 1, 'lazy: evaluated on access');

    // Test 17: lazy - caches the value
    let lazyCount17 = 0;
    const lazy17 = lazy(() => { lazyCount17++; return 42; });
    const first17 = lazy17.value;
    const second17 = lazy17.value;
    assert(first17 === second17, 'lazy: returns same value');
    assert(lazyCount17 === 1, 'lazy: only computed once');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
