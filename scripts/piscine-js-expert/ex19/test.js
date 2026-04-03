// Note: Functions are expected to be defined by user code
// (createPrivateKey, createWithSymbol, getSymbols, getGlobalSymbol, getSymbolKey, makeIterable, createTaggedObject, createCustomInstanceCheck, createConvertible, createCustomSplitter)

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

console.log('Testing Symbols...\n');

// Test 1: createPrivateKey - creates unique symbols
const key1 = createPrivateKey('secret');
const key2 = createPrivateKey('secret');
assert(key1 !== key2, 'createPrivateKey: creates unique symbols');
assert(typeof key1 === 'symbol', 'createPrivateKey: returns symbol');

// Test 2: createPrivateKey - has description
const key3 = createPrivateKey('test');
assert(key3.description === 'test', 'createPrivateKey: has description');

// Test 3: createWithSymbol - creates object with symbol property
const key4 = Symbol('private');
const obj4 = createWithSymbol(key4, 'secret value');
assert(obj4[key4] === 'secret value', 'createWithSymbol: stores value with symbol key');

// Test 4: createWithSymbol - not enumerable with for...in
const key5 = Symbol('hidden');
const obj5 = createWithSymbol(key5, 'value');
const keys5 = [];
for (const k in obj5) keys5.push(k);
assert(!keys5.includes(key5), 'createWithSymbol: not enumerable');

// Test 5: getSymbols - returns all symbol keys
const sym5a = Symbol('a');
const sym5b = Symbol('b');
const obj6 = { [sym5a]: 1, [sym5b]: 2, regular: 3 };
const symbols6 = getSymbols(obj6);
assert(symbols6.includes(sym5a), 'getSymbols: includes sym a');
assert(symbols6.includes(sym5b), 'getSymbols: includes sym b');
assert(symbols6.length === 2, 'getSymbols: length is 2');

// Test 6: getGlobalSymbol - returns same symbol for same key
const sym7a = getGlobalSymbol('app.config');
const sym7b = getGlobalSymbol('app.config');
assert(sym7a === sym7b, 'getGlobalSymbol: same symbol for same key');

// Test 7: getSymbolKey - retrieves key from global symbol
const sym8 = getGlobalSymbol('my.key');
assert(getSymbolKey(sym8) === 'my.key', 'getSymbolKey: returns key');

// Test 8: getSymbolKey - undefined for local symbol
const local8 = Symbol('local');
assert(getSymbolKey(local8) === undefined, 'getSymbolKey: undefined for local symbol');

// Test 9: makeIterable - spread operator works
const obj9 = makeIterable({ a: 1, b: 2, c: 3 });
const spread9 = [...obj9];
assert(JSON.stringify(spread9) === JSON.stringify([1, 2, 3]), 'makeIterable: spread works');

// Test 10: makeIterable - for...of works
const obj10 = makeIterable({ x: 10, y: 20 });
const values10 = [];
for (const v of obj10) values10.push(v);
assert(JSON.stringify(values10) === JSON.stringify([10, 20]), 'makeIterable: for...of works');

// Test 11: createTaggedObject - custom toStringTag
const obj11 = createTaggedObject('MyCustomType');
assert(Object.prototype.toString.call(obj11) === '[object MyCustomType]', 'createTaggedObject: custom tag');

// Test 12: createCustomInstanceCheck - true for matching
const Custom12 = createCustomInstanceCheck();
const obj12a = { isCustom: true };
assert(obj12a instanceof Custom12 === true, 'createCustomInstanceCheck: true for isCustom: true');

// Test 13: createCustomInstanceCheck - false for non-matching
const Custom13 = createCustomInstanceCheck();
const obj13 = { isCustom: false };
assert(obj13 instanceof Custom13 === false, 'createCustomInstanceCheck: false for isCustom: false');

// Test 14: createConvertible - convert to number
const obj14 = createConvertible(42, 'forty-two');
assert(+obj14 === 42, 'createConvertible: +obj is 42');
assert(obj14 * 2 === 84, 'createConvertible: obj * 2 is 84');

// Test 15: createConvertible - convert to string
const obj15 = createConvertible(42, 'forty-two');
assert(`${obj15}` === 'forty-two', 'createConvertible: template literal');

// Test 16: createConvertible - default conversion
const obj16 = createConvertible(42, 'forty-two');
assert(obj16 + '' === 'forty-two', 'createConvertible: default to string');

// Test 17: createCustomSplitter - custom split
const splitter17 = createCustomSplitter('|');
const result17 = 'a|b|c'.split(splitter17);
assert(JSON.stringify(result17) === JSON.stringify(['a', 'b', 'c']), 'createCustomSplitter: splits by |');

// Test 18: createCustomSplitter - different delimiters
const splitter18 = createCustomSplitter('::');
const result18 = 'one::two::three'.split(splitter18);
assert(JSON.stringify(result18) === JSON.stringify(['one', 'two', 'three']), 'createCustomSplitter: splits by ::');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
