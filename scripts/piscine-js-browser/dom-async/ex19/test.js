// Note: Functions are expected to be defined by user code
// (ApiError, fetchSafe, fetchWithRetry, fetchWithTimeout, safeFetch, fetchWithFallback, createFetchWithErrorHandler, isNetworkError)

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

console.log('Testing Ex19 - Error Handling...\n');

assert(error.status === 404, 'should create error with status and message');
assert(error.message === 'Not Found', 'should create error with status and message');
assert(error.name === 'ApiError', 'should create error with status and message');

try {
    await fetchSafe('/api/data');
    assert(false, 'should throw Error for network errors - should reject');
} catch (e) {
    assert(true, 'should throw Error for network errors');
};

try {
    await promise;
    assert(false, 'should throw after max retries - should reject');
} catch (e) {
    assert(true, 'should throw after max retries');
};
assert(result.success === false, 'should return error object on failure');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
