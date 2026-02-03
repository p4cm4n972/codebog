// Note: Functions are expected to be defined by user code
// (delegate, createDelegatedHandler, handleListClicks, setupTableActions, createClickTracker, undelegate)

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

console.log('Testing Ex09 - Event Delegation...\n');

// TODO: manually convert test 'should handle clicks on matching children';
assert(tracker.getCount(firstItem) === 2, 'should track clicks on elements');
assert(tracker.getTotalClicks() === 3, 'should return total clicks');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
