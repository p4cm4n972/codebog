// Note: Functions are expected to be defined by user code
// (getEventInfo, getMousePosition, getKeyInfo, isKeyCombination, preventDefaultIf, createEventLogger, getMouseButton, getRelativePosition)

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

console.log('Testing Ex07 - Event Object...\n');

assert(typeof logger === 'function', 'should return a handler function');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
