// Note: Functions are expected to be defined by user code
// (greet, multiply, divide, double, greetFormal, testFunctions, greetWithDefault, testDefaults)

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

console.log('Testing Ex05 - Functions Basics...\n');

assert(greet('Bob') === 'Hello, Bob!', 'should work with any name');
assert(multiply(3, 4) === 12, 'should return 12 for multiply(3, 4)');
assert(multiply(-2, 5) === -10, 'should handle negative numbers');
assert(divide(10, 2) === 5, 'should return 5 for divide(10, 2)');
assert(divide(7, 2) === 3.5, 'should handle decimals');
assert(double(21) === 42, 'should return 42 for double(21)');
assert(greetWithDefault('Bob') === 'Welcome, Bob!', 'should use provided name');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
