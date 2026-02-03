// Note: Functions are expected to be defined by user code
// (postJson, postFormData, putJson, patchJson, deleteResource, resourceExists, createApiClient)

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

console.log('Testing Ex18 - POST and Other Methods...\n');

assert(typeof client.get === 'function', 'should create client with all HTTP methods');
assert(typeof client.post === 'function', 'should create client with all HTTP methods');
assert(typeof client.put === 'function', 'should create client with all HTTP methods');
assert(typeof client.patch === 'function', 'should create client with all HTTP methods');
assert(typeof client.delete === 'function', 'should create client with all HTTP methods');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
