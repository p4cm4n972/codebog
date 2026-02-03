// Note: Functions are expected to be defined by user code
// (createArray, accessElements, modifyArray, arrayMethods, spreadArray)

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

console.log('Testing Ex03 - Arrays Introduction...\n');

assert(createArray() === 3, 'should return 3 (length of array)');
assert(arr[0] === 'a', 'demonstrates 0-based indexing');
assert(arr[2] === 'c', 'demonstrates 0-based indexing');
assert(JSON.stringify(arr[100]) === JSON.stringify(undefined), 'demonstrates 0-based indexing');
assert(JSON.stringify(modifyArray()) === JSON.stringify([0, 1, 2, 3, 4]), 'should return [0, 1, 2, 3, 4]');
assert(JSON.stringify(doubled) === JSON.stringify([2, 4, 6, 8, 10]), 'should return [[2,4,6,8,10], [2,4], 15]');
assert(JSON.stringify(evens) === JSON.stringify([2, 4]), 'should return [[2,4,6,8,10], [2,4], 15]');
assert(sum === 15, 'should return [[2,4,6,8,10], [2,4], 15]');
assert(JSON.stringify(arr.map(x => x * 2)) === JSON.stringify([2, 4, 6]), 'demonstrates map, filter, reduce');
assert(JSON.stringify(arr.filter(x => x > 1)) === JSON.stringify([2, 3]), 'demonstrates map, filter, reduce');
assert(JSON.stringify(spreadArray()) === JSON.stringify([1, 2, 3, 4]), 'should return [1, 2, 3, 4]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
