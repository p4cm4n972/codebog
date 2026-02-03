// Note: Functions are expected to be defined by user code
// (proto1, proto2, proto3, proto4)

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

console.log('Testing Ex00 - [[Prototype]] Link...\n');

assert(proto1() === true, 'should return true (Object.prototype)');
assert(JSON.stringify(proto2()) === JSON.stringify([true, true]), 'should return [true, true]');
assert(proto3() === true, 'should return true (Foo.prototype)');
assert(JSON.stringify(proto4()) === JSON.stringify(null), 'should return null');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
