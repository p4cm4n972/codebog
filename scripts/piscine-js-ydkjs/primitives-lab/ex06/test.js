// Note: Functions are expected to be defined by user code
// (isFalsy, getAllFalsyValues, falsy1, falsy2, falsy3, falsy4)

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

console.log('Testing Ex06 - Falsy Values...\n');

assert(isFalsy(0) === true, 'should return true for 0');
assert(isFalsy("") === true, 'should return true for empty string');
assert(isFalsy(null) === true, 'should return true for null');
assert(isFalsy(undefined) === true, 'should return true for undefined');
assert(isFalsy(NaN) === true, 'should return true for NaN');
assert(isFalsy([]) === false, 'should return false for empty array (truthy!)');
assert(result.includes(false), 'should return all 8 falsy values');
assert(result.includes(0), 'should return all 8 falsy values');
assert(result.includes(""), 'should return all 8 falsy values');
assert(result.includes(null), 'should return all 8 falsy values');
assert(result.includes(undefined), 'should return all 8 falsy values');
assert(result.includes(0n), 'should return all 8 falsy values');
assert(falsy1() === true, 'should return true (empty array is truthy!)');
assert(JSON.stringify(falsy1()) === JSON.stringify(!![]), 'matches actual JS behavior');
assert(falsy2() === false, 'should return false (empty string is falsy)');
assert(JSON.stringify(falsy2()) === JSON.stringify(!!""), 'matches actual JS behavior');
assert(falsy3() === true, 'should return true (non-empty string is truthy)');
assert(JSON.stringify(falsy3()) === JSON.stringify(!!"false"), 'matches actual JS behavior');
assert(falsy4() === true, 'should return true (object wrapper is always truthy!)');
assert(JSON.stringify(falsy4()) === JSON.stringify(!!new Boolean(false), 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
