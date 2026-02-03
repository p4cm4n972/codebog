// Note: Functions are expected to be defined by user code
// (doubleAll, pluck, evensOnly, compact, sum, average, groupBy, countOccurrences)

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

console.log('Testing Ex24 - Array Methods...\n');

assert(JSON.stringify(doubleAll([1, 2, 3])) === JSON.stringify([2, 4, 6]), 'should double all numbers');
assert(JSON.stringify(doubleAll([])) === JSON.stringify([]), 'should handle empty array');
assert(JSON.stringify(evensOnly([1, 2, 3, 4, 5, 6])) === JSON.stringify([2, 4, 6]), 'should keep only even numbers');
assert(JSON.stringify(compact([0, 1, false, 2, '', 3, null, undefined])) === JSON.stringify([1, 2, 3]), 'should remove falsy values');
assert(sum([1, 2, 3, 4]) === 10, 'should sum all numbers');
assert(sum([]) === 0, 'should return 0 for empty array');
assert(average([10, 20, 30]) === 20, 'should calculate average');
assert(average([]) === 0, 'should return 0 for empty array');
assert(result.a === 3, 'should count items');
assert(result.b === 2, 'should count items');
assert(result.c === 1, 'should count items');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
