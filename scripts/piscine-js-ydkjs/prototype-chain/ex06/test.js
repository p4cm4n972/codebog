// Note: Functions are expected to be defined by user code
// (instance1, instance2, instance3, instance4)

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

console.log('Testing Ex06 - instanceof...\n');

assert(JSON.stringify(instance1()) === JSON.stringify([true, true]), 'should return [true, true]');
assert(instance2() === false, 'should return false (prototype changed)');
assert(JSON.stringify(instance3()) === JSON.stringify([true, true]), 'should return [true, true]');
assert(instance4() === true, 'should return true (same prototype)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
