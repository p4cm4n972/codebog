// Note: Functions are expected to be defined by user code
// (createCancellableRequest, fetchWithTimeout, isAbortError, createSearchHandler, fetchAllWithSignal, raceWithTimeout, fetchWithCleanup)

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

console.log('Testing Ex21 - AbortController...\n');

assert(isAbortError(error) === true, 'should return true for AbortError');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
