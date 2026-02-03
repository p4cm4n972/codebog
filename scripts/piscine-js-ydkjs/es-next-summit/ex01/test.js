// Note: Functions are expected to be defined by user code
// (spread1, spread2, spread3, spread4, spread5, spread6)

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

console.log('Testing Ex01 - Spread & Rest...\n');

assert(JSON.stringify(spread1()) === JSON.stringify([1, 2, 3, 4]), 'should return [1, 2, 3, 4]');
assert(spread4() === 10, 'should return 10');
assert(spread5() === 999, 'should return 999 (shallow copy!)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
