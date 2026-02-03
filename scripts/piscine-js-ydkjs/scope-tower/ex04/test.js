// Note: Functions are expected to be defined by user code
// (global1, global2, global3, global4, global5)

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

console.log('Testing Ex04 - Global Pollution...\n');

assert(global3() === false, 'should return false');
assert(global4() === 42, 'should return 42');
assert(JSON.stringify(global5()) === JSON.stringify([1, 2]), 'should return [1, 2]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
