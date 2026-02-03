// Note: Functions are expected to be defined by user code
// (flatten, flattenDeep, getAllTags, sortNumbers, sortBy, reverseArray, unique, intersection)

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

console.log('Testing Ex26 - Array Transform...\n');

assert(JSON.stringify(flatten([[1, 2], [3, 4]])) === JSON.stringify([1, 2, 3, 4]), 'should flatten one level');
assert(JSON.stringify(flatten([[1, [2]], [3]])) === JSON.stringify([1, [2], 3]), 'should not flatten deeper');
assert(JSON.stringify(flattenDeep([1, [2, [3, [4]]]])) === JSON.stringify([1, 2, 3, 4]), 'should flatten completely');
assert(JSON.stringify(sortNumbers([3, 1, 4, 1, 5])) === JSON.stringify([1, 1, 3, 4, 5]), 'should sort ascending');
assert(JSON.stringify(original) === JSON.stringify([3, 1, 2]), 'should not mutate original');
assert(result[0].name === 'Alice', 'should sort by property ascending');
assert(result[0].name === 'Charlie', 'should sort by property descending');
assert(JSON.stringify(reversed) === JSON.stringify([3, 2, 1]), 'should reverse without mutation');
assert(JSON.stringify(original) === JSON.stringify([1, 2, 3]), 'should reverse without mutation');
assert(JSON.stringify(unique([1, 2, 2, 3, 1, 4])) === JSON.stringify([1, 2, 3, 4]), 'should remove duplicates');
assert(JSON.stringify(intersection([1, 2, 3, 4], [3, 4, 5, 6])) === JSON.stringify([3, 4]), 'should find common elements');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
