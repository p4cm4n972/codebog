// Note: Functions are expected to be defined by user code

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

console.log('Testing Operators...\n');

// Test calculate
assert(calculate(5, 3, '+') === 8, 'calculate: 5 + 3 = 8');
assert(calculate(10, 4, '-') === 6, 'calculate: 10 - 4 = 6');
assert(calculate(6, 7, '*') === 42, 'calculate: 6 * 7 = 42');
assert(calculate(15, 3, '/') === 5, 'calculate: 15 / 3 = 5');
assert(calculate(17, 5, '%') === 2, 'calculate: 17 % 5 = 2');
assert(calculate(2, 3, '**') === 8, 'calculate: 2 ** 3 = 8');

// Test isInRange
assert(isInRange(5, 1, 10) === true, 'isInRange: 5 in [1,10]');
assert(isInRange(1, 1, 10) === true, 'isInRange: 1 in [1,10] (boundary)');
assert(isInRange(10, 1, 10) === true, 'isInRange: 10 in [1,10] (boundary)');
assert(isInRange(0, 1, 10) === false, 'isInRange: 0 not in [1,10]');
assert(isInRange(11, 1, 10) === false, 'isInRange: 11 not in [1,10]');

// Test getMax
assert(getMax(5, 3) === 5, 'getMax: max(5, 3) = 5');
assert(getMax(-1, -10) === -1, 'getMax: max(-1, -10) = -1');
assert(getMax(7, 7) === 7, 'getMax: max(7, 7) = 7');

// Test nullishDefault
assert(nullishDefault(42, 0) === 42, 'nullishDefault: 42 ?? 0 = 42');
assert(nullishDefault(null, 0) === 0, 'nullishDefault: null ?? 0 = 0');
assert(nullishDefault(undefined, 0) === 0, 'nullishDefault: undefined ?? 0 = 0');
assert(nullishDefault(0, 10) === 0, 'nullishDefault: 0 ?? 10 = 0 (not 10!)');
assert(nullishDefault('', 'default') === '', 'nullishDefault: "" ?? "default" = ""');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
