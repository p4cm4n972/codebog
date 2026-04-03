// Note: Functions are expected to be defined by user code
// (createValidator, createObservable, createReadOnly, createNegativeArray, createPrivate, createCached, withVirtualProperties, createAutoVivifying)

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

console.log('Testing Proxy & Reflect...\n');

// Test 1: createValidator - accept valid values
const schema1 = { age: (val) => typeof val === 'number' && val >= 0 };
const user1 = createValidator({}, schema1);
user1.age = 25;
assert(user1.age === 25, 'createValidator: accepts valid number');

// Test 2: createValidator - reject invalid values
const schema2 = { age: (val) => typeof val === 'number' && val >= 0 };
const user2 = createValidator({}, schema2);
let rejected2 = false;
try {
    user2.age = -5;
} catch (e) {
    rejected2 = true;
}
assert(rejected2, 'createValidator: rejects negative age');

// Test 3: createValidator - allow properties without rules
const schema3 = { age: (val) => typeof val === 'number' };
const user3 = createValidator({}, schema3);
user3.name = 'Alice';
assert(user3.name === 'Alice', 'createValidator: allows unvalidated properties');

// Test 4: createObservable - notify on set
let notified4 = false;
let newVal4, oldVal4, key4;
const state4 = createObservable({ count: 0 }, (k, nv, ov) => {
    notified4 = true;
    key4 = k;
    newVal4 = nv;
    oldVal4 = ov;
});
state4.count = 1;
assert(notified4 && key4 === 'count' && newVal4 === 1 && oldVal4 === 0, 'createObservable: notifies on set');

// Test 5: createReadOnly - allow reading
const config5 = createReadOnly({ apiUrl: 'https://api.com' });
assert(config5.apiUrl === 'https://api.com', 'createReadOnly: allows reading');

// Test 6: createReadOnly - prevent modification
const config6 = createReadOnly({ value: 1 });
let modThrown = false;
try {
    config6.value = 2;
} catch (e) {
    modThrown = true;
}
assert(modThrown, 'createReadOnly: prevents modification');

// Test 7: createReadOnly - prevent deletion
const config7 = createReadOnly({ value: 1 });
let delThrown = false;
try {
    delete config7.value;
} catch (e) {
    delThrown = true;
}
assert(delThrown, 'createReadOnly: prevents deletion');

// Test 8: createNegativeArray - positive indices
const arr8 = createNegativeArray([1, 2, 3, 4, 5]);
assert(arr8[0] === 1, 'createNegativeArray: positive index 0');
assert(arr8[2] === 3, 'createNegativeArray: positive index 2');

// Test 9: createNegativeArray - negative indices
const arr9 = createNegativeArray([1, 2, 3, 4, 5]);
assert(arr9[-1] === 5, 'createNegativeArray: -1 is last element');
assert(arr9[-2] === 4, 'createNegativeArray: -2 is second to last');
assert(arr9[-5] === 1, 'createNegativeArray: -5 is first element');

// Test 10: createNegativeArray - set with negative index
const arr10 = createNegativeArray([1, 2, 3]);
arr10[-1] = 10;
assert(arr10[2] === 10, 'createNegativeArray: set with negative index');

// Test 11: createNegativeArray - preserve methods
const arr11 = createNegativeArray([1, 2, 3]);
arr11.push(4);
assert(arr11[-1] === 4, 'createNegativeArray: push works with negative access');

// Test 12: createPrivate - hide _ properties
const user12 = createPrivate({ name: 'Alice', _password: 'secret' });
assert(user12.name === 'Alice', 'createPrivate: allows public access');
let privateThrown = false;
try {
    const _ = user12._password;
} catch (e) {
    privateThrown = true;
}
assert(privateThrown, 'createPrivate: blocks private access');

// Test 13: createPrivate - hide from in operator
const user13 = createPrivate({ name: 'Alice', _secret: 'hidden' });
assert('name' in user13 === true, 'createPrivate: name in user is true');
assert('_secret' in user13 === false, 'createPrivate: _secret in user is false');

// Test 14: createPrivate - hide from Object.keys
const user14 = createPrivate({ name: 'Alice', _secret: 'hidden' });
const keys14 = Object.keys(user14);
assert(keys14.includes('name') && !keys14.includes('_secret'), 'createPrivate: Object.keys hides private');

// Test 15: createCached - cache results
let callCount15 = 0;
const fn15 = (n) => { callCount15++; return n * 2; };
const cached15 = createCached(fn15);
cached15(5);
cached15(5);
assert(callCount15 === 1, 'createCached: caches results');
assert(cached15(5) === 10, 'createCached: returns correct value');

// Test 16: createCached - different args cached separately
let callCount16 = 0;
const fn16 = (n) => { callCount16++; return n * 2; };
const cached16 = createCached(fn16);
cached16(5);
cached16(10);
cached16(5);
assert(callCount16 === 2, 'createCached: different args cached separately');

// Test 17: withVirtualProperties - computed properties
const person17 = withVirtualProperties(
    { firstName: 'John', lastName: 'Doe' },
    { fullName() { return `${this.firstName} ${this.lastName}`; } }
);
assert(person17.fullName === 'John Doe', 'withVirtualProperties: computed property works');

// Test 18: createAutoVivifying - auto-create nested
const data18 = createAutoVivifying();
data18.user.profile.settings.theme = 'dark';
assert(data18.user.profile.settings.theme === 'dark', 'createAutoVivifying: creates nested path');

// Test 19: createAutoVivifying - deep nesting
const data19 = createAutoVivifying();
data19.a.b.c.d.e.f = 'deep';
assert(data19.a.b.c.d.e.f === 'deep', 'createAutoVivifying: deep nesting works');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
