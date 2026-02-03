// Note: Functions are expected to be defined by user code
// (mergeArrays, cloneObject, addProperty, removeProperty, getFirstAndRest)

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

function arrayEquals(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

function objectEquals(a, b) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    return keysA.length === keysB.length && keysA.every(key => a[key] === b[key]);
}

console.log('\n🧪 Testing ex08 - Spread & Rest\n');

test('mergeArrays: should merge multiple arrays', () => {
    const result = mergeArrays([1, 2], [3, 4], [5, 6]);
    assert(arrayEquals(result, [1, 2, 3, 4, 5, 6]), 'Expected merged array');
});

test('mergeArrays: should handle single array', () => {
    const result = mergeArrays([1, 2, 3]);
    assert(arrayEquals(result, [1, 2, 3]), 'Expected same array');
});

test('cloneObject: should create a shallow copy', () => {
    const original = {a: 1, b: 2};
    const cloned = cloneObject(original);
    assert(objectEquals(cloned, original), 'Expected same properties');
    assert(cloned !== original, 'Expected different object reference');
});

test('addProperty: should add property immutably', () => {
    const original = {a: 1};
    const result = addProperty(original, 'b', 2);
    assert(objectEquals(result, {a: 1, b: 2}), 'Expected property added');
    assert(!original.hasOwnProperty('b'), 'Original should not be modified');
});

test('removeProperty: should remove property immutably', () => {
    const original = {a: 1, b: 2, c: 3};
    const result = removeProperty(original, 'b');
    assert(objectEquals(result, {a: 1, c: 3}), 'Expected property removed');
    assert(original.hasOwnProperty('b'), 'Original should not be modified');
});

test('getFirstAndRest: should extract first and rest', () => {
    const result = getFirstAndRest([1, 2, 3, 4]);
    assert(result.first === 1, 'Expected first = 1');
    assert(arrayEquals(result.rest, [2, 3, 4]), 'Expected rest = [2, 3, 4]');
});

test('getFirstAndRest: should handle single element', () => {
    const result = getFirstAndRest([42]);
    assert(result.first === 42, 'Expected first = 42');
    assert(arrayEquals(result.rest, []), 'Expected empty rest');
});

console.log('\n✨ Tests completed!\n');
