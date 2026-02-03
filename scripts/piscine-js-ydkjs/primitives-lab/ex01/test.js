// Note: Functions are expected to be defined by user code
// (eq1, eq2, eq3, eq4, eq5, eq6, eq7)

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

console.log('Testing Ex01 - Equality Operators...\n');

assert(eq1() === true, 'should return true');
assert(JSON.stringify(eq1()) === JSON.stringify(null == undefined), 'matches actual JS behavior');
assert(eq2() === false, 'should return false (different types)');
assert(JSON.stringify(eq2()) === JSON.stringify(null === undefined), 'matches actual JS behavior');
assert(eq3() === false, 'should return false (NaN is never equal to anything)');
assert(JSON.stringify(eq3()) === JSON.stringify(NaN == NaN), 'matches actual JS behavior');
assert(eq4() === true, 'should return true');
assert(JSON.stringify(eq4()) === JSON.stringify([] == false), 'matches actual JS behavior');
assert(eq5() === true, 'should return true (the most confusing JS case!)');
assert(JSON.stringify(eq5()) === JSON.stringify([] == ![]), 'matches actual JS behavior');
assert(eq6() === true, 'should return true');
assert(eq6() === "0" == false, 'matches actual JS behavior');
assert(eq7() === true, 'should return true (whitespace string coerces to 0)');
assert(eq7() === " \t\n" == 0, 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
