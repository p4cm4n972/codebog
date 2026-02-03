// Note: Functions are expected to be defined by user code
// (getMousePos, isPointInCircle, isPointInRect, trackMouse, createDrawingHandler, makeDraggable, createClickHandler)

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

console.log('Testing Ex31 - Interactive Canvas...\n');

assert(isPointInCircle(100, 100, 100, 100, 50) === true, 'should return true for point inside');
assert(isPointInCircle(120, 100, 100, 100, 50) === true, 'should return true for point inside');
assert(isPointInCircle(200, 100, 100, 100, 50) === false, 'should return false for point outside');
assert(isPointInCircle(150, 100, 100, 100, 50) === true, 'should return true for point on edge');
assert(isPointInRect(50, 50, 0, 0, 100, 100) === true, 'should return true for point inside');
assert(isPointInRect(150, 50, 0, 0, 100, 100) === false, 'should return false for point outside');
assert(isPointInRect(100, 50, 0, 0, 100, 100) === true, 'should return true for point on edge');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
