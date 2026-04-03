// Note: Functions are expected to be defined by user code
// (inherit, Animal, Dog, Labrador, getPrototypeChain, deepClone, mixin, createObject)

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

console.log('Testing Prototype Chain & Inheritance...\n');

// Test 1: inherit - establish prototype chain
function Parent() {}
Parent.prototype.parentMethod = function() { return 'parent'; };
function Child() {}
inherit(Child, Parent);
const child1 = new Child();
assert(child1.parentMethod() === 'parent', 'inherit: child has parent method');

// Test 2: inherit - preserve constructor
function Parent2() {}
function Child2() {}
inherit(Child2, Parent2);
assert(Child2.prototype.constructor === Child2, 'inherit: preserves constructor');

// Test 3: Animal -> Dog hierarchy - Dog with Animal methods
const rex = new Dog('Rex', 'German Shepherd');
assert(rex.name === 'Rex', 'Dog: has name property');
assert(rex.breed === 'German Shepherd', 'Dog: has breed property');
assert(rex.eat('kibble').includes('eats'), 'Dog: inherits eat from Animal');

// Test 4: Dog overrides speak
assert(rex.speak().includes('Woof'), 'Dog: speak contains Woof');

// Test 5: Dog has fetch method
assert(rex.fetch().includes('fetch'), 'Dog: has fetch method');

// Test 6: Labrador with all inherited methods
const buddy = new Labrador('Buddy', 'golden');
assert(buddy.name === 'Buddy', 'Labrador: has name');
assert(buddy.color === 'golden', 'Labrador: has color');
assert(buddy.breed === 'Labrador', 'Labrador: breed is Labrador');
assert(buddy.eat('treats').includes('eats'), 'Labrador: inherits eat');
assert(buddy.speak().includes('Woof'), 'Labrador: inherits speak');

// Test 7: Labrador has swim method
assert(buddy.swim().includes('swim'), 'Labrador: has swim method');

// Test 8: instanceof checks
assert(buddy instanceof Labrador, 'Labrador: instanceof Labrador');
assert(buddy instanceof Dog, 'Labrador: instanceof Dog');
assert(buddy instanceof Animal, 'Labrador: instanceof Animal');
assert(buddy instanceof Object, 'Labrador: instanceof Object');

// Test 9: getPrototypeChain - ends with null
const obj9 = { a: 1 };
const chain9 = getPrototypeChain(obj9);
assert(chain9[chain9.length - 1] === null, 'getPrototypeChain: ends with null');
assert(chain9.includes(Object.prototype), 'getPrototypeChain: includes Object.prototype');

// Test 10: getPrototypeChain - full chain for Labrador
const chain10 = getPrototypeChain(buddy);
assert(chain10.includes(Labrador.prototype), 'getPrototypeChain: includes Labrador.prototype');
assert(chain10.includes(Dog.prototype), 'getPrototypeChain: includes Dog.prototype');
assert(chain10.includes(Animal.prototype), 'getPrototypeChain: includes Animal.prototype');

// Test 11: deepClone - simple objects
const original11 = { a: 1, b: { c: 2 } };
const cloned11 = deepClone(original11);
assert(cloned11.a === 1 && cloned11.b.c === 2, 'deepClone: copies values');
assert(cloned11 !== original11, 'deepClone: creates new object');
assert(cloned11.b !== original11.b, 'deepClone: clones nested objects');

// Test 12: deepClone - preserves prototype
const originalDog = new Dog('Max', 'Poodle');
const clonedDog = deepClone(originalDog);
assert(clonedDog instanceof Dog, 'deepClone: preserves prototype');
assert(clonedDog.speak().includes('Woof'), 'deepClone: cloned methods work');

// Test 13: deepClone - handles arrays
const original13 = { arr: [1, 2, { nested: true }] };
const cloned13 = deepClone(original13);
cloned13.arr[2].nested = false;
assert(original13.arr[2].nested === true, 'deepClone: array mutations are independent');

// Test 14: mixin - copies methods
const target14 = {};
const source1 = { method1: () => 'one' };
const source2 = { method2: () => 'two' };
mixin(target14, source1, source2);
assert(target14.method1() === 'one', 'mixin: copies method1');
assert(target14.method2() === 'two', 'mixin: copies method2');

// Test 15: mixin - works with prototypes
const canSwim = { swim: function() { return `${this.name} swims`; } };
const canFly = { fly: function() { return `${this.name} flies`; } };
function Duck(name) { this.name = name; }
mixin(Duck.prototype, canSwim, canFly);
const donald = new Duck('Donald');
assert(donald.swim() === 'Donald swims', 'mixin: prototype swim works');
assert(donald.fly() === 'Donald flies', 'mixin: prototype fly works');

// Test 16: createObject - with specified prototype
const proto16 = { greet: function() { return `Hello, ${this.name}`; } };
const obj16 = createObject(proto16, { name: 'John' });
assert(obj16.greet() === 'Hello, John', 'createObject: greet works');
assert(Object.getPrototypeOf(obj16) === proto16, 'createObject: correct prototype');

// Test 17: createObject - own properties
const proto17 = { shared: true };
const obj17 = createObject(proto17, { own: 'value' });
assert(obj17.hasOwnProperty('own') === true, 'createObject: has own property');
assert(obj17.hasOwnProperty('shared') === false, 'createObject: shared is not own');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
