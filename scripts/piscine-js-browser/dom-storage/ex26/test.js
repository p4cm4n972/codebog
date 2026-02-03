// Note: Functions are expected to be defined by user code
// (getCookie, setCookie, deleteCookie, getAllCookies, createStorage, detectStorageSupport, getLocalStorageSize, createStorageWithFallback, syncAcrossTabs, createVersionedStorage)

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

console.log('Testing Ex26 - Cookies & Storage Patterns...\n');

assert(getCookie('username') === 'John', 'should set and get cookie');
assert(getCookie('notfound') === null, 'should return null for non-existent cookie');
assert(getCookie('toDelete') === null, 'should delete cookie');
assert(cookies.a === '1', 'should return all cookies as object');
assert(cookies.b === '2', 'should return all cookies as object');
assert(storage.get('key') === 'value', 'should create sessionStorage wrapper');
assert(storage.get('key') === 'value', 'should create memory storage');
assert(localStorage.getItem('key') === null, 'should create memory storage');
assert(support.hasOwnProperty('localStorage'), 'should detect available storage types');
assert(support.hasOwnProperty('sessionStorage'), 'should detect available storage types');
assert(support.hasOwnProperty('indexedDB'), 'should detect available storage types');
assert(support.hasOwnProperty('cookies'), 'should detect available storage types');
assert(size > 1000, 'should calculate storage size');
assert(storage.get('key') === 'value', 'should use first available storage');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
