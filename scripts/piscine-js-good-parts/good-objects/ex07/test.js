// Note: Functions are expected to be defined by user code
// (createWithProto, getProto, isInPrototypeChain, createDog, countPrototypeLevels, getInheritedMethods)

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

console.log('Testing Ex07 - Prototype...\n');

assert(getProto(obj) === null, 'should return null for Object.create(null)');
assert(dog.name === 'Rex', 'should create dog with inherited speak');
assert(dog.speak() === 'Rex makes a sound', 'should create dog with inherited speak');
assert(dog.bark() === 'Buddy barks', 'should have own bark method');
assert(countPrototypeLevels(obj) === 0, 'should count 0 for null prototype');
assert(countPrototypeLevels(b) === 1, 'should count prototype chain');
assert(countPrototypeLevels(c) === 2, 'should count prototype chain');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
