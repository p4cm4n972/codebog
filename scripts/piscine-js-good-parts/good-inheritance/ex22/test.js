// Note: Functions are expected to be defined by user code
// (createPerson, createUser, createWallet, createNotification, createUrlBuilder, createFactory, createPool)

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

console.log('Testing Ex22 - Factory Functions...\n');

assert(person.name === 'Alice', 'should create person with greet');
assert(person.age === 30, 'should create person with greet');
assert(person.greet().includes('Alice'), 'should create person with greet');
assert(wallet.getBalance() === 100, 'should manage balance privately');
assert(wallet.getBalance() === 150, 'should manage balance privately');
assert(wallet.getBalance() === 120, 'should manage balance privately');
assert(url === 'https://api.example.com/users/123?format=json', 'should build URL with chain');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
