// Note: Functions are expected to be defined by user code
// (getFormById, getFieldByName, getFormValues, getCheckboxValue, getSelectedRadio, getMultiSelectValues, setFormValues, resetForm, countFormFields, formDataToObject)

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

console.log('Testing Ex12 - Form Basics...\n');

assert(JSON.stringify(getFormById('testForm')) === JSON.stringify(form), 'should return form by ID');
assert(getFormById('notFound') === null, 'should return null for non-existent form');
assert(field.value === 'john', 'should return field by name');
assert(values.username === 'john', 'should return object with form values');
assert(values.email === 'john@example.com', 'should return object with form values');
assert(getCheckboxValue(checkbox) === true, 'should return true for checked');
assert(getCheckboxValue(checkbox) === false, 'should return false for unchecked');
assert(getSelectedRadio(form, 'gender') === 'female', 'should return selected radio value');
assert(getSelectedRadio(form, 'gender') === null, 'should return null if none selected');
assert(values.includes('fr'), 'should return array of selected values');
assert(values.includes('uk'), 'should return array of selected values');
assert(!values.includes('us'), 'should return array of selected values');
assert(form.elements.username.value === '', 'should reset form to initial state');
assert(countFormFields(form) === 6, 'should return number of form fields');
assert(Array.isArray(obj.country) === true, 'should handle multiple values as array');
assert(obj.country.includes('fr'), 'should handle multiple values as array');
assert(obj.country.includes('uk'), 'should handle multiple values as array');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
