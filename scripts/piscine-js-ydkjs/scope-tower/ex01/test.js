// Note: Functions are expected to be defined by user code
// (hoist1Answer, hoist2, hoist3, hoist4, hoist5Answer)

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

console.log('Testing Ex01 - Hoisting Deep Dive...\n');

assert(JSON.stringify(hoist1Answer()) === JSON.stringify(undefined), 'should return undefined (var is hoisted but not initialized)');
assert(JSON.stringify(hoist5Answer()) === JSON.stringify(undefined), 'should return undefined (inner var x is hoisted, shadows outer)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
