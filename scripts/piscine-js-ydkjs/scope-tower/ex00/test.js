// Note: Functions are expected to be defined by user code
// (scope1, scope2, scope3, scope4)

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

console.log('Testing Ex00 - Lexical Scope...\n');

assert(scope1() === 1, 'should return 1');
assert(scope2() === 2, 'should return 2 (inner x shadows outer x)');
assert(scope3() === 2, 'should return 2 (deeper accesses inner x)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
