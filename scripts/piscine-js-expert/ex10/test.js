// Note: Functions are expected to be defined by user code
// (createCounter, createBankAccount, createStack, createEventEmitter)

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

console.log('Testing Module Pattern & Encapsulation...\n');

// Test 1: createCounter - starts at 0
const counter1 = createCounter();
assert(counter1.getValue() === 0, 'createCounter: starts at 0');

// Test 2: createCounter - increment
const counter2 = createCounter();
assert(counter2.increment() === 1, 'createCounter: increment returns 1');
assert(counter2.increment() === 2, 'createCounter: increment returns 2');

// Test 3: createCounter - decrement
const counter3 = createCounter();
counter3.increment();
counter3.increment();
assert(counter3.decrement() === 1, 'createCounter: decrement works');

// Test 4: createCounter - reset
const counter4 = createCounter();
counter4.increment();
counter4.increment();
counter4.reset();
assert(counter4.getValue() === 0, 'createCounter: reset to 0');

// Test 5: createCounter - private count
const counter5 = createCounter();
assert(counter5.count === undefined, 'createCounter: count is private');

// Test 6: createBankAccount - initial balance
const account1 = createBankAccount(1000);
assert(account1.getBalance() === 1000, 'createBankAccount: starts with initial balance');

// Test 7: createBankAccount - deposit
const account2 = createBankAccount(100);
account2.deposit(50);
assert(account2.getBalance() === 150, 'createBankAccount: deposit adds to balance');

// Test 8: createBankAccount - withdraw
const account3 = createBankAccount(100);
account3.withdraw(30);
assert(account3.getBalance() === 70, 'createBankAccount: withdraw subtracts from balance');

// Test 9: createBankAccount - prevent overdraft
const account4 = createBankAccount(100);
let overdraftPrevented = false;
try {
    account4.withdraw(150);
} catch (e) {
    overdraftPrevented = true;
}
assert(overdraftPrevented, 'createBankAccount: prevents overdraft');

// Test 10: createBankAccount - transaction history
const account5 = createBankAccount(100);
account5.deposit(50);
account5.withdraw(25);
const history = account5.getHistory();
assert(history.length >= 2, 'createBankAccount: tracks transaction history');

// Test 11: createBankAccount - private balance
const account6 = createBankAccount(1000);
assert(account6.balance === undefined, 'createBankAccount: balance is private');

// Test 12: createStack - push items
const stack1 = createStack();
stack1.push(1);
stack1.push(2);
assert(stack1.size() === 2, 'createStack: push increases size');

// Test 13: createStack - pop in LIFO order
const stack2 = createStack();
stack2.push(1);
stack2.push(2);
stack2.push(3);
assert(stack2.pop() === 3, 'createStack: pop returns last pushed (LIFO)');
assert(stack2.pop() === 2, 'createStack: pop returns next (LIFO)');

// Test 14: createStack - peek
const stack3 = createStack();
stack3.push(1);
stack3.push(2);
assert(stack3.peek() === 2, 'createStack: peek returns top without removing');
assert(stack3.size() === 2, 'createStack: peek does not change size');

// Test 15: createStack - isEmpty
const stack4 = createStack();
assert(stack4.isEmpty() === true, 'createStack: isEmpty true when empty');
stack4.push(1);
assert(stack4.isEmpty() === false, 'createStack: isEmpty false when not empty');

// Test 16: createEventEmitter - register and emit
const emitter1 = createEventEmitter();
let emitted1 = null;
emitter1.on('test', (data) => { emitted1 = data; });
emitter1.emit('test', 'hello');
assert(emitted1 === 'hello', 'createEventEmitter: on/emit works');

// Test 17: createEventEmitter - multiple listeners
const emitter2 = createEventEmitter();
let count2 = 0;
emitter2.on('test', () => { count2++; });
emitter2.on('test', () => { count2++; });
emitter2.emit('test');
assert(count2 === 2, 'createEventEmitter: supports multiple listeners');

// Test 18: createEventEmitter - off removes listener
const emitter3 = createEventEmitter();
let called3 = false;
const handler3 = () => { called3 = true; };
emitter3.on('test', handler3);
emitter3.off('test', handler3);
emitter3.emit('test');
assert(called3 === false, 'createEventEmitter: off removes listener');

// Test 19: createEventEmitter - once
const emitter4 = createEventEmitter();
let onceCount = 0;
emitter4.once('test', () => { onceCount++; });
emitter4.emit('test');
emitter4.emit('test');
assert(onceCount === 1, 'createEventEmitter: once fires only once');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
