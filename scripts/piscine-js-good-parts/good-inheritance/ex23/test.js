// Note: Functions are expected to be defined by user code
// (Shape, Rectangle, Circle, Counter, Stack, EventEmitter, ObservableList)

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

console.log('Testing Ex23 - Class Syntax...\n');

assert(shape.describe() === 'A polygon', 'should describe itself');
assert(rect instanceof Shape === true, 'should extend Shape');
assert(rect.describe() === 'A rectangle', 'should extend Shape');
assert(rect.area() === 50, 'should calculate area and perimeter');
assert(rect.perimeter() === 30, 'should calculate area and perimeter');
assert(circle.radius === 5, 'should have getters');
assert(circle.diameter === 10, 'should have getters');
assert(JSON.stringify(Counter.instances) === JSON.stringify(initial + 2), 'should count instances');
assert(counter.value === 10, 'should have factory method');
assert(counter.increment() === 11, 'should have factory method');
assert(stack.size === 3, 'should implement LIFO');
assert(stack.peek() === 3, 'should implement LIFO');
assert(stack.pop() === 3, 'should implement LIFO');
assert(stack.pop() === 2, 'should implement LIFO');
assert(stack.size === 1, 'should implement LIFO');
assert(stack.isEmpty() === true, 'should report empty');
assert(stack.isEmpty() === false, 'should report empty');
assert(JSON.stringify(items) === JSON.stringify([1, 2, 3]), 'should be iterable');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
