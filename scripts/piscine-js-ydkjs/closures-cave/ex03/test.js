// Note: Functions are expected to be defined by user code
// (createPerson, testPrivate)

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

console.log('Testing Ex03 - Private State...\n');

assert(p.getName() === "Alice", 'should create a person with getters');
assert(p.getAge() === 25, 'should create a person with getters');
assert(p.getAge() === 26, 'should increment age with birthday()');
assert(p.getName() === "Bob", 'should rename with valid string');
assert(p.getName() === "Alice", 'should not rename with empty string');
assert(p.getAge() === 25, 'should protect private state from direct modification');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
