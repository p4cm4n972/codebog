// Note: Functions are expected to be defined by user code
// (addCaptureListener, addBubbleListener, createStopPropagationHandler, createStopImmediateHandler, doesEventBubble, getEventPhase)

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

console.log('Testing Ex08 - Event Bubbling & Capturing...\n');

assert(order[0] === 'parent-capture', 'should add listener in capture phase');
assert(order[1] === 'child', 'should add listener in capture phase');
assert(order[0] === 'child', 'should add listener in bubble phase');
assert(order[1] === 'parent-bubble', 'should add listener in bubble phase');
assert(JSON.stringify(order) === JSON.stringify(['parent-capture', 'child', 'parent-bubble']), 'should follow capture -> target -> bubble order');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
