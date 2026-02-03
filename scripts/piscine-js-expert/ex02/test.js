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

console.log('Testing memoize...\n');

// Test 1: Basic memoization
let callCount = 0;
const double = memoize((x) => {
    callCount++;
    return x * 2;
});

double(5);
double(5);
assert(callCount === 1, 'memoize: caches single argument calls');

// Test 2: Multiple arguments
callCount = 0;
const sum = memoize((a, b, c) => {
    callCount++;
    return a + b + c;
});

sum(1, 2, 3);
sum(1, 2, 3);
assert(callCount === 1, 'memoize: caches multiple argument calls');

sum(1, 2, 4);
assert(callCount === 2, 'memoize: different args trigger new computation');

// Test 3: Cache API - has()
const fn1 = memoize(x => x * 2);
fn1(10);
assert(fn1.cache.has([10]), 'memoize: cache.has() returns true for cached value');
assert(!fn1.cache.has([20]), 'memoize: cache.has() returns false for non-cached value');

// Test 4: Cache API - clear()
fn1.cache.clear();
assert(!fn1.cache.has([10]), 'memoize: cache.clear() removes all entries');

// Test 5: Complex data types
const objFn = memoize((obj) => obj.value * 2);
callCount = 0;
const testObj = { value: 5 };
objFn(testObj);
objFn(testObj);
// Note: This might be tricky - objects need proper serialization

// Test 6: Fibonacci performance
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoFib = memoize(function fib(n) {
    if (n <= 1) return n;
    return memoFib(n - 1) + memoFib(n - 2);
});

const result = memoFib(20);
assert(result === 6765, 'memoize: correct fibonacci result');

// Test 7: Custom resolver
callCount = 0;
const getUserById = memoize(
    (id, options) => {
        callCount++;
        return { id, data: 'user data' };
    },
    { resolver: (id) => id }
);

getUserById(1, { verbose: true });
getUserById(1, { verbose: false });
assert(callCount === 1, 'memoize: custom resolver caches by first arg only');

// Test 8: LRU eviction (if maxSize implemented)
callCount = 0;
const lruFn = memoize(
    (x) => {
        callCount++;
        return x * 2;
    },
    { maxSize: 2 }
);

lruFn(1); // Cache: [1]
lruFn(2); // Cache: [1, 2]
lruFn(3); // Cache: [2, 3] (1 evicted)
lruFn(1); // Should recompute (not in cache)
assert(callCount === 4, 'memoize: LRU eviction works with maxSize');

// Test 9: Return values are correct
const multiply = memoize((a, b) => a * b);
assert(multiply(3, 4) === 12, 'memoize: returns correct value first call');
assert(multiply(3, 4) === 12, 'memoize: returns correct cached value');

// Test 10: Different argument order
callCount = 0;
const argOrderFn = memoize((a, b) => {
    callCount++;
    return a - b;
});

argOrderFn(5, 3);
argOrderFn(3, 5);
assert(callCount === 2, 'memoize: treats different arg order as different calls');

// Test 11: Zero and falsy values
const falsyFn = memoize(x => x + 1);
falsyFn(0);
falsyFn(0);
assert(falsyFn.cache.has([0]), 'memoize: handles zero correctly');

falsyFn(null);
assert(falsyFn.cache.has([null]), 'memoize: handles null correctly');

// Test 12: String arguments
callCount = 0;
const strFn = memoize((str) => {
    callCount++;
    return str.toUpperCase();
});

strFn('hello');
strFn('hello');
assert(callCount === 1, 'memoize: caches string arguments');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
