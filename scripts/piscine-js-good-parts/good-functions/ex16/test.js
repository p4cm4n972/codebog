// Note: Functions are expected to be defined by user code
// (forEach, map, filter, find, safeExecute, pipe, parallel, conditional)

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

console.log('Testing Ex16 - Callbacks...\n');

// TODO: manually convert test 'should call callback for each element';
assert(JSON.stringify(result) === JSON.stringify([2, 4, 6]), 'should transform elements');
assert(JSON.stringify(result) === JSON.stringify([3, 4, 5]), 'should filter elements');
assert(result === 3, 'should find first match');
assert(result === undefined, 'should return undefined if not found');
assert(result === 42, 'should return result on success');
assert(result === 9, 'should chain callbacks');
assert(JSON.stringify(results) === JSON.stringify([1, 2, 3]), 'should execute all and return results');
assert(fn() === 'yes', 'should execute ifTrue when condition is true');
assert(fn() === 'no', 'should execute ifFalse when condition is false');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
