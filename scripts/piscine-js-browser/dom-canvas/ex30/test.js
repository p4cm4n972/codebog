// Note: Functions are expected to be defined by user code
// (createAnimationLoop, createDeltaTimeLoop, createMovingObject, animate, createFpsCounter, easings, lerp)

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

console.log('Testing Ex30 - Animation...\n');

// TODO: manually convert test 'should call callback on each frame';
assert(dt > 0, 'should pass delta time to callback');
assert(easings.linear(0.5) === 0.5, 'should have linear easing');
assert(easings.easeInQuad(0.5) === 0.25, 'should have easeInQuad');
assert(easings.easeOutQuad(0.5) === 0.75, 'should have easeOutQuad');
assert(lerp(0, 100, 0) === 0, 'should interpolate between values');
assert(lerp(0, 100, 1) === 100, 'should interpolate between values');
assert(lerp(0, 100, 0.5) === 50, 'should interpolate between values');
assert(lerp(-50, 50, 0.5) === 0, 'should handle negative values');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
