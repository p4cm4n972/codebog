// Note: Functions are expected to be defined by user code
// (createCounter, testClosure1, testClosure2, testClosure3)

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

console.log('Testing Ex00 - Closure Basics...\n');

assert(counter() === 1, 'should create a working counter');
assert(counter() === 2, 'should create a working counter');
assert(counter() === 3, 'should create a working counter');
assert(c1() === 3, 'should create independent counters');
assert(c2() === 1, 'should create independent counters');
assert(JSON.stringify(testClosure1()) === JSON.stringify([1, 2, 3]), 'should return [1, 2, 3]');
assert(JSON.stringify(testClosure2()) === JSON.stringify([3, 2]), 'should return [3, 2] (independent closures)');
assert(JSON.stringify(testClosure3()) === JSON.stringify([8, 13]), 'should return [8, 13]');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
