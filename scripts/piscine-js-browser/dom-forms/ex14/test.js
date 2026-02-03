// Note: Functions are expected to be defined by user code
// (isValid, getValidityState, getErrorMessage, setCustomError, validateForm, getInvalidFields, addCustomValidator, validatePasswordMatch, validateFormDetailed)

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

console.log('Testing Ex14 - Form Validation...\n');

assert(isValid(emailInput) === false, 'should return false for empty required field');
assert(isValid(emailInput) === true, 'should return true for valid field');
assert(isValid(emailInput) === false, 'should return false for invalid email');
assert(state.valueMissing === true, 'should return valueMissing for empty required');
assert(state.typeMismatch === true, 'should return typeMismatch for invalid email');
assert(state.tooShort === true, 'should return tooShort for password too short');
assert(message !== '', 'should return error message for invalid field');
assert(message === '', 'should return empty string for valid field');
assert(isValid(emailInput) === false, 'should set custom error');
assert(isValid(emailInput) === true, 'should clear error with empty string');
assert(validateForm(form) === false, 'should return false for invalid form');
assert(validateForm(form) === true, 'should return true for valid form');
assert(invalid.length === 2, 'should return array of invalid fields');
assert(invalid.length === 0, 'should return empty array when all valid');
assert(isValid(emailInput) === false, 'should add custom validation');
assert(isValid(confirmInput) === false, 'should be invalid when passwords do not match');
assert(isValid(confirmInput) === true, 'should be valid when passwords match');
assert(result.valid === false, 'should return detailed validation result');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
