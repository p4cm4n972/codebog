// Note: Functions are expected to be defined by user code
// (onInput, onChange, onFocusBlur, focusElement, selectAll, selectRange, createCharCounter, onFileSelect, createLivePreview, onSelectChange)

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

console.log('Testing Ex13 - Input Events...\n');

// TODO: manually convert test 'should call callback on input event';
assert(display.textContent.includes('4'), 'should update display with character count');
assert(preview.textContent === 'Hello World', 'should update preview on input');
assert(preview.textContent === 'HELLO', 'should apply transform function');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
