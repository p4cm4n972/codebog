// Note: Functions are expected to be defined by user code
// (lookup1, lookup2, lookup3, lookup4)

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

console.log('Testing Ex01 - Property Lookup...\n');

assert(lookup1() === 1, 'should return 1 (inherited from parent)');
assert(lookup2() === 1, 'should return 1 (inherited from grandparent)');
assert(JSON.stringify(lookup3()) === JSON.stringify([1, 2, undefined]), 'should return [1, 2, undefined]');
assert(JSON.stringify(lookup4()) === JSON.stringify([false, true]), 'should return [false, true]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
