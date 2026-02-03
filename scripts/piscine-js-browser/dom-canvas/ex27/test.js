// Note: Functions are expected to be defined by user code
// (createCanvas, getContext, drawFilledRect, drawStrokedRect, drawFilledCircle, drawStrokedCircle, clearCanvas, drawLine, fillBackground)

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

console.log('Testing Ex27 - Canvas Basics...\n');

assert(newCanvas instanceof HTMLCanvasElement, 'should create canvas with dimensions');
assert(newCanvas.width === 800, 'should create canvas with dimensions');
assert(newCanvas.height === 600, 'should create canvas with dimensions');
assert(context instanceof CanvasRenderingContext2D, 'should return 2D context');
assert(ctx.fillStyle === '#0000ff', 'should call fillRect with correct parameters');
assert(ctx.strokeStyle === '#ff0000', 'should call strokeRect with correct parameters');
assert(ctx.lineWidth === 3, 'should call strokeRect with correct parameters');
assert(ctx.lineWidth === 2, 'should draw stroked circle');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
