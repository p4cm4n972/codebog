// Note: Functions are expected to be defined by user code
// (createElement, createElementWithOptions, createListItem, createList, appendTo, prependTo, insertBefore, insertAfter, createFragment, createCard)

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

console.log('Testing Ex02 - Create Elements...\n');

assert(div.tagName === 'DIV', 'should create element with tag');
assert(li.tagName === 'LI', 'should create li with text');
assert(li.textContent === 'Item 1', 'should create li with text');
assert(ul.tagName === 'UL', 'should create ul with items');
assert(ul.children.length === 3, 'should create ul with items');
assert(ul.children[0].textContent === 'A', 'should create ul with items');
assert(JSON.stringify(container.lastChild) === JSON.stringify(child), 'should append child to parent');
assert(JSON.stringify(container.firstChild) === JSON.stringify(child), 'should prepend child to parent');
assert(JSON.stringify(container.firstChild) === JSON.stringify(newEl), 'should insert before reference');
assert(JSON.stringify(container.lastChild) === JSON.stringify(newEl), 'should insert after reference');
assert(fragment instanceof DocumentFragment === true, 'should create fragment with elements');
assert(fragment.childNodes.length === 2, 'should create fragment with elements');
assert(card.className === 'card', 'should create card structure');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
