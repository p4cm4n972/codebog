// Note: Functions are expected to be defined by user code
// (createPerson, createDynamic, merge, shallowClone, range, concat, pick, omit)

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

console.log('Testing Ex04 - Object & Array Literals...\n');

// TODO: manually convert test 'should create person with shorthand';
assert(JSON.stringify(range(1, 5)) === JSON.stringify([1, 2, 3, 4, 5]), 'should create array of numbers');
assert(JSON.stringify(range(0, 3)) === JSON.stringify([0, 1, 2, 3]), 'should create array of numbers');
assert(JSON.stringify(range(5, 5)) === JSON.stringify([5]), 'should handle single element');
assert(JSON.stringify(concat([1, 2], [3, 4], [5])) === JSON.stringify([1, 2, 3, 4, 5]), 'should concatenate arrays');
assert(JSON.stringify(concat([], [1], [])) === JSON.stringify([1]), 'should handle empty arrays');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
