// Note: Functions are expected to be defined by user code
// (type1, type2, type3, type4, type5, type6, type7)

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

console.log('Testing Ex04 - typeof Quirks...\n');

assert(JSON.stringify(type1()) === JSON.stringify(typeof undefined), 'matches actual JS behavior');
assert(JSON.stringify(type2()) === JSON.stringify(typeof null), 'matches actual JS behavior');
assert(JSON.stringify(type3()) === JSON.stringify(typeof function(), 'matches actual JS behavior');
assert(JSON.stringify(type4()) === JSON.stringify(typeof []), 'matches actual JS behavior');
assert(JSON.stringify(type5()) === JSON.stringify(typeof Symbol("test"), 'matches actual JS behavior');
assert(JSON.stringify(type6()) === JSON.stringify(typeof 42n), 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
