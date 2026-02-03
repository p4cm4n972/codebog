// Note: Functions are expected to be defined by user code
// (handleSubmit, formDataToJson, formDataToUrlEncoded, appendToFormData, submitAsJson, submitForm, getFormFiles, validateAndSubmit)

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

console.log('Testing Ex15 - Form Submission...\n');

assert(formData.get('name') === 'John', 'should pass FormData to callback');
assert(json.name === 'John', 'should convert FormData to object');
assert(json.email === 'john@example.com', 'should convert FormData to object');
assert(encoded.includes('name=John'), 'should convert FormData to URL-encoded string');
assert(encoded.includes('email=john%40example.com'), 'should convert FormData to URL-encoded string');
assert(JSON.stringify(files) === JSON.stringify([]), 'should return empty array when no files');
assert(result.success === false, 'should return error for invalid form');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
