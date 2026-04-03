// Note: Functions are expected to be defined by user code
// (createPerson, createBankAccount, createStateMachine, createEventEmitter, createCache)

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

console.log('Testing Factory Functions & Data Privacy...\n');

// Test 1: createPerson - create with getters
const person1 = createPerson('Alice', 30);
assert(person1.getName() === 'Alice', 'createPerson: getName returns name');
assert(person1.getAge() === 30, 'createPerson: getAge returns age');

// Test 2: createPerson - validate on construction
let invalidNameThrown = false;
try {
    createPerson('', 30);
} catch (e) {
    invalidNameThrown = true;
}
assert(invalidNameThrown, 'createPerson: throws on empty name');

let invalidAgeThrown = false;
try {
    createPerson('Alice', -5);
} catch (e) {
    invalidAgeThrown = true;
}
assert(invalidAgeThrown, 'createPerson: throws on negative age');

// Test 3: createPerson - validate setters
const person3 = createPerson('Alice', 30);
let setNameThrown = false;
try {
    person3.setName('');
} catch (e) {
    setNameThrown = true;
}
assert(setNameThrown, 'createPerson: setName throws on empty string');

// Test 4: createPerson - celebrate birthday
const person4 = createPerson('Alice', 30);
person4.celebrateBirthday();
assert(person4.getAge() === 31, 'createPerson: celebrateBirthday increments age');

// Test 5: createPerson - private data
const person5 = createPerson('Alice', 30);
assert(person5._name === undefined, 'createPerson: _name is private');
assert(person5._age === undefined, 'createPerson: _age is private');

// Test 6: createBankAccount - track balance
const account6 = createBankAccount('Alice', 1000);
assert(account6.getBalance() === 1000, 'createBankAccount: initial balance');
account6.deposit(500);
assert(account6.getBalance() === 1500, 'createBankAccount: deposit adds to balance');

// Test 7: createBankAccount - prevent overdraft
const account7 = createBankAccount('Alice', 100);
let overdraftThrown = false;
try {
    account7.withdraw(200);
} catch (e) {
    overdraftThrown = e.message.includes('Insufficient');
}
assert(overdraftThrown, 'createBankAccount: prevents overdraft');

// Test 8: createBankAccount - transfer between accounts
const alice8 = createBankAccount('Alice', 1000);
const bob8 = createBankAccount('Bob', 500);
alice8.transfer(bob8, 300);
assert(alice8.getBalance() === 700, 'createBankAccount: transfer deducts from sender');
assert(bob8.getBalance() === 800, 'createBankAccount: transfer adds to receiver');

// Test 9: createBankAccount - track statement
const account9 = createBankAccount('Alice', 1000);
account9.deposit(100);
account9.withdraw(50);
const statement9 = account9.getStatement();
assert(statement9.length >= 2, 'createBankAccount: tracks statement');

// Test 10: createStateMachine - start at initial state
const trafficLightConfig = {
    initial: 'red',
    states: {
        red: { on: { TIMER: 'green' } },
        green: { on: { TIMER: 'yellow' } },
        yellow: { on: { TIMER: 'red' } }
    }
};
const machine10 = createStateMachine(trafficLightConfig);
assert(machine10.getState() === 'red', 'createStateMachine: starts at initial state');

// Test 11: createStateMachine - transition on valid action
const machine11 = createStateMachine(trafficLightConfig);
machine11.send('TIMER');
assert(machine11.getState() === 'green', 'createStateMachine: transitions on valid action');

// Test 12: createStateMachine - throw on invalid action
const machine12 = createStateMachine(trafficLightConfig);
let invalidActionThrown = false;
try {
    machine12.send('INVALID');
} catch (e) {
    invalidActionThrown = true;
}
assert(invalidActionThrown, 'createStateMachine: throws on invalid action');

// Test 13: createStateMachine - can check
const machine13 = createStateMachine(trafficLightConfig);
assert(machine13.can('TIMER') === true, 'createStateMachine: can returns true for valid action');
assert(machine13.can('INVALID') === false, 'createStateMachine: can returns false for invalid');

// Test 14: createStateMachine - track history
const machine14 = createStateMachine(trafficLightConfig);
machine14.send('TIMER');
machine14.send('TIMER');
const history14 = machine14.getHistory();
assert(history14.length === 3, 'createStateMachine: tracks history');

// Test 15: createEventEmitter - emit events
const emitter15 = createEventEmitter();
let emitted15 = null;
emitter15.on('test', (data) => { emitted15 = data; });
emitter15.emit('test', 'hello');
assert(emitted15 === 'hello', 'createEventEmitter: on/emit works');

// Test 16: createEventEmitter - remove listeners
const emitter16 = createEventEmitter();
let called16 = false;
const handler16 = () => { called16 = true; };
emitter16.on('test', handler16);
emitter16.off('test', handler16);
emitter16.emit('test');
assert(called16 === false, 'createEventEmitter: off removes listener');

// Test 17: createEventEmitter - once
const emitter17 = createEventEmitter();
let onceCount17 = 0;
emitter17.once('test', () => { onceCount17++; });
emitter17.emit('test');
emitter17.emit('test');
assert(onceCount17 === 1, 'createEventEmitter: once fires only once');

// Test 18: createCache - store and retrieve
const cache18 = createCache();
cache18.set('key', 'value');
assert(cache18.get('key') === 'value', 'createCache: set and get work');

// Test 19: createCache - respect maxSize
const cache19 = createCache({ maxSize: 2 });
cache19.set('a', 1);
cache19.set('b', 2);
cache19.set('c', 3);
assert(cache19.has('a') === false, 'createCache: evicts oldest when maxSize exceeded');
assert(cache19.has('b') === true, 'createCache: keeps newer entries');
assert(cache19.has('c') === true, 'createCache: keeps newest entry');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
