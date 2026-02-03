// Note: Functions are expected to be defined by user code
// (openDatabase, put, get, getAll, remove, clearStore, createStoreWrapper, deleteDatabase)

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

console.log('Testing Ex25 - IndexedDB...\n');

assert(JSON.stringify(db.name) === JSON.stringify(DB_NAME), 'should open database');
assert(db.objectStoreNames.contains('users') === true, 'should create object stores on upgrade');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
