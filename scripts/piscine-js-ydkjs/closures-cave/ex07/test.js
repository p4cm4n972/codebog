// Note: Functions are expected to be defined by user code
// (curry, testCurry, explainDifference)

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

console.log('Testing Ex07 - Currying...\n');

// TODO: manually convert test 'should work with single argument calls';
assert(curried(1, 2, 3) === 6, 'should work with all arguments at once');
assert(curried(3, 4) === 12, 'should work with 2-argument functions');
assert(JSON.stringify(testCurry()) === JSON.stringify([6, 6, 6, 6]), 'should return [6, 6, 6, 6]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
