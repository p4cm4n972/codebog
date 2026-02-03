// Note: Functions are expected to be defined by user code
// (getText, setText, getAttr, setAttr, removeAttr, hasAttr, getData, setData, copyAttributes)

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

console.log('Testing Ex01 - Element Properties...\n');

assert(getText(testDiv) === 'Hello World', 'should return text content');
assert(getText(empty) === '', 'should return empty string for empty element');
assert(testDiv.textContent === 'New Text', 'should set text content');
assert(getAttr(testDiv, 'id') === 'test', 'should get attribute value');
assert(getAttr(testDiv, 'class') === 'box', 'should get attribute value');
assert(getAttr(testDiv, 'nonexistent') === null, 'should return null for missing attribute');
assert(testDiv.getAttribute('title') === 'My Title', 'should set attribute');
assert(testDiv.hasAttribute('class') === false, 'should remove attribute');
assert(hasAttr(testDiv, 'id') === true, 'should return true for existing attribute');
assert(hasAttr(testDiv, 'disabled') === false, 'should return false for missing attribute');
assert(getData(testDiv, 'userId') === '123', 'should get data attribute');
assert(getData(testDiv, 'active') === 'true', 'should get data attribute');
assert(testDiv.dataset.count === '42', 'should set data attribute');
assert(target.id === 'source', 'should copy all attributes');
assert(target.className === 'class1 class2', 'should copy all attributes');
assert(target.getAttribute('data-value') === '100', 'should copy all attributes');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
