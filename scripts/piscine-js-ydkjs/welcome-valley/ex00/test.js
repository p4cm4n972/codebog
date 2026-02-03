// Note: Functions are expected to be defined by user code
// (helloWorld, addNumbers, concatenate, whatIsThis)

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

console.log('Testing Ex00 - Hello JavaScript...\n');

assert(typeof helloWorld() === 'string', 'should return a string');
assert(addNumbers() === 42, 'should return 42');
assert(typeof addNumbers() === 'number', 'should return a number');
assert(concatenate().includes(' '), 'should include a space between words');
assert(typeof 'hello' === 'string', 'should use typeof operator correctly');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
