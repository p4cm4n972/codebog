// Note: Functions are expected to be defined by user code
// (createSessionStorage, createFormWizard, createSessionCart, sessionCache, saveNavigationState, getNavigationState, createFilterStore, trackPageVisit, getSessionHistory)

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

console.log('Testing Ex24 - sessionStorage...\n');

assert(storage.get('key') === 'value', 'should create namespaced storage');
assert(sessionStorage.getItem('app:key') !== null, 'should create namespaced storage');
assert(history.includes('home'), 'should track unique page visits');
assert(history.includes('products'), 'should track unique page visits');
assert(trackPageVisit('page1') === 1, 'should return visit count');
assert(trackPageVisit('page2') === 2, 'should return visit count');
assert(trackPageVisit('page1') === 2, 'should return visit count');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
