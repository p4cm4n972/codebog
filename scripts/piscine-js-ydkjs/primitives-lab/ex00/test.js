// Note: Functions are expected to be defined by user code
// (quiz1, quiz2, quiz3, quiz4, quiz5, quiz6)

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

console.log('Testing Ex00 - Type Coercion Basics...\n');

// TODO: manually convert test 'matches actual JS behavior';
assert(JSON.stringify(quiz3()) === JSON.stringify([] + []), 'matches actual JS behavior');
assert(quiz5() === "5" + 3, 'matches actual JS behavior');
assert(quiz6() === 2, 'should return 2 (numeric subtraction)');
assert(quiz6() === "5" - 3, 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
