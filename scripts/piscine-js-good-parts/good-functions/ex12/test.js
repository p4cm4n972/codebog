// Note: Functions are expected to be defined by user code
// (createPerson, callWith, applyWith, bindTo, extractMethod, borrowMethod, callOnTemporary)

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

console.log('Testing Ex12 - Invocation Patterns...\n');

assert(person.name === 'Alice', 'should create person with greet method');
assert(person.greet() === 'Hello, Alice', 'should create person with greet method');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
