// Note: Functions are expected to be defined by user code
// (all1, all2, race1, any1, settled1)

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

console.log('Testing Ex06 - Promise Combinators...\n');

assert(JSON.stringify(await all1()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
