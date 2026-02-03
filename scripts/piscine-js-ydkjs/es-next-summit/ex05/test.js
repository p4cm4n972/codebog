// Note: Functions are expected to be defined by user code
// (weak1, weak2, weak3, weak4, weak5)

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

console.log('Testing Ex05 - WeakMap & WeakSet...\n');

assert(JSON.stringify(weak5()) === JSON.stringify([true, false]), 'should return [true, false]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
