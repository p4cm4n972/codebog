// Note: Functions are expected to be defined by user code
// (logged, timed, memoized, retry, validate, deprecated, throttled, autobind, compose, singleton)

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

console.log('Testing Decorators...\n');

// Test 1: logged - returns correct result
const add1 = logged((a, b) => a + b, 'add');
const result1 = add1(2, 3);
assert(result1 === 5, 'logged: returns correct result');

// Test 2: memoized - caches results
let callCount2 = 0;
const expensive2 = memoized((n) => {
    callCount2++;
    return n * 2;
});
expensive2(5);
expensive2(5);
expensive2(5);
assert(callCount2 === 1, 'memoized: caches results (1 call for 3 invocations)');
assert(expensive2(5) === 10, 'memoized: returns correct value');

// Test 3: memoized - different arguments cached separately
let callCount3 = 0;
const fn3 = memoized((n) => {
    callCount3++;
    return n;
});
fn3(1);
fn3(2);
fn3(1);
fn3(2);
assert(callCount3 === 2, 'memoized: different args cached separately');

// Test 4: retry - retries on failure
let attempts4 = 0;
const flaky4 = retry(3)(() => {
    attempts4++;
    if (attempts4 < 3) throw new Error('fail');
    return 'success';
});
assert(flaky4() === 'success', 'retry: succeeds after retries');
assert(attempts4 === 3, 'retry: tried 3 times');

// Test 5: retry - throws after max attempts
const alwaysFails = retry(2)(() => {
    throw new Error('always fails');
});
let retryThrown = false;
try {
    alwaysFails();
} catch (e) {
    retryThrown = e.message === 'always fails';
}
assert(retryThrown, 'retry: throws after max attempts');

// Test 6: validate - validates arguments
const isNumber = (x) => typeof x === 'number';
const divide = validate(isNumber, isNumber)((a, b) => a / b);
assert(divide(10, 2) === 5, 'validate: valid args work');

let validateThrown = false;
try {
    divide('10', 2);
} catch (e) {
    validateThrown = true;
}
assert(validateThrown, 'validate: invalid args throw');

// Test 7: validate - custom validators
const isEmail = (x) => /^[^\s@]+@[^\s@]+$/.test(x);
const sendEmail = validate(isEmail)((email) => `Sent to ${email}`);
assert(sendEmail('test@example.com') === 'Sent to test@example.com', 'validate: valid email works');

let emailThrown = false;
try {
    sendEmail('invalid');
} catch (e) {
    emailThrown = true;
}
assert(emailThrown, 'validate: invalid email throws');

// Test 8: deprecated - still executes function
const oldMethod = deprecated('deprecated')((x) => x * 2);
assert(oldMethod(5) === 10, 'deprecated: still executes function');

// Test 9: throttled - limits call frequency (synchronous test)
let count9 = 0;
const fn9 = throttled(1000)(() => count9++);
fn9();
fn9();
fn9();
assert(count9 === 1, 'throttled: limits to first call');

// Test 10: autobind - binds this context
const obj10 = {
    value: 42,
    getValue: autobind(function() {
        return this.value;
    }, { value: 42 })
};
const getValue10 = obj10.getValue;
assert(getValue10() === 42, 'autobind: preserves this context');

// Test 11: compose - applies decorators right to left
const logs11 = [];
const dec1 = (fn) => (...args) => { logs11.push('dec1'); return fn(...args); };
const dec2 = (fn) => (...args) => { logs11.push('dec2'); return fn(...args); };
const fn11 = compose((x) => x, dec1, dec2);
fn11(1);
assert(JSON.stringify(logs11) === JSON.stringify(['dec1', 'dec2']), 'compose: right to left order');

// Test 12: singleton - returns same instance
const SingleClass = singleton(class {
    constructor(value) {
        this.value = value;
    }
});
const a12 = new SingleClass(1);
const b12 = new SingleClass(2);
assert(a12 === b12, 'singleton: same instance');
assert(a12.value === 1, 'singleton: preserves first value');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
