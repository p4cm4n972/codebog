// Note: Functions are expected to be defined by user code
// (getParent, getChildren, getFirstChild, getLastChild, getPrevSibling, getNextSibling, getSiblings, getAncestors, getIndex, getNthChild)

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

console.log('Testing Ex04 - Navigate DOM...\n');

assert(JSON.stringify(getParent(child1)) === JSON.stringify(container), 'should return parent element');
assert(Array.isArray(children) === true, 'should return array of children');
assert(children.length === 3, 'should return array of children');
assert(JSON.stringify(getFirstChild(container)) === JSON.stringify(child1), 'should return first child');
assert(JSON.stringify(getLastChild(container)) === JSON.stringify(child3), 'should return last child');
assert(JSON.stringify(getPrevSibling(child2)) === JSON.stringify(child1), 'should return previous sibling');
assert(getPrevSibling(child1) === null, 'should return null for first child');
assert(JSON.stringify(getNextSibling(child2)) === JSON.stringify(child3), 'should return next sibling');
assert(getNextSibling(child3) === null, 'should return null for last child');
assert(siblings.includes(child1), 'should return all siblings except self');
assert(siblings.includes(child3), 'should return all siblings except self');
assert(!siblings.includes(child2), 'should return all siblings except self');
assert(JSON.stringify(ancestors[0]) === JSON.stringify(container), 'should return all ancestors');
assert(getIndex(child1) === 0, 'should return element index');
assert(getIndex(child2) === 1, 'should return element index');
assert(getIndex(child3) === 2, 'should return element index');
assert(JSON.stringify(getNthChild(container, 0)) === JSON.stringify(child1), 'should return nth child');
assert(JSON.stringify(getNthChild(container, 1)) === JSON.stringify(child2), 'should return nth child');
assert(getNthChild(container, 10) === null, 'should return null for invalid index');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
