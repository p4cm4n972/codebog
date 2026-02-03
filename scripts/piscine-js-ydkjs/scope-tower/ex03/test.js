// Note: Functions are expected to be defined by user code
// (block1, block2, block3, block4, block5)

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

console.log('Testing Ex03 - Block Scope...\n');

assert(JSON.stringify(block3()) === JSON.stringify([3, 3, 3]), 'should return [3, 3, 3] (all closures share same i)');
assert(JSON.stringify(block4()) === JSON.stringify([0, 1, 2]), 'should return [0, 1, 2] (each iteration has its own i)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
