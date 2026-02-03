// Note: Functions are expected to be defined by user code
// (drawTriangle, drawPolygon, drawArc, drawQuadraticCurve, drawText, drawStrokedText, measureTextWidth, drawPath, drawStar)

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

console.log('Testing Ex28 - Paths & Text...\n');

// TODO: manually convert test 'should draw a triangle';
assert(typeof width === 'number', 'should return text width');
assert(width > 0, 'should return text width');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
