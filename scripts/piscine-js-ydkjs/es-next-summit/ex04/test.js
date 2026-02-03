// Note: Functions are expected to be defined by user code
// (proxy1, proxy2, proxy3, proxy4)

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

console.log('Testing Ex04 - Proxy & Reflect...\n');

assert(JSON.stringify(proxy4()) === JSON.stringify([3, 7, [[1, 2], [3, 4]]]), 'should return [3, 7, [[1,2], [3,4]]]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
