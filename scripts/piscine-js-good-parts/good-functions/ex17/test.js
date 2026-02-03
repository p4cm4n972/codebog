// Note: Functions are expected to be defined by user code
// (createCounterModule, createCacheModule, createValidatorModule, createPubSubModule, createStoreModule, createLoggerModule)

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

console.log('Testing Ex17 - Module Pattern...\n');

assert(counter.getCount() === 0, 'should encapsulate counter state');
assert(counter.increment() === 1, 'should encapsulate counter state');
assert(counter.increment() === 2, 'should encapsulate counter state');
assert(counter.decrement() === 1, 'should encapsulate counter state');
assert(cache.get('key1') === 'value1', 'should store and retrieve values');
assert(cache.has('key1') === true, 'should store and retrieve values');
assert(cache.size() === 1, 'should store and retrieve values');
assert(cache.size() === 2, 'should respect max size');
assert(cache.size() === 0, 'should clear');
assert(validator.validate('hello') === true, 'should add and run rules');
assert(validator.validate('hi') === false, 'should add and run rules');
assert(validator.getErrors().includes('minLength'), 'should add and run rules');
assert(logs.length === 2, 'should filter by level');
assert(logs[0].level === 'warn', 'should filter by level');
assert(logger.getLogs().length === 1, 'should change level');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
