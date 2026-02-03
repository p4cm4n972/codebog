// Note: Functions are expected to be defined by user code
// (reverseString, isPalindrome, countVowels, capitalizeWords, truncate)

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.log(`❌ ${name}`);
        console.error(error.message);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

console.log('\n🧪 Testing ex06 - Strings\n');

test('reverseString: should reverse a string', () => {
    assert(reverseString('hello') === 'olleh', 'Expected "olleh"');
    assert(reverseString('abc') === 'cba', 'Expected "cba"');
    assert(reverseString('') === '', 'Expected empty string');
});

test('isPalindrome: should detect palindromes', () => {
    assert(isPalindrome('racecar') === true, 'Expected true for "racecar"');
    assert(isPalindrome('Racecar') === true, 'Expected true for "Racecar" (case insensitive)');
    assert(isPalindrome('hello') === false, 'Expected false for "hello"');
    assert(isPalindrome('a') === true, 'Expected true for single char');
});

test('countVowels: should count vowels', () => {
    assert(countVowels('hello world') === 3, 'Expected 3 vowels');
    assert(countVowels('aeiou') === 5, 'Expected 5 vowels');
    assert(countVowels('xyz') === 0, 'Expected 0 vowels');
    assert(countVowels('HELLO') === 2, 'Expected 2 vowels (case insensitive)');
});

test('capitalizeWords: should capitalize first letter of each word', () => {
    assert(capitalizeWords('hello world') === 'Hello World', 'Expected "Hello World"');
    assert(capitalizeWords('javascript is fun') === 'Javascript Is Fun', 'Expected all words capitalized');
    assert(capitalizeWords('a') === 'A', 'Expected "A"');
});

test('truncate: should truncate long strings', () => {
    assert(truncate('hello world', 8) === 'hello...', 'Expected truncated with ...');
    assert(truncate('hello', 10) === 'hello', 'Expected no truncation');
    assert(truncate('hello world', 5) === 'he...', 'Expected truncated at 5');
});

console.log('\n✨ Tests completed!\n');
