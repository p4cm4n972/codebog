// Note: Functions are expected to be defined by user code
// (containsWord, countMatches, extractNumbers, replaceAll, toTitleCase, censor, splitBySpaces)

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

console.log('Testing Ex29 - Regex Basics...\n');

assert(containsWord('Hello World', 'hello') === true, 'should find word case insensitive');
assert(containsWord('Hello World', 'bye') === false, 'should find word case insensitive');
assert(countMatches('abracadabra', 'a') === 5, 'should count pattern occurrences');
assert(countMatches('hello world', 'o') === 2, 'should count pattern occurrences');
assert(JSON.stringify(extractNumbers('I have 2 dogs and 3 cats')) === JSON.stringify([2, 3]), 'should extract all numbers');
assert(JSON.stringify(extractNumbers('Price: $199.99')) === JSON.stringify([199, 99]), 'should handle multi-digit numbers');
assert(replaceAll('Hello hello HELLO', 'hello', 'hi') === 'hi hi hi', 'should replace all occurrences');
assert(toTitleCase('hello world') === 'Hello World', 'should capitalize first letters');
assert(toTitleCase('jOHN dOE') === 'JOHN DOE', 'should capitalize first letters');
assert(censor('This is bad and bad again', 'bad') === 'This is *** and *** again', 'should replace word with stars');
assert(JSON.stringify(splitBySpaces('hello   world  test')) === JSON.stringify(['hello', 'world', 'test']), 'should split by multiple spaces');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
