// Note: Functions are expected to be defined by user code
// (varTest, letTest, constTest, constObject, namingConventions)

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

console.log('Testing Ex01 - Variables & Constants...\n');

assert(varTest() === 2, 'should return 2 after redeclaring var');
assert(letTest() === 2, 'should return 2 after reassigning let');
assert(constTest() === 42, 'should return 42 from const');
assert(JSON.stringify(namingConventions()) === JSON.stringify([true, true]), 'should return [true, true]');
assert(Array.isArray(result) === true, 'should return an array of booleans');
assert(result.length === 2, 'should return an array of booleans');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
