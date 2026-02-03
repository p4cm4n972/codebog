// Note: Functions are expected to be defined by user code
// (zip, unzip, chunk, partition, stats, indexBy, multiSort, slidingWindow)

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

console.log('Testing Ex28 - Advanced Patterns...\n');

assert(JSON.stringify(zip([1, 2, 3], ['a', 'b', 'c'])) === JSON.stringify([[1, 'a'], [2, 'b'], [3, 'c']]), 'should combine arrays');
assert(JSON.stringify(unzip([[1, 'a'], [2, 'b'], [3, 'c']])) === JSON.stringify([[1, 2, 3], ['a', 'b', 'c']]), 'should separate pairs');
assert(JSON.stringify(chunk([1, 2, 3, 4, 5], 2)) === JSON.stringify([[1, 2], [3, 4], [5]]), 'should split into chunks');
assert(JSON.stringify(chunk([1, 2, 3, 4], 2)) === JSON.stringify([[1, 2], [3, 4]]), 'should handle exact divisions');
assert(JSON.stringify(evens) === JSON.stringify([2, 4]), 'should separate by predicate');
assert(JSON.stringify(odds) === JSON.stringify([1, 3, 5]), 'should separate by predicate');
assert(result.min === 10, 'should calculate all stats');
assert(result.max === 30, 'should calculate all stats');
assert(result.sum === 60, 'should calculate all stats');
assert(result.avg === 20, 'should calculate all stats');
assert(result.count === 3, 'should calculate all stats');
assert(JSON.stringify(slidingWindow([1, 2, 3, 4], 2)) === JSON.stringify([[1, 2], [2, 3], [3, 4]]), 'should create windows');
assert(JSON.stringify(slidingWindow([1, 2, 3, 4, 5], 3)) === JSON.stringify([[1, 2, 3], [2, 3, 4], [3, 4, 5]]), 'should handle window size 3');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
