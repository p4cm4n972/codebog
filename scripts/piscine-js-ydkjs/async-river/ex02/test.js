// Note: Functions are expected to be defined by user code
// (micro1, micro2, micro3)

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

console.log('Testing Ex02 - Microtasks vs Macrotasks...\n');

assert(JSON.stringify(await micro3()) === JSON.stringify([
        'script start',
        'async1 start',
        'async2',
        'promise1',
        'script end',
        'async1 end',
        'promise2',
        'timeout'
      ]), 'should return the correct order');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
