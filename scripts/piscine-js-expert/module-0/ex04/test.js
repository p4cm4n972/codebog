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

console.log('Testing Array Methods...\n');

// Test doubleNumbers
assert(
    JSON.stringify(doubleNumbers([1, 2, 3])) === JSON.stringify([2, 4, 6]),
    'doubleNumbers: [1,2,3] -> [2,4,6]'
);

// Test filterEven
assert(
    JSON.stringify(filterEven([1, 2, 3, 4, 5, 6])) === JSON.stringify([2, 4, 6]),
    'filterEven: filters even numbers'
);

// Test sumArray
assert(sumArray([1, 2, 3, 4]) === 10, 'sumArray: 1+2+3+4 = 10');
assert(sumArray([]) === 0, 'sumArray: empty array = 0');

// Test getNames
const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 35 }
];
assert(
    JSON.stringify(getNames(users)) === JSON.stringify(['Alice', 'Bob', 'Charlie']),
    'getNames: extracts names'
);

// Test countByProperty
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Charlie', age: 25 },
    { name: 'Dave', age: 30 }
];
const ageCount = countByProperty(people, 'age');
assert(ageCount[25] === 2 && ageCount[30] === 2, 'countByProperty: counts by age');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
