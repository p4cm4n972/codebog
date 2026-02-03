// Note: Functions are expected to be defined by user code
// (createAdder, createMultiplier, createGreeter, withLogging, once, partial)

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

console.log('Testing Ex11 - Function Literals...\n');

assert(add(2, 3) === 5, 'should return an add function');
assert(add(-1, 1) === 0, 'should return an add function');
assert(double(5) === 10, 'should multiply by factor');
assert(triple(5) === 15, 'should multiply by factor');
assert(hello('Alice') === 'Hello, Alice!', 'should create greeting function');
assert(hi('Bob') === 'Hi, Bob!', 'should create greeting function');
assert(loggedAdd(2, 3) === 5, 'should preserve function behavior');
assert(loggedSum(1, 2, 3, 4) === 10, 'should work with any arity');
assert(onceFn() === 'result', 'should only execute once');
assert(onceFn() === undefined, 'should only execute once');
assert(onceFn() === undefined, 'should only execute once');
assert(add5And3(2) === 10, 'should work with multiple preset args');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
