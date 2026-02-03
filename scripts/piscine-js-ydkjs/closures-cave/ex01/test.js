// Note: Functions are expected to be defined by user code
// (loopTrap1, loopFixed1, loopFixed2, loopTrap2)

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

console.log('Testing Ex01 - Loop Closure Trap...\n');

assert(JSON.stringify(loopTrap1()) === JSON.stringify([3, 3, 3]), 'should return [3, 3, 3] (all share same i)');
assert(JSON.stringify(loopFixed1()) === JSON.stringify([0, 1, 2]), 'should return [0, 1, 2] (each has its own i)');
assert(JSON.stringify(loopFixed2()) === JSON.stringify([0, 1, 2]), 'should return [0, 1, 2] (IIFE creates new scope)');
assert(JSON.stringify(loopTrap2()) === JSON.stringify([0, 1, 2]), 'should return [0, 1, 2] (object stores i at creation)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
