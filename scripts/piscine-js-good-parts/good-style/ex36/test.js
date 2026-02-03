// Note: Functions are expected to be defined by user code
// (processOrderV1, getUserStatusV1, canPerformActionV1, createOrderValidator, AGE_CONSTANTS, PermissionHelpers, calculateOrderTotals, pipeline)

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

console.log('Testing Ex36 - Refactoring...\n');

// TODO: manually convert test 'should classify users by age';
assert(AGE_CONSTANTS.LEGAL_AGE === 18, 'should define age thresholds');
assert(AGE_CONSTANTS.SENIOR_AGE === 65, 'should define age thresholds');
assert(AGE_CONSTANTS.MAX_AGE === 150, 'should define age thresholds');
assert(result === '12', 'should apply transformations');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
