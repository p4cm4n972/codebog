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

console.log('Testing Types & Variables...\n');

// Test getType
assert(getType(42) === 'number', 'getType: 42 is number');
assert(getType('hello') === 'string', 'getType: "hello" is string');
assert(getType(true) === 'boolean', 'getType: true is boolean');
assert(getType(undefined) === 'undefined', 'getType: undefined is undefined');
assert(getType(null) === 'null', 'getType: null is null (not object!)');
assert(getType([1, 2, 3]) === 'array', 'getType: [1,2,3] is array');
assert(getType({ name: 'Alice' }) === 'object', 'getType: {} is object');

// Test convertToNumber
assert(convertToNumber('42') === 42, 'convertToNumber: "42" -> 42');
assert(convertToNumber('3.14') === 3.14, 'convertToNumber: "3.14" -> 3.14');
assert(convertToNumber(true) === 1, 'convertToNumber: true -> 1');
assert(convertToNumber(false) === 0, 'convertToNumber: false -> 0');
assert(isNaN(convertToNumber('hello')), 'convertToNumber: "hello" -> NaN');
assert(convertToNumber(null) === 0, 'convertToNumber: null -> 0');

// Test isStrictEqual
assert(isStrictEqual(5, 5) === true, 'isStrictEqual: 5 === 5');
assert(isStrictEqual(5, '5') === false, 'isStrictEqual: 5 !== "5"');
assert(isStrictEqual(null, undefined) === false, 'isStrictEqual: null !== undefined');
assert(isStrictEqual(NaN, NaN) === false, 'isStrictEqual: NaN !== NaN (special case)');

// Test isLooseEqual
assert(isLooseEqual(5, 5) === true, 'isLooseEqual: 5 == 5');
assert(isLooseEqual(5, '5') === true, 'isLooseEqual: 5 == "5" (coercion)');
assert(isLooseEqual(null, undefined) === true, 'isLooseEqual: null == undefined');
assert(isLooseEqual(0, false) === true, 'isLooseEqual: 0 == false');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
