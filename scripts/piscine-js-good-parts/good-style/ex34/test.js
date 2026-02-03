// Note: Functions are expected to be defined by user code
// (ValidationError, BusinessError, safeDivide, safeJsonParse, validateOrThrow, withRetry, toResult, combineResults)

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

console.log('Testing Ex34 - Error Handling...\n');

assert(error instanceof Error, 'should create validation error');
assert(error.name === 'ValidationError', 'should create validation error');
assert(error.field === 'email', 'should create validation error');
assert(error.message === 'Invalid email', 'should create validation error');
assert(error.code === 'INSUFFICIENT_FUNDS', 'should create business error');
assert(error.message === 'Not enough money', 'should create business error');
assert(result.success === true, 'should return success for valid division');
assert(result.value === 5, 'should return success for valid division');
assert(result.success === false, 'should return error for division by zero');
assert(result.success === false, 'should return error for invalid JSON');
assert(result.success === true, 'should succeed on first try');
assert(result.value === 'success', 'should succeed on first try');
assert(result.attempts === 1, 'should succeed on first try');
assert(result.success === true, 'should wrap successful function');
assert(result.value === 10, 'should wrap successful function');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
