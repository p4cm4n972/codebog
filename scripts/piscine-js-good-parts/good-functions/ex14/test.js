// Note: Functions are expected to be defined by user code
// (safeDivide, findFirst, constant, identity, getOrElse, createTransformer, tryCatch)

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

console.log('Testing Ex14 - Return...\n');

assert(safeDivide(10, 2) === 5, 'should divide normally');
assert(safeDivide(10, 0) === null, 'should return null for division by zero');
assert(findFirst(arr, x => x > 3) === 4, 'should find first match');
assert(findFirst(arr, x => x > 10) === undefined, 'should return undefined if not found');
assert(five() === 5, 'should always return same value');
assert(five() === 5, 'should always return same value');
assert(id(5) === 5, 'should return its argument');
assert(id('hello') === 'hello', 'should return its argument');
assert(double(3) === 36, 'should create nested transformer');
assert(success === true, 'should return success tuple');
assert(result === 5, 'should return success tuple');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
