// Note: Functions are expected to be defined by user code
// (assert, assertDefined, assertType, createConfig, createPerson, safeGet, clamp, sanitize)

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

console.log('Testing Ex35 - Defensive Programming...\n');

// TODO: manually convert test 'should pass for true condition';
assert(assertDefined('hello', 'test') === 'hello', 'should return value if defined');
assert(assertDefined(0, 'test') === 0, 'should return value if defined');

try {
    assertDefined(null, 'value');
    assert(false, 'should throw for null/undefined - should throw');
} catch (e) {
    assert(true, 'should throw for null/undefined');
};

try {
    assertDefined(undefined, 'value');
    assert(false, 'should throw for null/undefined - should throw');
} catch (e) {
    assert(true, 'should throw for null/undefined');
};
assert(assertType('hello', 'string') === 'hello', 'should return value of correct type');
assert(assertType(42, 'number') === 42, 'should return value of correct type');

try {
    assertType('hello', 'number');
    assert(false, 'should throw for wrong type - should throw');
} catch (e) {
    assert(true, 'should throw for wrong type');
};
assert(person.name === 'Alice', 'should create valid person');
assert(person.age === 30, 'should create valid person');

try {
    createPerson('', 30);
    assert(false, 'should reject invalid name - should throw');
} catch (e) {
    assert(true, 'should reject invalid name');
};

try {
    createPerson(123, 30);
    assert(false, 'should reject invalid name - should throw');
} catch (e) {
    assert(true, 'should reject invalid name');
};

try {
    createPerson('Alice', -1);
    assert(false, 'should reject invalid age - should throw');
} catch (e) {
    assert(true, 'should reject invalid age');
};

try {
    createPerson('Alice', 200);
    assert(false, 'should reject invalid age - should throw');
} catch (e) {
    assert(true, 'should reject invalid age');
};
assert(safeGet(null, 'a.b', 'default') === 'default', 'should handle null object');
assert(clamp(5, 0, 10) === 5, 'should return value within range');
assert(clamp(-5, 0, 10) === 0, 'should clamp to min');
assert(clamp(15, 0, 10) === 10, 'should clamp to max');
assert(sanitize('Hello World') === 'Hello World', 'should handle normal text');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
