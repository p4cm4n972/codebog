// Note: Functions are expected to be defined by user code
// (blockScope, countTo, createCounter, swap, sum, createConfig)

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

console.log('Testing Ex01 - Declarations...\n');

assert(result.outsideBlock === 'not accessible', 'should demonstrate block scoping');
assert(JSON.stringify(countTo(5)) === JSON.stringify([1, 2, 3, 4, 5]), 'should count from 1 to n');
assert(JSON.stringify(countTo(0)) === JSON.stringify([]), 'should count from 1 to n');
assert(counter.getValue() === 0, 'should create a counter with methods');
assert(counter.getValue() === 1, 'should create a counter with methods');
assert(counter.getValue() === 0, 'should create a counter with methods');
assert(c1.getValue() === 2, 'should maintain separate state per instance');
assert(c2.getValue() === 0, 'should maintain separate state per instance');
assert(JSON.stringify(arr) === JSON.stringify([5, 2, 3, 4, 1]), 'should swap two elements');
assert(sum([1, 2, 3, 4, 5]) === 15, 'should sum numbers');
assert(sum([]) === 0, 'should sum numbers');
assert(config.theme === 'light', 'should use defaults');
assert(config.language === 'en', 'should use defaults');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
