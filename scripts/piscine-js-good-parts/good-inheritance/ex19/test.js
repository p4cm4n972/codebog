// Note: Functions are expected to be defined by user code
// (createAnimalProto, createDog, createHierarchy, isOwnProperty, getOwnProperties, getAllProperties, overrideMethod)

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

console.log('Testing Ex19 - Prototypal Inheritance...\n');

assert(animal.speak() === 'Generic makes a sound', 'should create animal with speak');
assert(dog.name === 'Rex', 'should create dog that inherits from animal');
assert(dog.speak() === 'Rex makes a sound', 'should create dog that inherits from animal');
assert(dog.bark() === 'Rex barks', 'should create dog that inherits from animal');
assert(typeof proto.speak === 'function', 'should have animal as prototype');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
