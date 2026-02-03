// Note: Functions are expected to be defined by user code
// (calculateTotalWithTax, canAccessResource, formatPrice, processUsers, calculateStats, validateRegistrationForm)

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

console.log('Testing Ex33 - Clean Code...\n');

assert(calculateTotalWithTax(100, 0.2) === 120, 'should calculate price with tax');
assert(calculateTotalWithTax(50, 0.1) === 55, 'should calculate price with tax');
assert(formatPrice(1999, 'EUR') === '19,99 €', 'should format EUR prices');
assert(formatPrice(1999, 'USD') === '$19.99', 'should format USD prices');
assert(stats.count === 3, 'should calculate all stats');
assert(stats.sum === 60, 'should calculate all stats');
assert(stats.average === 20, 'should calculate all stats');
assert(stats.min === 10, 'should calculate all stats');
assert(stats.max === 30, 'should calculate all stats');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
