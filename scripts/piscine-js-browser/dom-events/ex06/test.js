// Note: Functions are expected to be defined by user code
// (addClickListener, removeClickListener, addOnceListener, addMultipleListeners, createRemovableListener, createAbortableListeners, triggerEvent, createClickCounter)

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

console.log('Testing Ex06 - Event Listeners...\n');

// TODO: manually convert test 'should add click handler';
assert(counter.getCount() === 3, 'should count clicks');
assert(counter.getCount() === 0, 'should reset count');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
