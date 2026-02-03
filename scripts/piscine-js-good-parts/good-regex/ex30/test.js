// Note: Functions are expected to be defined by user code
// (extractWords, extractSpecialChars, isOnlyDigits, isAlphabetic, extractVowels, maskDigits, normalizeSpaces, isValidHexColor)

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

console.log('Testing Ex30 - Character Classes...\n');

assert(JSON.stringify(extractWords('Hello, World! 123')) === JSON.stringify(['Hello', 'World', '123']), 'should extract words');
assert(JSON.stringify(extractSpecialChars('Hello, World!')) === JSON.stringify([',', ' ', '!']), 'should extract non-alphanumeric');
assert(isOnlyDigits('12345') === true, 'should validate digit-only strings');
assert(isOnlyDigits('123a45') === false, 'should validate digit-only strings');
assert(isOnlyDigits('') === false, 'should validate digit-only strings');
assert(isAlphabetic('Hello') === true, 'should validate letter-only strings');
assert(isAlphabetic('Hello123') === false, 'should validate letter-only strings');
assert(isAlphabetic('Hello World') === false, 'should validate letter-only strings');
assert(JSON.stringify(extractVowels('Hello World')) === JSON.stringify(['e', 'o', 'o']), 'should extract vowels');
assert(maskDigits('My phone: 123-456-7890') === 'My phone: ###-###-####', 'should replace digits with #');
assert(normalizeSpaces('  hello   world  ') === 'hello world', 'should normalize multiple spaces');
assert(isValidHexColor('#fff') === true, 'should validate hex colors');
assert(isValidHexColor('#FFFFFF') === true, 'should validate hex colors');
assert(isValidHexColor('#abc123') === true, 'should validate hex colors');
assert(isValidHexColor('fff') === false, 'should validate hex colors');
assert(isValidHexColor('#gggggg') === false, 'should validate hex colors');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
