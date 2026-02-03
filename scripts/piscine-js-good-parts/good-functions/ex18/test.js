// Note: Functions are expected to be defined by user code
// (curry2, curry3, curry, compose2, compose, pipe, partial, partialRight, flip)

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

console.log('Testing Ex18 - Curry & Compose...\n');

assert(add10(5) === 15, 'should curry 2-argument function');
assert(doubleThenAdd(5) === 11, 'should compose two functions');
assert(composed(2) === 36, 'should compose multiple functions (right to left)');
assert(piped(2) === 36, 'should pipe functions (left to right)');
assert(subtract(5, 3) === 2, 'should flip first two arguments');
assert(flipped(5, 3) === -2, 'should flip first two arguments');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
