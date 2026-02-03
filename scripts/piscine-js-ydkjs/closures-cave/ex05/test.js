// Note: Functions are expected to be defined by user code
// (memoize, testMemoize)

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

console.log('Testing Ex05 - Memoization...\n');

assert(JSON.stringify(testMemoize()) === JSON.stringify([10, 10, 20, 10, 2]), 'should return [10, 10, 20, 10, 2]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
