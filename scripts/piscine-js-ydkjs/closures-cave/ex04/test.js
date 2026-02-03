// Note: Functions are expected to be defined by user code
// (createStack, testStack)

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

console.log('Testing Ex04 - Factory Functions...\n');

assert(stack.pop() === 2, 'should push and pop correctly');
assert(stack.pop() === 1, 'should push and pop correctly');
assert(stack.size() === 3, 'should support method chaining');
assert(stack.peek() === 42, 'should peek without removing');
assert(stack.size() === 1, 'should peek without removing');
assert(stack.isEmpty() === true, 'should report isEmpty correctly');
assert(stack.isEmpty() === false, 'should report isEmpty correctly');
assert(stack.items === undefined, 'should keep items private');
assert(JSON.stringify(testStack()) === JSON.stringify([3, 2, 2, undefined]), 'should return [3, 2, 2, undefined]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
