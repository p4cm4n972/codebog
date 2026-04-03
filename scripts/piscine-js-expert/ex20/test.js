// Note: Functions are expected to be defined by user code
// (range, fibonacci, take, filter, map, zip, flatten, paginate, createRangeIterable, accumulator)

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

async function runTests() {
    console.log('Testing Generators & Iterators...\n');

    // Test 1: range - generate 1 to n
    assert(
        JSON.stringify([...range(5)]) === JSON.stringify([1, 2, 3, 4, 5]),
        'range: generates 1 to 5'
    );

    // Test 2: range - with 0
    assert(
        JSON.stringify([...range(0)]) === JSON.stringify([]),
        'range: 0 gives empty array'
    );

    // Test 3: fibonacci - sequence
    const fib = fibonacci();
    assert(fib.next().value === 0, 'fibonacci: first is 0');
    assert(fib.next().value === 1, 'fibonacci: second is 1');
    assert(fib.next().value === 1, 'fibonacci: third is 1');
    assert(fib.next().value === 2, 'fibonacci: fourth is 2');
    assert(fib.next().value === 3, 'fibonacci: fifth is 3');
    assert(fib.next().value === 5, 'fibonacci: sixth is 5');

    // Test 4: fibonacci - infinite
    const fib2 = fibonacci();
    for (let i = 0; i < 100; i++) fib2.next();
    assert(fib2.next().done === false, 'fibonacci: is infinite');

    // Test 5: take - first n elements
    assert(
        JSON.stringify([...take(3, [1, 2, 3, 4, 5])]) === JSON.stringify([1, 2, 3]),
        'take: takes first 3'
    );

    // Test 6: take - works with generators
    assert(
        JSON.stringify([...take(5, fibonacci())]) === JSON.stringify([0, 1, 1, 2, 3]),
        'take: works with fibonacci generator'
    );

    // Test 7: take - handles fewer elements
    assert(
        JSON.stringify([...take(10, [1, 2])]) === JSON.stringify([1, 2]),
        'take: handles fewer elements'
    );

    // Test 8: filter - elements
    const evens = [...filter([1, 2, 3, 4, 5], x => x % 2 === 0)];
    assert(
        JSON.stringify(evens) === JSON.stringify([2, 4]),
        'filter: filters even numbers'
    );

    // Test 9: filter - with generators
    const evenFibs = [...take(5, filter(fibonacci(), x => x % 2 === 0))];
    assert(
        JSON.stringify(evenFibs) === JSON.stringify([0, 2, 8, 34, 144]),
        'filter: works with fibonacci for even numbers'
    );

    // Test 10: map - transform
    const doubled = [...map([1, 2, 3], x => x * 2)];
    assert(
        JSON.stringify(doubled) === JSON.stringify([2, 4, 6]),
        'map: doubles values'
    );

    // Test 11: map - lazy with generators
    const mapped = [...take(3, map(fibonacci(), x => x * 10))];
    assert(
        JSON.stringify(mapped) === JSON.stringify([0, 10, 10]),
        'map: lazy with generators'
    );

    // Test 12: zip - arrays together
    const zipped = [...zip([1, 2, 3], ['a', 'b', 'c'])];
    assert(
        JSON.stringify(zipped) === JSON.stringify([[1, 'a'], [2, 'b'], [3, 'c']]),
        'zip: zips two arrays'
    );

    // Test 13: zip - stops at shortest
    const zipped2 = [...zip([1, 2], ['a', 'b', 'c', 'd'])];
    assert(
        JSON.stringify(zipped2) === JSON.stringify([[1, 'a'], [2, 'b']]),
        'zip: stops at shortest'
    );

    // Test 14: zip - multiple iterables
    const zipped3 = [...zip([1, 2], ['a', 'b'], [true, false])];
    assert(
        JSON.stringify(zipped3) === JSON.stringify([[1, 'a', true], [2, 'b', false]]),
        'zip: handles three iterables'
    );

    // Test 15: flatten - one level
    const flat1 = [...flatten([[1, 2], [3, 4]])];
    assert(
        JSON.stringify(flat1) === JSON.stringify([1, 2, 3, 4]),
        'flatten: one level'
    );

    // Test 16: flatten - specified depth
    const flat2 = [...flatten([[[1, 2]], [[3, 4]]], 2)];
    assert(
        JSON.stringify(flat2) === JSON.stringify([1, 2, 3, 4]),
        'flatten: depth 2'
    );

    // Test 17: createRangeIterable - basic
    const rangeIter = createRangeIterable(1, 5);
    assert(
        JSON.stringify([...rangeIter]) === JSON.stringify([1, 2, 3, 4, 5]),
        'createRangeIterable: 1 to 5'
    );

    // Test 18: createRangeIterable - with step
    const rangeStep = createRangeIterable(0, 10, 2);
    assert(
        JSON.stringify([...rangeStep]) === JSON.stringify([0, 2, 4, 6, 8, 10]),
        'createRangeIterable: with step 2'
    );

    // Test 19: createRangeIterable - reusable
    const rangeReuse = createRangeIterable(1, 3);
    const first = [...rangeReuse];
    const second = [...rangeReuse];
    assert(
        JSON.stringify(first) === JSON.stringify(second),
        'createRangeIterable: is reusable'
    );

    // Test 20: accumulator - accumulate values
    const acc = accumulator();
    acc.next();
    assert(acc.next(10).value === 10, 'accumulator: first add is 10');
    assert(acc.next(5).value === 15, 'accumulator: second add makes 15');
    assert(acc.next(3).value === 18, 'accumulator: third add makes 18');

    // Test 21: accumulator - return total
    const acc2 = accumulator();
    acc2.next();
    acc2.next(10);
    acc2.next(20);
    assert(acc2.return().value === 30, 'accumulator: return gives total');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
