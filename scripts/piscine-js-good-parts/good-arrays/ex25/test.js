// Note: Functions are expected to be defined by user code
// (findUserById, findIndexWhere, contains, hasAny, hasAll, findFirstAbove, containsAll, containsAny)

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

console.log('Testing Ex25 - Array Search...\n');

// TODO: manually convert test 'should find user by id';
assert(findUserById(users, 999) === undefined, 'should return undefined if not found');
assert(findIndexWhere(arr, x => x > 25) === 2, 'should find index');
assert(findIndexWhere([1, 2, 3], x => x > 10) === -1, 'should return -1 if not found');
assert(contains([1, 2, 3], 2) === true, 'should check presence');
assert(contains([1, 2, 3], 5) === false, 'should check presence');
assert(contains([NaN], NaN) === true, 'should handle NaN');
assert(hasAny([1, 2, 3, 4], x => x > 3) === true, 'should return true if any match');
assert(hasAny([1, 2, 3], x => x > 10) === false, 'should return false if none match');
assert(hasAll([2, 4, 6], x => x % 2 === 0) === true, 'should return true if all match');
assert(hasAll([2, 3, 4], x => x % 2 === 0) === false, 'should return false if any fails');
assert(findFirstAbove([1, 5, 10, 15], 8) === 10, 'should find first above threshold');
assert(containsAll([1, 2, 3, 4, 5], [2, 4]) === true, 'should check all values present');
assert(containsAll([1, 2, 3], [2, 5]) === false, 'should check all values present');
assert(containsAny([1, 2, 3], [5, 2, 9]) === true, 'should check any value present');
assert(containsAny([1, 2, 3], [7, 8, 9]) === false, 'should check any value present');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
