// Note: Functions are expected to be defined by user code
// (createModule, testModule)

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

console.log('Testing Ex02 - Module Pattern...\n');

assert(mod.getCount() === 0, 'should create a working module');
assert(mod.getCount() === 1, 'should create a working module');
assert(mod.privateData === undefined, 'should have private variables');
assert(mod.privateSecret === undefined, 'should have private variables');
assert(JSON.stringify(testModule()) === JSON.stringify([2, undefined, undefined]), 'should return [2, undefined, undefined]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
