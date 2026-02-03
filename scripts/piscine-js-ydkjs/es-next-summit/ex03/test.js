// Note: Functions are expected to be defined by user code
// (gen1, gen2, gen3, gen4, gen5)

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

console.log('Testing Ex03 - Iterators & Generators...\n');

assert(JSON.stringify(gen1()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
assert(JSON.stringify(gen2()) === JSON.stringify([1, 2]), 'should return [1, 2] (return value not included)');
assert(JSON.stringify(gen3()) === JSON.stringify([5, 6, 7, 8]), 'should return [5, 6, 7, 8]');
assert(JSON.stringify(gen4()) === JSON.stringify([1, 2, 3, 4]), 'should return [1, 2, 3, 4]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
