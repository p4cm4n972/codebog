// Note: Functions are expected to be defined by user code
// (nan1, nan2, nan3, nan4, nan5, inf1, inf2, inf3, inf4)

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

console.log('Testing Ex02 - NaN & Infinity...\n');

assert(JSON.stringify(nan1()) === JSON.stringify(typeof NaN), 'matches actual JS behavior');
assert(nan2() === true, 'should return true (isNaN coerces first)');
assert(JSON.stringify(nan2()) === JSON.stringify(isNaN("hello"), 'matches actual JS behavior');
assert(nan3() === false, 'should return false (Number.isNaN checks type first)');
assert(JSON.stringify(nan3()) === JSON.stringify(Number.isNaN("hello"), 'matches actual JS behavior');
assert(nan4() === false, 'should return false (NaN is never equal to anything)');
assert(JSON.stringify(nan4()) === JSON.stringify(NaN === NaN), 'matches actual JS behavior');
assert(nan5() === true, 'should return true (Object.is handles NaN correctly)');
assert(JSON.stringify(nan5()) === JSON.stringify(Object.is(NaN, NaN), 'matches actual JS behavior');
assert(inf1() === Infinity, 'should return Infinity');
assert(JSON.stringify(inf1()) === JSON.stringify(1 / 0), 'matches actual JS behavior');
assert(inf2() === -Infinity, 'should return -Infinity');
assert(JSON.stringify(inf2()) === JSON.stringify(-1 / 0), 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
