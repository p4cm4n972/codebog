// Note: Functions are expected to be defined by user code
// (createEvent, createCustomEvent, dispatchEvent, createEventBus, triggerCancelableEvent, createTypedEmitter, waitForEvent, relayEvents)

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

console.log('Testing Ex11 - Custom Events...\n');

assert(event instanceof Event, 'should create a simple Event');
assert(event.type === 'myevent', 'should create a simple Event');
assert(result === true, 'should return true if not canceled');

try {
    await promise;
    assert(false, 'should reject on timeout - should reject');
} catch (e) {
    assert(true, 'should reject on timeout');
};
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
