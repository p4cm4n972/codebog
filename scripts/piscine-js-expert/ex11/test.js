// Note: Functions are expected to be defined by user code
// (once, after, debounce, throttle, partial)

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
    console.log('Testing Advanced Closures...\n');

    // Test 1: once - calls function only once
    let callCount1 = 0;
    const onceFn = once(() => {
        callCount1++;
        return 'result';
    });

    const r1 = onceFn();
    const r2 = onceFn();
    const r3 = onceFn();

    assert(callCount1 === 1, 'once: function called only once');
    assert(r1 === 'result' && r2 === 'result' && r3 === 'result', 'once: returns same result');

    // Test 2: once - preserves arguments
    let capturedArgs = null;
    const onceFn2 = once((a, b) => {
        capturedArgs = [a, b];
        return a + b;
    });

    onceFn2(1, 2);
    assert(capturedArgs[0] === 1 && capturedArgs[1] === 2, 'once: preserves arguments');

    // Test 3: after - only calls after n times
    let afterCount = 0;
    const afterFn = after(3, () => {
        afterCount++;
        return 'done';
    });

    const a1 = afterFn();
    const a2 = afterFn();
    const a3 = afterFn();

    assert(a1 === undefined && a2 === undefined, 'after: returns undefined before threshold');
    assert(a3 === 'done', 'after: returns result at threshold');
    assert(afterCount === 1, 'after: function called only at threshold');

    // Test 4: after - continues calling after threshold
    let afterCount2 = 0;
    const afterFn2 = after(2, () => {
        afterCount2++;
        return 'done';
    });

    afterFn2();
    afterFn2();
    afterFn2();
    afterFn2();

    assert(afterCount2 === 3, 'after: continues calling after threshold');

    // Test 5: debounce - delays execution
    let debounceCount = 0;
    const debouncedFn = debounce(() => {
        debounceCount++;
    }, 50);

    debouncedFn();
    assert(debounceCount === 0, 'debounce: does not call immediately');

    await new Promise(r => setTimeout(r, 100));
    assert(debounceCount === 1, 'debounce: calls after delay');

    // Test 6: debounce - resets timer on subsequent calls
    let debounceArg = null;
    const debouncedFn2 = debounce((arg) => {
        debounceArg = arg;
    }, 50);

    debouncedFn2('a');
    await new Promise(r => setTimeout(r, 30));
    debouncedFn2('b');
    await new Promise(r => setTimeout(r, 30));
    debouncedFn2('c');
    await new Promise(r => setTimeout(r, 100));

    assert(debounceArg === 'c', 'debounce: uses last call arguments');

    // Test 7: throttle - executes immediately first call
    let throttleCount = 0;
    const throttledFn = throttle(() => {
        throttleCount++;
    }, 100);

    throttledFn();
    assert(throttleCount === 1, 'throttle: executes immediately on first call');

    // Test 8: throttle - limits frequency
    let throttleCount2 = 0;
    const throttledFn2 = throttle(() => {
        throttleCount2++;
    }, 50);

    throttledFn2();
    throttledFn2();
    throttledFn2();

    assert(throttleCount2 === 1, 'throttle: limits execution frequency');

    await new Promise(r => setTimeout(r, 100));
    throttledFn2();
    assert(throttleCount2 === 2, 'throttle: allows call after limit period');

    // Test 9: partial - partially applies arguments
    const add = (a, b, c) => a + b + c;
    const add5 = partial(add, 5);
    assert(add5(2, 3) === 10, 'partial: partially applies first argument');

    // Test 10: partial - works with multiple partial args
    const greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`;
    const greetHello = partial(greet, 'Hello', 'Alice');
    assert(greetHello('!') === 'Hello, Alice!', 'partial: works with multiple partial args');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
