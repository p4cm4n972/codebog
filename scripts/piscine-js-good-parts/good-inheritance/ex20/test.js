// Note: Functions are expected to be defined by user code
// (createBase, createAnimal, createDog, createBankAccount, createSavingsAccount, createObservable)

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

console.log('Testing Ex20 - Functional Inheritance...\n');

assert(observable.getValue() === 20, 'should notify subscribers on change');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
