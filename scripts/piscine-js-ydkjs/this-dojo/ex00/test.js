// Note: Functions are expected to be defined by user code
// (default1, default2, default3)

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

console.log('Testing Ex00 - Default Binding...\n');

assert(default1() === true, 'should return true (this === globalThis)');
assert(JSON.stringify(default2()) === JSON.stringify(undefined), 'should return undefined');
assert(default3() === true, 'should return true (arrow inherits this)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
