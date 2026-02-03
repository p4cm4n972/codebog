// Note: Functions are expected to be defined by user code
// (strictEquals, isNull, isUndefined, isNullish, compare, strictIndexOf)

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

console.log('Testing Ex00 - Strict Equality...\n');

assert(strictEquals(1, 1) === true, 'should return true for identical values');
assert(strictEquals('a', 'a') === true, 'should return true for identical values');
assert(strictEquals(true, true) === true, 'should return true for identical values');
assert(strictEquals(1, '1') === false, 'should return false for different types');
assert(strictEquals(0, '') === false, 'should return false for different types');
assert(strictEquals(false, 0) === false, 'should return false for different types');
assert(strictEquals(null, undefined) === false, 'should handle special cases');
assert(strictEquals(NaN, NaN) === false, 'should handle special cases');
assert(isNull(null) === true, 'should return true only for null');
assert(isNull(undefined) === false, 'should return true only for null');
assert(isNull(0) === false, 'should return true only for null');
assert(isNull('') === false, 'should return true only for null');
assert(isUndefined(undefined) === true, 'should return true only for undefined');
assert(isUndefined(null) === false, 'should return true only for undefined');
assert(isUndefined(0) === false, 'should return true only for undefined');
assert(isNullish(null) === true, 'should return true for null or undefined');
assert(isNullish(undefined) === true, 'should return true for null or undefined');
assert(isNullish(0) === false, 'should return true for null or undefined');
assert(isNullish('') === false, 'should return true for null or undefined');
assert(isNullish(false) === false, 'should return true for null or undefined');
assert(strictIndexOf([1, 2, 3], 2) === 1, 'should find with strict equality');
assert(strictIndexOf(['1', '2', '3'], 2) === -1, 'should find with strict equality');
assert(strictIndexOf([1, '2', 3], '2') === 1, 'should find with strict equality');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
