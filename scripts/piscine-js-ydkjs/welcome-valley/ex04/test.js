// Note: Functions are expected to be defined by user code
// (createObject, accessProperty, modifyObject, objectShorthand, nestedObject, objectMethods)

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

console.log('Testing Ex04 - Objects Introduction...\n');

// TODO: manually convert test 'should not have age property';
assert(JSON.stringify(keys) === JSON.stringify(['a', 'b', 'c']), 'should return correct keys, values, and entries');
assert(JSON.stringify(values) === JSON.stringify([1, 2, 3]), 'should return correct keys, values, and entries');
assert(JSON.stringify(entries) === JSON.stringify([['a', 1], ['b', 2], ['c', 3]]), 'should return correct keys, values, and entries');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
