// Note: Functions are expected to be defined by user code
// (guard, firstTruthy, firstFalsy, safeGet, callIfAllTruthy, validate)

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

console.log('Testing Ex03 - Guard Expressions...\n');

assert(result === 'executed', 'should execute action if condition is true');
assert(!result, 'should not execute action if condition is false');
assert(firstTruthy(null, undefined, 0, 'hello', 'world') === 'hello', 'should return first truthy value');
assert(firstTruthy(false, 0, '') === '', 'should return first truthy value');
assert(firstTruthy(null, undefined, false) === false, 'should return last if all falsy');
assert(firstFalsy(1, 2, 0, 3) === 0, 'should return first falsy value');
assert(firstFalsy('a', '', 'c') === '', 'should return first falsy value');
assert(firstFalsy(1, 2, 3) === 3, 'should return last if all truthy');
assert(safeGet(null, ['a', 'b']) === undefined, 'should handle null objects');
assert(callIfAllTruthy(fn, 1, 2) === 3, 'should call function if all args are truthy');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
