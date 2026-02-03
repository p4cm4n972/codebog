// Note: Functions are expected to be defined by user code
// (removeElement, removeAllChildren, removeBySelector, cloneShallow, cloneDeep, cloneWithNewId, replaceElement, moveElement, duplicateElement, wrapElement)

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

console.log('Testing Ex05 - Remove & Clone...\n');

assert(container.children.length === 2, 'should remove element from DOM');
assert(container.children.length === 0, 'should remove all children');
assert(count === 3, 'should remove matching elements');
assert(container.children.length === 0, 'should remove matching elements');
assert(clone.id === 'container', 'should clone without children');
assert(clone.children.length === 0, 'should clone without children');
assert(clone.children.length === 3, 'should clone with children');
assert(clone.id === 'cloned', 'should clone and change ID');
assert(clone.children.length === 3, 'should clone and change ID');
assert(JSON.stringify(container.querySelector('span')) === JSON.stringify(newItem), 'should replace element');
assert(container.children.length === 2, 'should move element to new parent');
assert(newParent.children.length === 1, 'should move element to new parent');
assert(clones.length === 3, 'should create N clones');
assert(clone.className === 'item', 'should create N clones');
assert(JSON.stringify(container.querySelector('.wrapper')) === JSON.stringify(wrapper), 'should wrap element');
assert(JSON.stringify(wrapper.querySelector('.item')) === JSON.stringify(item), 'should wrap element');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
