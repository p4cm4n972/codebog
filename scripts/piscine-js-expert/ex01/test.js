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

console.log('Testing curry...\n');

// Test 1: Basic currying
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
assert(curriedAdd(1)(2)(3) === 6, 'curry: (1)(2)(3) = 6');

// Test 2: Partial application with 2 args
assert(curriedAdd(1, 2)(3) === 6, 'curry: (1, 2)(3) = 6');

// Test 3: Partial application with different split
assert(curriedAdd(1)(2, 3) === 6, 'curry: (1)(2, 3) = 6');

// Test 4: All arguments at once
assert(curriedAdd(1, 2, 3) === 6, 'curry: (1, 2, 3) = 6');

// Test 5: Stored partial application
const add5 = curriedAdd(5);
assert(add5(2)(3) === 10, 'curry: stored partial (5)(2)(3) = 10');

// Test 6: Two-argument function
const multiply = (a, b) => a * b;
const curriedMultiply = curry(multiply);
assert(curriedMultiply(3)(4) === 12, 'curry: 2-arg function (3)(4) = 12');
assert(curriedMultiply(3, 4) === 12, 'curry: 2-arg function (3, 4) = 12');

// Test 7: Complex partial application
const add5and2 = curriedAdd(5, 2);
assert(add5and2(3) === 10, 'curry: (5, 2)(3) = 10');

// Test 8: String concatenation
const concat = (a, b, c, d) => a + b + c + d;
const curriedConcat = curry(concat);
assert(
    curriedConcat('Hello')(' ')('World')('!') === 'Hello World!',
    'curry: works with strings'
);

// Test 9: Reusable function creation
const map = curry((fn, arr) => arr.map(fn));
const double = map(x => x * 2);
const result = double([1, 2, 3]);
assert(
    JSON.stringify(result) === JSON.stringify([2, 4, 6]),
    'curry: reusable map function'
);

// Test 10: Filter example
const filter = curry((fn, arr) => arr.filter(fn));
const isEven = x => x % 2 === 0;
const filterEven = filter(isEven);
const evens = filterEven([1, 2, 3, 4, 5, 6]);
assert(
    JSON.stringify(evens) === JSON.stringify([2, 4, 6]),
    'curry: reusable filter function'
);

// Test 11: Four arguments with various splits
const fn4 = (a, b, c, d) => a + b + c + d;
const curried4 = curry(fn4);
assert(curried4(1)(2)(3)(4) === 10, 'curry: 4-arg (1)(2)(3)(4)');
assert(curried4(1, 2)(3, 4) === 10, 'curry: 4-arg (1,2)(3,4)');
assert(curried4(1)(2, 3, 4) === 10, 'curry: 4-arg (1)(2,3,4)');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
