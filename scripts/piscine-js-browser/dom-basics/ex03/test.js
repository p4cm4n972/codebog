// Note: Functions are expected to be defined by user code
// (addClass, removeClass, toggleClass, hasClass, setStyle, setStyles, getComputedStyleValue, hide, show, getDimensions)

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

console.log('Testing Ex03 - Modify Elements...\n');

assert(testDiv.classList.contains('active') === true, 'should add class');
assert(testDiv.classList.contains('hidden') === false, 'should remove class');
assert(result === true, 'should toggle class on');
assert(testDiv.classList.contains('active') === true, 'should toggle class on');
assert(result === false, 'should toggle class off');
assert(testDiv.classList.contains('active') === false, 'should toggle class off');
assert(hasClass(testDiv, 'box') === true, 'should return true if class exists');
assert(hasClass(testDiv, 'nonexistent') === false, 'should return false if class missing');
assert(testDiv.style.color === 'red', 'should set style property');
assert(value === 'block', 'should get computed style');
assert(testDiv.style.display === 'none', 'should hide element');
assert(testDiv.style.display === 'block', 'should show element with default display');
assert(testDiv.style.display === 'flex', 'should show with custom display');
assert(dims.hasOwnProperty('width'), 'should return width and height');
assert(dims.hasOwnProperty('height'), 'should return width and height');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
