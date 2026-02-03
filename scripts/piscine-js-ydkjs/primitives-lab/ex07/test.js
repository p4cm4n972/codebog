// Note: Functions are expected to be defined by user code
// (bigint1, bigint2, bigint3, bigint4, symbol1, symbol2, symbol3, symbol4)

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

console.log('Testing Ex07 - BigInt & Symbols...\n');

assert(JSON.stringify(bigint1()) === JSON.stringify(typeof 42n), 'matches actual JS behavior');
assert(bigint2() === false, 'should return false (different types)');
assert(JSON.stringify(bigint2()) === JSON.stringify(42n === 42), 'matches actual JS behavior');
assert(bigint3() === true, 'should return true (coercion)');
assert(JSON.stringify(bigint3()) === JSON.stringify(42n == 42), 'matches actual JS behavior');
assert(JSON.stringify(symbol1()) === JSON.stringify(typeof Symbol("test"), 'matches actual JS behavior');
assert(symbol2() === false, 'should return false (each Symbol is unique)');
assert(JSON.stringify(symbol2()) === JSON.stringify(Symbol("test"), 'matches actual JS behavior');
assert(symbol3() === true, 'should return true (global registry)');
assert(JSON.stringify(symbol3()) === JSON.stringify(Symbol.for("test"), 'matches actual JS behavior');
assert(symbol4() === 1, 'should return 1 (Symbols not enumerable by Object.keys)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
