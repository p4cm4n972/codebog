// Note: Functions are expected to be defined by user code
// (isFalsy, isTruthy, getAllFalsyValues, withDefault, withDefaultNullish, compact, countTruthy)

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

console.log('Testing Ex02 - Truthy & Falsy...\n');

assert(isFalsy(false) === true, 'should identify falsy values');
assert(isFalsy(null) === true, 'should identify falsy values');
assert(isFalsy(undefined) === true, 'should identify falsy values');
assert(isFalsy(0) === true, 'should identify falsy values');
assert(isFalsy(NaN) === true, 'should identify falsy values');
assert(isFalsy('') === true, 'should identify falsy values');
assert(isFalsy(true) === false, 'should return false for truthy values');
assert(isFalsy(1) === false, 'should return false for truthy values');
assert(isFalsy('hello') === false, 'should return false for truthy values');
assert(isFalsy([]) === false, 'should return false for truthy values');
assert(isTruthy(true) === true, 'should identify truthy values');
assert(isTruthy(1) === true, 'should identify truthy values');
assert(isTruthy('hello') === true, 'should identify truthy values');
assert(isTruthy([]) === true, 'should identify truthy values');
assert(falsyValues.length === 6, 'should return the 6 falsy values');
assert(withDefault('hello', 'default') === 'hello', 'should return value if truthy');
assert(withDefault(42, 0) === 42, 'should return value if truthy');
assert(withDefault('', 'default') === 'default', 'should return default if falsy');
assert(withDefault(0, 42) === 42, 'should return default if falsy');
assert(withDefault(null, 'fallback') === 'fallback', 'should return default if falsy');
assert(withDefaultNullish(null, 'default') === 'default', 'should only fallback on null/undefined');
assert(withDefaultNullish(undefined, 'default') === 'default', 'should only fallback on null/undefined');
assert(withDefaultNullish('', 'default') === '', 'should only fallback on null/undefined');
assert(withDefaultNullish(0, 42) === 0, 'should only fallback on null/undefined');
assert(withDefaultNullish(false, true) === false, 'should only fallback on null/undefined');
assert(JSON.stringify(compact([0, 1, false, 2, '', 3, null, 4, undefined])) === JSON.stringify([1, 2, 3, 4]), 'should remove falsy values');
assert(countTruthy([1, 0, true, false, 'a', '', null]) === 3, 'should count truthy values');
assert(countTruthy([0, '', null, undefined]) === 0, 'should count truthy values');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
