// Note: Functions are expected to be defined by user code
// (Person, Rectangle, BankAccount, EventEmitter, LinkedList)

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

console.log('Testing ES6+ Classes & Private Fields...\n');

// Test 1: Person - create with name and age
const alice = new Person('Alice', 30);
assert(alice.name === 'Alice', 'Person: name is Alice');
assert(alice.age === 30, 'Person: age is 30');

// Test 2: Person - unique id
const p1 = new Person('A', 20);
const p2 = new Person('B', 25);
assert(p1.id !== p2.id, 'Person: unique ids');

// Test 3: Person - validate name
let nameThrown = false;
try {
    const person = new Person('Alice', 30);
    person.name = '';
} catch (e) {
    nameThrown = true;
}
assert(nameThrown, 'Person: throws on empty name');

// Test 4: Person - validate age
const personAge = new Person('Alice', 30);
let negAgeThrown = false;
try {
    personAge.age = -5;
} catch (e) {
    negAgeThrown = true;
}
assert(negAgeThrown, 'Person: throws on negative age');

let highAgeThrown = false;
try {
    personAge.age = 200;
} catch (e) {
    highAgeThrown = true;
}
assert(highAgeThrown, 'Person: throws on age > 150');

// Test 5: Person - celebrate birthday
const person5 = new Person('Alice', 30);
person5.celebrateBirthday();
assert(person5.age === 31, 'Person: celebrateBirthday increments age');

// Test 6: Person - greet
const person6 = new Person('Alice', 30);
assert(person6.greet().includes('Alice'), 'Person: greet contains name');

// Test 7: Person - createAnonymous
const anon = Person.createAnonymous();
assert(anon.name === 'Anonymous', 'Person: createAnonymous creates Anonymous');

// Test 8: Person - totalCreated
const before = Person.totalCreated;
new Person('Test', 20);
assert(Person.totalCreated === before + 1, 'Person: totalCreated increments');

// Test 9: Rectangle - calculate area
const rect9 = new Rectangle(4, 5);
assert(rect9.area === 20, 'Rectangle: area is 20');

// Test 10: Rectangle - calculate perimeter
const rect10 = new Rectangle(4, 5);
assert(rect10.perimeter === 18, 'Rectangle: perimeter is 18');

// Test 11: Rectangle - detect square
const rectNotSquare = new Rectangle(4, 5);
const square = new Rectangle(5, 5);
assert(rectNotSquare.isSquare === false, 'Rectangle: 4x5 is not square');
assert(square.isSquare === true, 'Rectangle: 5x5 is square');

// Test 12: Rectangle - fromSquare
const squareFrom = Rectangle.fromSquare(5);
assert(squareFrom.width === 5, 'Rectangle.fromSquare: width is 5');
assert(squareFrom.height === 5, 'Rectangle.fromSquare: height is 5');
assert(squareFrom.isSquare === true, 'Rectangle.fromSquare: is square');

// Test 13: Rectangle - scale
const rectScale = new Rectangle(2, 3);
const scaled = rectScale.scale(2);
assert(scaled.width === 4, 'Rectangle.scale: width doubled');
assert(scaled.height === 6, 'Rectangle.scale: height doubled');

// Test 14: Rectangle - toString
const rect14 = new Rectangle(4, 5);
const str14 = rect14.toString();
assert(str14.includes('4') && str14.includes('5'), 'Rectangle: toString contains dimensions');

// Test 15: BankAccount - track balance
const account15 = new BankAccount('Alice', 1000);
assert(account15.balance === 1000, 'BankAccount: initial balance 1000');
account15.deposit(500);
assert(account15.balance === 1500, 'BankAccount: after deposit 1500');

// Test 16: BankAccount - prevent direct modification
const account16 = new BankAccount('Alice', 1000);
let directModThrown = false;
try {
    account16.balance = 9999;
} catch (e) {
    directModThrown = true;
}
assert(directModThrown, 'BankAccount: prevents direct balance modification');

// Test 17: BankAccount - withdraw
const account17 = new BankAccount('Alice', 1000);
account17.withdraw(300);
assert(account17.balance === 700, 'BankAccount: withdraw works');

// Test 18: BankAccount - prevent overdraft
const account18 = new BankAccount('Alice', 100);
let overdraftThrown = false;
try {
    account18.withdraw(200);
} catch (e) {
    overdraftThrown = e.message.includes('Insufficient');
}
assert(overdraftThrown, 'BankAccount: prevents overdraft');

