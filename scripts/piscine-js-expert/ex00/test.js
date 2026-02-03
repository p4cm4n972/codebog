// Note: compose and pipe are expected to be defined by user code

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

// Helper functions
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;
const square = x => x * x;

console.log('Testing compose...\n');

// Test 1: Basic composition
const composed1 = compose(subtract3, multiply2, add5);
assert(composed1(10) === 27, 'compose: (10 + 5) * 2 - 3 = 27');

// Test 2: Single function
const composed2 = compose(add5);
assert(composed2(10) === 15, 'compose: single function works');

// Test 3: No functions (identity)
const composed3 = compose();
assert(composed3(42) === 42, 'compose: no functions returns identity');

// Test 4: Complex composition
const composed4 = compose(square, add5, multiply2);
assert(composed4(3) === 121, 'compose: (3 * 2 + 5)^2 = 121');

console.log('\nTesting pipe...\n');

// Test 5: Basic pipe
const piped1 = pipe(add5, multiply2, subtract3);
assert(piped1(10) === 27, 'pipe: (10 + 5) * 2 - 3 = 27');

// Test 6: Single function
const piped2 = pipe(add5);
assert(piped2(10) === 15, 'pipe: single function works');

// Test 7: No functions (identity)
const piped3 = pipe();
assert(piped3(42) === 42, 'pipe: no functions returns identity');

// Test 8: Pipe vs Compose order
const piped4 = pipe(multiply2, add5, square);
assert(piped4(3) === 121, 'pipe: (3 * 2 + 5)^2 = 121');

// Test 9: String manipulation
const toUpper = s => s.toUpperCase();
const exclaim = s => s + '!';
const repeat = s => s + ' ' + s;

const stringPipe = pipe(toUpper, exclaim, repeat);
assert(stringPipe('hello') === 'HELLO! HELLO!', 'pipe: works with strings');

// Test 10: Error handling (bonus)
try {
    const badCompose = compose(add5, 'not a function', multiply2);
    badCompose(5);
    assert(false, 'compose: should throw on non-function');
} catch (e) {
    assert(true, 'compose: throws on non-function argument');
}

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
