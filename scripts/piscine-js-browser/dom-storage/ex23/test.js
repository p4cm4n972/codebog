// Note: Functions are expected to be defined by user code
// (saveString, getString, saveObject, getObject, remove, clearAll, hasKey, getAllKeys, createStorage, saveWithExpiry, getWithExpiry)

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

console.log('Testing Ex23 - localStorage...\n');

assert(getString('name') === 'John', 'should save and retrieve string');
assert(getString('notfound', 'default') === 'default', 'should return default for non-existent key');
assert(JSON.stringify(getObject('items')) === JSON.stringify(items), 'should handle arrays');
assert(JSON.stringify(getObject('invalid', [])) === JSON.stringify([]), 'should return default for invalid JSON');
assert(getString('toRemove') === null, 'should remove item');
assert(localStorage.length === 0, 'should clear all items');
assert(hasKey('exists') === true, 'should return true for existing key');
assert(hasKey('notfound') === false, 'should return false for non-existing key');
assert(keys.includes('a'), 'should return all keys');
assert(keys.includes('b'), 'should return all keys');
assert(keys.includes('c'), 'should return all keys');
assert(getWithExpiry('temp') === 'data', 'should return value before expiry');
assert(getWithExpiry('temp') === null, 'should return null after expiry');
assert(hasKey('temp') === false, 'should remove expired item');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
