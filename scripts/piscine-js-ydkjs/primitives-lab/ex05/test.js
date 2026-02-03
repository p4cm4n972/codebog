// Note: Functions are expected to be defined by user code
// (box1, box2, box3, box4, box5, box6)

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

console.log('Testing Ex05 - Boxing & Unboxing...\n');

assert(JSON.stringify(box1()) === JSON.stringify(typeof temp), 'matches actual JS behavior');
assert(JSON.stringify(box2()) === JSON.stringify(undefined), 'should return undefined (property on temporary object is lost)');
assert(JSON.stringify(box2()) === JSON.stringify(str.custom), 'matches actual JS behavior');
assert(JSON.stringify(box3()) === JSON.stringify(strObj.custom), 'matches actual JS behavior');
assert(JSON.stringify(box4()) === JSON.stringify(typeof new Number(42), 'matches actual JS behavior');
assert(box5() === false, 'should return false (different types)');
assert(JSON.stringify(box5()) === JSON.stringify(new Number(42), 'matches actual JS behavior');
assert(box6() === true, 'should return true (coercion to primitive)');
assert(JSON.stringify(box6()) === JSON.stringify(new Number(42), 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
