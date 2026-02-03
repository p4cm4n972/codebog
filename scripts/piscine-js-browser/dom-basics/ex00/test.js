// Note: Functions are expected to be defined by user code
// (getById, selectOne, selectAll, selectWithin, matches, findClosest, countElements)

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

console.log('Testing Ex00 - Selectors...\n');

assert(app.id === 'app', 'should find element by ID');
assert(app !== null, 'should find element by ID');
assert(getById('nonexistent') === null, 'should return null for non-existent ID');
assert(item.textContent === 'Item 1', 'should find first matching element');
assert(active.dataset.id === '3', 'should work with complex selectors');
assert(Array.isArray(items) === true, 'should return array of elements');
assert(items.length === 3, 'should return array of elements');
assert(JSON.stringify(items) === JSON.stringify([]), 'should return empty array if none found');
assert(item !== null, 'should find within context');
assert(item === null, 'should not find outside context');
assert(matches(item, '.active') === true, 'should return true for matching selector');
assert(matches(item, '.item') === true, 'should return true for matching selector');
assert(matches(item, '.header') === false, 'should return false for non-matching');
assert(list.tagName === 'UL', 'should find closest ancestor');
assert(findClosest(item, '.nonexistent') === null, 'should return null if not found');
assert(countElements('.item') === 3, 'should count matching elements');
assert(countElements('.active') === 1, 'should count matching elements');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
