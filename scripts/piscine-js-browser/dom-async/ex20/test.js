// Note: Functions are expected to be defined by user code
// (createHeaders, fetchWithHeaders, fetchWithBearerToken, fetchWithBasicAuth, fetchWithApiKey, fetchWithCredentials, fetchNoCache, createAuthenticatedClient, modifyHeaders)

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

console.log('Testing Ex20 - Request Headers...\n');

// TODO: manually convert test 'should include Authorization Bearer header';
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
