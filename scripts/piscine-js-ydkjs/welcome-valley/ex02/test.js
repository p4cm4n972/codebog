// Note: Functions are expected to be defined by user code
// (stringType, numberType, booleanType, nullAndUndefined, symbolType, bigIntType, allPrimitives)

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

console.log('Testing Ex02 - Primitive Types...\n');

assert(typeof NaN === 'number', 'proves that NaN is of type number');
assert(typeof null === 'object', 'demonstrates the typeof null bug');
assert(result.includes('string'), 'should list all 7 primitive types');
assert(result.includes('number'), 'should list all 7 primitive types');
assert(result.includes('boolean'), 'should list all 7 primitive types');
assert(result.includes('undefined'), 'should list all 7 primitive types');
assert(result.includes('null'), 'should list all 7 primitive types');
assert(result.includes('symbol'), 'should list all 7 primitive types');
assert(result.includes('bigint'), 'should list all 7 primitive types');
assert(result.length === 7, 'should list all 7 primitive types');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
