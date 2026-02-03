// Note: Functions are expected to be defined by user code
// (asyncIter1, asyncIter2, asyncIter3)

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

console.log('Testing Ex07 - Async Iteration...\n');

assert(JSON.stringify(await asyncIter1()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
assert(JSON.stringify(await asyncIter2()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
assert(JSON.stringify(await asyncIter3()) === JSON.stringify([3, 2, 1]), 'should return [3, 2, 1]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
