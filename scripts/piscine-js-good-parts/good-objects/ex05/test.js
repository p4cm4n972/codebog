// Note: Functions are expected to be defined by user code
// (createBook, getWithDefault, getNestedProperty, hasOwnProperty, fromPairs, toPairs)

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

console.log('Testing Ex05 - Object Literals...\n');

// TODO: manually convert test 'should create a book object';
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
