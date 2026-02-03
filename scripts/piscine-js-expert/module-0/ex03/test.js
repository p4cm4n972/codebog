// Note: Functions are expected to be defined by user code

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

console.log('Testing Arrays Basics...\n');

// Test getLastElement
assert(getLastElement([1, 2, 3]) === 3, 'getLastElement: [1,2,3] -> 3');
assert(getLastElement(['a', 'b']) === 'b', 'getLastElement: ["a","b"] -> "b"');

// Test addToEnd
const arr1 = [1, 2, 3];
const arr2 = addToEnd(arr1, 4);
assert(JSON.stringify(arr2) === JSON.stringify([1, 2, 3, 4]), 'addToEnd: adds element');
assert(JSON.stringify(arr1) === JSON.stringify([1, 2, 3]), 'addToEnd: does not mutate original');

// Test removeFirst
const arr3 = [1, 2, 3];
const arr4 = removeFirst(arr3);
assert(JSON.stringify(arr4) === JSON.stringify([2, 3]), 'removeFirst: removes first');
assert(JSON.stringify(arr3) === JSON.stringify([1, 2, 3]), 'removeFirst: does not mutate original');

// Test getMiddleElements
assert(
    JSON.stringify(getMiddleElements([1, 2, 3, 4, 5])) === JSON.stringify([2, 3, 4]),
    'getMiddleElements: [1,2,3,4,5] -> [2,3,4]'
);
assert(
    JSON.stringify(getMiddleElements([1, 2, 3])) === JSON.stringify([2]),
    'getMiddleElements: [1,2,3] -> [2]'
);

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
