// Note: Functions are expected to be defined by user code
// (checkAge, checkScore, ternaryExample, getDayName, isTruthy, testTruthyFalsy)

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

console.log('Testing Ex06 - Conditionals...\n');

assert(isTruthy(0) === false, 'should return false for 0');
assert(isTruthy(1) === true, 'should return true for 1');
assert(isTruthy('') === false, 'should return false for empty string');
assert(isTruthy('hello') === true, 'should return true for non-empty string');
assert(isTruthy(null) === false, 'should return false for null');
assert(isTruthy([]) === true, 'should return true for empty array (arrays are truthy!)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
