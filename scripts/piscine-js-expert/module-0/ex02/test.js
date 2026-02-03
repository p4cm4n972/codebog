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

console.log('Testing Functions...\n');

// Test createGreeter
const greetHello = createGreeter('Hello');
const greetBonjour = createGreeter('Bonjour');
assert(greetHello('Alice') === 'Hello, Alice!', 'createGreeter: Hello, Alice!');
assert(greetBonjour('Bob') === 'Bonjour, Bob!', 'createGreeter: Bonjour, Bob!');

// Test sumAll
assert(sumAll(1, 2, 3) === 6, 'sumAll: 1 + 2 + 3 = 6');
assert(sumAll(10, 20) === 30, 'sumAll: 10 + 20 = 30');
assert(sumAll(5) === 5, 'sumAll: single argument');
assert(sumAll() === 0, 'sumAll: no arguments = 0');
assert(sumAll(1, 2, 3, 4, 5) === 15, 'sumAll: many arguments');

// Test applyOperation
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
assert(applyOperation(5, 3, add) === 8, 'applyOperation: 5 + 3 = 8');
assert(applyOperation(4, 7, multiply) === 28, 'applyOperation: 4 * 7 = 28');

// Test createMultiplier
const double = createMultiplier(2);
const triple = createMultiplier(3);
assert(double(5) === 10, 'createMultiplier: double(5) = 10');
assert(triple(5) === 15, 'createMultiplier: triple(5) = 15');
assert(double(10) === 20, 'createMultiplier: double(10) = 20');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
