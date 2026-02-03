// Note: Functions are expected to be defined by user code
// (constructor1, constructor2, constructor3)

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

console.log('Testing Ex04 - Constructor Functions...\n');

assert(constructor2() === false, 'should return false (constructor lost)');
assert(constructor3() === true, 'should return true (constructor restored)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
