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

console.log('Testing Objects...\n');

// Test getProperty
const obj = { name: 'Alice', age: 25 };
assert(getProperty(obj, 'name') === 'Alice', 'getProperty: gets name');
assert(getProperty(obj, 'age') === 25, 'getProperty: gets age');

// Test mergeObjects
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const merged = mergeObjects(obj1, obj2);
assert(merged.a === 1 && merged.b === 3 && merged.c === 4, 'mergeObjects: merges correctly');
assert(obj1.b === 2, 'mergeObjects: does not mutate obj1');

// Test pick
const user = { name: 'Bob', age: 30, city: 'Paris', job: 'Dev' };
const picked = pick(user, ['name', 'age']);
assert(
    picked.name === 'Bob' && picked.age === 30 && !picked.city && !picked.job,
    'pick: picks specified keys only'
);

// Test invertObject
const original = { a: '1', b: '2', c: '3' };
const inverted = invertObject(original);
assert(
    inverted['1'] === 'a' && inverted['2'] === 'b' && inverted['3'] === 'c',
    'invertObject: inverts keys and values'
);

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
