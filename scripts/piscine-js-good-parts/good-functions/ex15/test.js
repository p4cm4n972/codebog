// Note: Functions are expected to be defined by user code
// (createCounter, memoize, createAccumulator, createIdGenerator, limitCalls, createToggle, withHistory)

// Test utilities
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

console.log('Testing Ex15 - Closure...\n');

assert(counter.increment() === 1, 'should increment and decrement');
assert(counter.increment() === 2, 'should increment and decrement');
assert(counter.decrement() === 1, 'should increment and decrement');
assert(counter.getCount() === 1, 'should increment and decrement');
assert(counter.getCount() === 10, 'should reset');
assert(memoized(5) === 10, 'should cache results');
assert(memoized(5) === 10, 'should cache results');
assert(memoized(2, 3) === 5, 'should handle multiple arguments');
assert(memoized(2, 3) === 5, 'should handle multiple arguments');
assert(acc(5) === 15, 'should accumulate values');
assert(acc(3) === 18, 'should accumulate values');
assert(acc(-8) === 10, 'should accumulate values');
assert(nextId() === 1, 'should generate sequential IDs');
assert(nextId() === 2, 'should generate sequential IDs');
assert(nextId() === 3, 'should generate sequential IDs');
assert(gen1() === 1, 'should be independent');
assert(gen2() === 1, 'should be independent');
assert(gen1() === 2, 'should be independent');
assert(limited() === 'called', 'should limit function calls');
assert(limited() === 'called', 'should limit function calls');
assert(limited() === undefined, 'should limit function calls');
assert(toggle() === 'on', 'should alternate between values');
assert(toggle() === 'off', 'should alternate between values');
assert(toggle() === 'on', 'should alternate between values');
assert(history.length === 2, 'should track call history');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
