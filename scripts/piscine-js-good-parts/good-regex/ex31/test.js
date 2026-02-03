// Note: Functions are expected to be defined by user code
// (parseName, reverseName, parseDate, toISODate, parseUrl, extractHashtags, stripHtmlTags, extractTagContent)

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

console.log('Testing Ex31 - Groups & Capturing...\n');

// TODO: manually convert test 'should extract first and last name';
assert(reverseName('John Doe') === 'Doe, John', 'should reverse name format');
assert(toISODate('25/12/2024') === '2024-12-25', 'should convert to ISO format');
assert(JSON.stringify(extractHashtags('Hello #world, #javascript is #awesome')) === JSON.stringify(['world', 'javascript', 'awesome']), 'should find all hashtags');
assert(stripHtmlTags('<p>Hello <b>World</b></p>') === 'Hello World', 'should remove HTML tags');
assert(JSON.stringify(extractTagContent('<p>First</p><p>Second</p>', 'p')) === JSON.stringify(['First', 'Second']), 'should extract content between tags');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