// Test 19: BankAccount - transfer
const alice19 = new BankAccount('Alice', 1000);
const bob19 = new BankAccount('Bob', 500);
alice19.transfer(bob19, 300);
assert(alice19.balance === 700, 'BankAccount: transfer deducts from sender');
assert(bob19.balance === 800, 'BankAccount: transfer adds to receiver');

// Test 20: BankAccount - transaction history
const account20 = new BankAccount('Alice', 1000);
account20.deposit(100);
account20.withdraw(50);
const history20 = account20.transactionHistory;
assert(history20.length >= 2, 'BankAccount: tracks transaction history');

// Test 21: EventEmitter - register and emit
const emitter21 = new EventEmitter();
let emitReceived = null;
emitter21.on('test', (arg1, arg2) => { emitReceived = [arg1, arg2]; });
emitter21.emit('test', 'arg1', 'arg2');
assert(emitReceived && emitReceived[0] === 'arg1' && emitReceived[1] === 'arg2', 'EventEmitter: on/emit works');

// Test 22: EventEmitter - remove listeners
const emitter22 = new EventEmitter();
let called22 = false;
const handler22 = () => { called22 = true; };
emitter22.on('test', handler22);
emitter22.off('test', handler22);
emitter22.emit('test');
assert(called22 === false, 'EventEmitter: off removes listener');

// Test 23: EventEmitter - once
const emitter23 = new EventEmitter();
let onceCount = 0;
emitter23.once('test', () => { onceCount++; });
emitter23.emit('test');
emitter23.emit('test');
assert(onceCount === 1, 'EventEmitter: once fires only once');

// Test 24: EventEmitter - listenerCount
const emitter24 = new EventEmitter();
emitter24.on('test', () => {});
emitter24.on('test', () => {});
assert(emitter24.listenerCount('test') === 2, 'EventEmitter: listenerCount is 2');

// Test 25: EventEmitter - removeAllListeners
const emitter25 = new EventEmitter();
emitter25.on('test', () => {});
emitter25.on('test', () => {});
emitter25.removeAllListeners('test');
assert(emitter25.listenerCount('test') === 0, 'EventEmitter: removeAllListeners works');

// Test 26: EventEmitter - method chaining
const emitter26 = new EventEmitter();
const result26 = emitter26.on('a', () => {}).on('b', () => {}).once('c', () => {});
assert(result26 === emitter26, 'EventEmitter: method chaining works');

// Test 27: LinkedList - add items
const list27 = new LinkedList();
list27.add(1).add(2).add(3);
assert(list27.size === 3, 'LinkedList: size is 3 after adding');

// Test 28: LinkedList - is iterable
const list28 = new LinkedList();
list28.add(1).add(2).add(3);
assert(JSON.stringify([...list28]) === JSON.stringify([1, 2, 3]), 'LinkedList: is iterable');

// Test 29: LinkedList - toArray
const list29 = new LinkedList();
list29.add(1).add(2);
assert(JSON.stringify(list29.toArray()) === JSON.stringify([1, 2]), 'LinkedList: toArray works');

// Test 30: LinkedList - remove
const list30 = new LinkedList();
list30.add(1).add(2).add(3);
list30.remove(2);
assert(JSON.stringify(list30.toArray()) === JSON.stringify([1, 3]), 'LinkedList: remove works');

// Test 31: LinkedList - find
const list31 = new LinkedList();
list31.add({ id: 1 }).add({ id: 2 }).add({ id: 3 });
const found31 = list31.find(item => item.id === 2);
assert(found31 && found31.id === 2, 'LinkedList: find works');

// Test 32: LinkedList - addFirst
const list32 = new LinkedList();
list32.add(2).add(3);
list32.addFirst(1);
assert(JSON.stringify(list32.toArray()) === JSON.stringify([1, 2, 3]), 'LinkedList: addFirst works');

// Test 33: LinkedList - from
const list33 = LinkedList.from([1, 2, 3]);
assert(JSON.stringify(list33.toArray()) === JSON.stringify([1, 2, 3]), 'LinkedList.from works');

// Test 34: LinkedList - isEmpty
const list34 = new LinkedList();
assert(list34.isEmpty === true, 'LinkedList: isEmpty true when empty');
list34.add(1);
assert(list34.isEmpty === false, 'LinkedList: isEmpty false after add');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
