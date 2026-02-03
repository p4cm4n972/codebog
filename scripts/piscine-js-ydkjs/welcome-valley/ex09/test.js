// Note: Functions are expected to be defined by user code
// (strictEquality, looseEquality, compareStrictVsLoose, comparisonOperators, objectEquality, nanEquality)

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

console.log('Testing Ex09 - Comparisons & Equality...\n');

assert(strictEquality(5, 5) === true, 'should return true for same type and value');
assert(strictEquality(5, '5') === false, 'should return false for different types');
assert(strictEquality('hello', 'hello') === true, 'should return true for same strings');
assert(looseEquality(5, '5') === true, 'should return true with type coercion');
assert(looseEquality(null, undefined) === true, 'should return true for null and undefined');
assert(looseEquality(0, false) === true, 'should return true for 0 and false');
assert(JSON.stringify(compareStrictVsLoose()) === JSON.stringify([
        false, // 5 === "5"
        true,  // 5 == "5"
        false, // null === undefined
        true,  // null == undefined
        false, // 0 === false
        true   // 0 == false
      ]), 'should return correct comparison results');
assert(JSON.stringify(nanEquality()) === JSON.stringify([
        false, // NaN === NaN is false!
        true   // Number.isNaN(NaN), 'should demonstrate NaN !== NaN and Number.isNaN');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
