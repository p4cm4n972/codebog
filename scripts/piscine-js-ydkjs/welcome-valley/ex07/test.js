// Note: Functions are expected to be defined by user code
// (sumWithFor, sumWithWhile, iterateArray, getObjectKeys, doubleWithForEach, breakExample, continueExample)

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

console.log('Testing Ex07 - Loops...\n');

assert(sumWithFor(5) === 15, 'should return 15 for n=5');
assert(sumWithFor(10) === 55, 'should return 55 for n=10');
assert(sumWithFor(1) === 1, 'should return 1 for n=1');
assert(sumWithWhile(5) === 15, 'should return 15 for n=5');
assert(sumWithWhile(10) === 55, 'should return 55 for n=10');
assert(iterateArray([1, 2, 3]) === 6, 'should return 6 for [1, 2, 3]');
assert(iterateArray([]) === 0, 'should return 0 for empty array');
assert(iterateArray([1, -1, 2, -2]) === 0, 'should handle negative numbers');
assert(JSON.stringify(doubleWithForEach([1, 2, 3])) === JSON.stringify([2, 4, 6]), 'should return [2, 4, 6] for [1, 2, 3]');
assert(JSON.stringify(doubleWithForEach([])) === JSON.stringify([]), 'should return empty array for empty input');
assert(JSON.stringify(doubleWithForEach([-1, -2])) === JSON.stringify([-2, -4]), 'should handle negative numbers');
assert(breakExample() === 7, 'should return 7 (first multiple of 7)');
assert(JSON.stringify(continueExample()) === JSON.stringify([1, 2, 4, 5, 7, 8, 10]), 'should return numbers 1-10 not divisible by 3');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
