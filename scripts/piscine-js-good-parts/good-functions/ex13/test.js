// Note: Functions are expected to be defined by user code
// (sum, withDefault, createUser, pluck, combineCallbacks, arity, namedArgs)

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

console.log('Testing Ex13 - Arguments...\n');

assert(sum(1, 2, 3) === 6, 'should sum all arguments');
assert(sum(10, 20, 30, 40) === 100, 'should sum all arguments');
assert(sum() === 0, 'should return 0 for no arguments');
assert(withDefault('hello', 'default') === 'hello', 'should return value if defined');
assert(withDefault(0, 'default') === 0, 'should return value if defined');
assert(withDefault(undefined, 'default') === 'default', 'should return default for undefined');
assert(withDefault(undefined) === null, 'should use null as default');
assert(JSON.stringify(limited(1, 2, 3, 4)) === JSON.stringify([1, 2]), 'should limit arguments');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
