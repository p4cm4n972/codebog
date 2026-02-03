// Note: Functions are expected to be defined by user code
// (generateId, createTodoStore, createTodoElement, filterTodos, countActive)

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

console.log('Testing Ex32 - Todo List...\n');

assert(id1 !== id2, 'should generate unique IDs');
assert(typeof generateId() === 'string', 'should return a string');
assert(JSON.stringify(state.todos) === JSON.stringify([]), 'should create store with empty state');
assert(state.filter === 'all', 'should create store with empty state');
assert(state.todos.length === 1, 'should add todo');
assert(state.todos[0].text === 'Test task', 'should add todo');
assert(state.todos[0].completed === false, 'should add todo');
assert(countActive([]) === 0, 'should return 0 for empty array');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
