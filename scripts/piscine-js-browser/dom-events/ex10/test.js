// Note: Functions are expected to be defined by user code
// (trackMousePosition, onHover, setupKeyboardShortcuts, onInputDebounced, handleClickTypes, disableContextMenu, onResizeThrottled, handleScroll)

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

console.log('Testing Ex10 - Common Events...\n');

// TODO: manually convert test 'should call onEnter when mouse enters';
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
