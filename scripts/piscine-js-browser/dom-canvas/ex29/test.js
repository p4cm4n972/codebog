// Note: Functions are expected to be defined by user code
// (loadImage, drawImage, drawSprite, translate, rotate, scale, resetTransform, drawRotatedRect, drawWithTransform)

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

console.log('Testing Ex29 - Images & Transformations...\n');

assert(result instanceof Promise, 'should return a promise');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
