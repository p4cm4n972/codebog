// Note: Functions are expected to be defined by user code
// (generateId, validateTodo, createTodo, toggleTodo, updateTodo, filterTodos, searchTodos, calculateStats, createTodoManager)

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

console.log('Testing Ex37 - Final Project...\n');

assert(id1 !== id2, 'should generate unique IDs');
assert(filterTodos(todos, 'active').length === 2, 'should filter active');
assert(filterTodos(todos, 'completed').length === 1, 'should filter completed');
assert(filterTodos(todos, 'all').length === 3, 'should return all');
assert(searchTodos(todos, 'learn').length === 2, 'should search case insensitive');
assert(searchTodos(todos, 'LEARN').length === 2, 'should search case insensitive');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
