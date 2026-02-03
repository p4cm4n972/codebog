// Note: Functions are expected to be defined by user code
// (symbol1, symbol2, symbol3, symbol4, symbol5)

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

console.log('Testing Ex02 - Symbols...\n');

assert(JSON.stringify(symbol3()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
assert(JSON.stringify(symbol4()) === JSON.stringify([true, false]), 'should return [true, false]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
