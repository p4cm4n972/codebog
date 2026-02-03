// Note: Functions are expected to be defined by user code
// (destruct1, destruct2, destruct3, destruct4, destruct5, destruct6, destruct7, destruct8)

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

console.log('Testing Ex00 - Destructuring Deep...\n');

assert(JSON.stringify(destruct1()) === JSON.stringify([1, 2]), 'should return [1, 2]');
assert(JSON.stringify(destruct2()) === JSON.stringify([1, 10]), 'should return [1, 10]');
assert(JSON.stringify(destruct3()) === JSON.stringify([1, 2]), 'should return [1, 2]');
assert(destruct4() === 42, 'should return 42');
assert(JSON.stringify(destruct5()) === JSON.stringify([1, 3]), 'should return [1, 3]');
assert(JSON.stringify(destruct6()) === JSON.stringify([1, [2, 3, 4]]), 'should return [1, [2, 3, 4]]');
assert(JSON.stringify(destruct8()) === JSON.stringify([1, null]), 'should return [1, null] (default only for undefined)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
