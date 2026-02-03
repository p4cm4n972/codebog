// Note: Functions are expected to be defined by user code
// (isValidEmail, isValidFrenchPhone, isStrongPassword, isValidPostalCode, extractEmails, formatPhone, isValidUsername, toSlug)

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

console.log('Testing Ex32 - Practical Patterns...\n');

assert(isValidEmail('user@example.com') === true, 'should validate correct emails');
assert(isValidEmail('john.doe@company.co.uk') === true, 'should validate correct emails');
assert(isValidEmail('invalid') === false, 'should reject invalid emails');
assert(isValidEmail('user@') === false, 'should reject invalid emails');
assert(isValidEmail('@example.com') === false, 'should reject invalid emails');
assert(isValidFrenchPhone('0612345678') === true, 'should validate French phones');
assert(isValidFrenchPhone('+33612345678') === true, 'should validate French phones');
assert(isValidFrenchPhone('123456') === false, 'should reject invalid phones');
assert(isValidFrenchPhone('061234567890') === false, 'should reject invalid phones');
assert(isStrongPassword('Password123') === true, 'should validate strong passwords');
assert(isStrongPassword('MyP@ss1234') === true, 'should validate strong passwords');
assert(isStrongPassword('password') === false, 'should reject weak passwords');
assert(isStrongPassword('Pass1') === false, 'should reject weak passwords');
assert(isValidPostalCode('75001') === true, 'should validate French postal codes');
assert(isValidPostalCode('13100') === true, 'should validate French postal codes');
assert(isValidPostalCode('7500') === false, 'should reject invalid codes');
assert(isValidPostalCode('750001') === false, 'should reject invalid codes');
assert(JSON.stringify(extractEmails(text)) === JSON.stringify([
        'info@example.com',
        'support@company.org'
      ]), 'should extract all emails');
assert(formatPhone('0612345678') === '06 12 34 56 78', 'should format phone number');
assert(isValidUsername('john_doe') === true, 'should validate usernames');
assert(isValidUsername('user123') === true, 'should validate usernames');
assert(isValidUsername('ab') === false, 'should reject invalid usernames');
assert(isValidUsername('user@name') === false, 'should reject invalid usernames');
assert(toSlug('Hello World') === 'hello-world', 'should create valid slug');
assert(toSlug('This is A Test!') === 'this-is-a-test', 'should create valid slug');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
