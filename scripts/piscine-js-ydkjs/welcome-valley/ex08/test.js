// Note: Functions are expected to be defined by user code
// (simpleInterpolation, expressionInterpolation, multilineString, nestedTemplate, conditionalTemplate, objectTemplate)

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

console.log('Testing Ex08 - Template Literals...\n');

assert(simpleInterpolation('Alice', 30) === 'My name is Alice and I am 30 years old.', 'should interpolate name and age');
assert(simpleInterpolation('Bob', 25) === 'My name is Bob and I am 25 years old.', 'should work with different values');
assert(expressionInterpolation(3, 4) === '3 + 4 = 7', 'should evaluate and display expression');
assert(expressionInterpolation(10, 5) === '10 + 5 = 15', 'should work with larger numbers');
assert(multilineString() === 'Line 1\nLine 2\nLine 3', 'should return a 3-line string');
assert(newlineCount === 2, 'should have exactly 2 newlines');
assert(nestedTemplate(['a']) === '<ul>\n  <li>a</li>\n</ul>', 'should generate HTML list for single item');
assert(nestedTemplate(['a', 'b']) === '<ul>\n  <li>a</li>\n  <li>b</li>\n</ul>', 'should generate HTML list for multiple items');
assert(nestedTemplate(['x', 'y', 'z']) === '<ul>\n  <li>x</li>\n  <li>y</li>\n  <li>z</li>\n</ul>', 'should handle three items');
assert(conditionalTemplate(true, 'Alice') === 'Welcome back, Alice!', 'should welcome logged in user');
assert(conditionalTemplate(false, 'Alice') === 'Please log in.', 'should prompt login for non-logged user');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
