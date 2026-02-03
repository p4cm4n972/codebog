// Note: Functions are expected to be defined by user code
// (partial, testPartial, partialWithPlaceholder, testPartialPlaceholder)

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

console.log('Testing Ex06 - Partial Application...\n');

assert(add5(3, 2) === 10, 'should fix first arguments');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
