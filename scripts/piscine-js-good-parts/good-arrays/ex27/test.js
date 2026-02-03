// Note: Functions are expected to be defined by user code
// (append, prepend, removeLast, removeFirst, removeAt, insertAt, updateAt, move)

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

console.log('Testing Ex27 - Array Mutation...\n');

assert(JSON.stringify(result) === JSON.stringify([1, 2, 3, 4]), 'should add to end without mutation');
assert(JSON.stringify(original) === JSON.stringify([1, 2, 3]), 'should add to end without mutation');
assert(JSON.stringify(result) === JSON.stringify([0, 1, 2, 3]), 'should add to start without mutation');
assert(JSON.stringify(original) === JSON.stringify([1, 2, 3]), 'should add to start without mutation');
assert(JSON.stringify(result) === JSON.stringify([1, 2]), 'should remove last without mutation');
assert(JSON.stringify(original) === JSON.stringify([1, 2, 3]), 'should remove last without mutation');
assert(JSON.stringify(result) === JSON.stringify([2, 3]), 'should remove first without mutation');
assert(JSON.stringify(original) === JSON.stringify([1, 2, 3]), 'should remove first without mutation');
assert(JSON.stringify(removeAt([1, 2, 3, 4], 2)) === JSON.stringify([1, 2, 4]), 'should remove at index');
assert(JSON.stringify(insertAt([1, 2, 4], 2, 3)) === JSON.stringify([1, 2, 3, 4]), 'should insert at index');
assert(JSON.stringify(updateAt([1, 2, 3], 1, 20)) === JSON.stringify([1, 20, 3]), 'should update at index');
assert(JSON.stringify(move([1, 2, 3, 4], 0, 2)) === JSON.stringify([2, 3, 1, 4]), 'should move element forward');
assert(JSON.stringify(move([1, 2, 3, 4], 3, 1)) === JSON.stringify([1, 4, 2, 3]), 'should move element backward');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
