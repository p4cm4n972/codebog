// Note: Functions are expected to be defined by user code
// (addField, addFieldGroup, removeField, createRepeatableField, createConditionalField, populateSelect, createMultiStepForm, validateStep, generateForm)

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

console.log('Testing Ex16 - Dynamic Forms...\n');

assert(JSON.stringify(form.elements.username) === JSON.stringify(input), 'should add input to form');
assert(result === true, 'should remove field by name');
assert(form.elements.toRemove === undefined, 'should remove field by name');
assert(result === false, 'should return false for non-existent field');
assert(select.options.length === 3, 'should handle string array');
assert(select.options[0].value === 'one', 'should handle string array');
assert(step1.hidden === false, 'should show only current step');
assert(step2.hidden === true, 'should show only current step');
assert(step3.hidden === true, 'should show only current step');
assert(step1.hidden === true, 'should show only current step');
assert(step2.hidden === false, 'should show only current step');
assert(step1.hidden === false, 'should show only current step');
assert(wizard.getCurrentStep() === 0, 'should return current step');
assert(wizard.getCurrentStep() === 1, 'should return current step');
assert(validateStep(step) === true, 'should return true for valid step');
assert(validateStep(step) === false, 'should return false for invalid step');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
