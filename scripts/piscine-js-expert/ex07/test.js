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

async function runTests() {
    console.log('Testing Generators & Iterators...\n');

    // Test 1: range - basic
    const range1 = [...range(0, 5)];
    assert(JSON.stringify(range1) === JSON.stringify([0, 1, 2, 3, 4]), 'range: 0 to 5');

    // Test 2: range - with step
    const range2 = [...range(0, 10, 2)];
    assert(JSON.stringify(range2) === JSON.stringify([0, 2, 4, 6, 8]), 'range: step of 2');

    // Test 3: range - negative step
    const range3 = [...range(10, 0, -2)];
    assert(JSON.stringify(range3) === JSON.stringify([10, 8, 6, 4, 2]), 'range: negative step');

    // Test 4: fibonacci - first 10
    const fib10 = [...take(fibonacci(), 10)];
    assert(
        JSON.stringify(fib10) === JSON.stringify([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]),
        'fibonacci: first 10 numbers'
    );

    // Test 5: fibonacci - manual iteration
    const fib = fibonacci();
    assert(fib.next().value === 0, 'fibonacci: 1st value is 0');
    assert(fib.next().value === 1, 'fibonacci: 2nd value is 1');
    assert(fib.next().value === 1, 'fibonacci: 3rd value is 1');
    assert(fib.next().value === 2, 'fibonacci: 4th value is 2');

    // Test 6: take - basic
    const taken = [...take(range(1, 100), 5)];
    assert(JSON.stringify(taken) === JSON.stringify([1, 2, 3, 4, 5]), 'take: first 5 from range');

    // Test 7: take - less than available
    const taken2 = [...take(range(1, 3), 10)];
    assert(JSON.stringify(taken2) === JSON.stringify([1, 2]), 'take: handles fewer items than requested');

    // Test 8: map - basic
    const mapped = [...map(range(1, 5), x => x * 2)];
    assert(JSON.stringify(mapped) === JSON.stringify([2, 4, 6, 8]), 'map: doubles values');

    // Test 9: map - with objects
    const mapped2 = [...map(range(1, 4), x => ({ value: x }))];
    assert(
        mapped2.length === 3 && mapped2[0].value === 1 && mapped2[2].value === 3,
        'map: creates objects'
    );

    // Test 10: filter - basic
    const filtered = [...filter(range(1, 10), x => x % 2 === 0)];
    assert(JSON.stringify(filtered) === JSON.stringify([2, 4, 6, 8]), 'filter: even numbers');

    // Test 11: filter - strings
    const words = ['apple', 'banana', 'apricot', 'cherry'];
    const aWords = [...filter(words, w => w.startsWith('a'))];
    assert(JSON.stringify(aWords) === JSON.stringify(['apple', 'apricot']), 'filter: words starting with a');

    // Test 12: Chaining map and filter
    const chained = [...
        map(
            filter(range(1, 10), x => x % 2 === 0),
            x => x * x
        )
    ];
    assert(JSON.stringify(chained) === JSON.stringify([4, 16, 36, 64]), 'chaining: filter then map');

    // Test 13: zip - two arrays
    const zipped1 = [...zip(range(1, 4), ['a', 'b', 'c'])];
    assert(
        JSON.stringify(zipped1) === JSON.stringify([[1, 'a'], [2, 'b'], [3, 'c']]),
        'zip: two iterables'
    );

    // Test 14: zip - three arrays
    const zipped2 = [...zip(range(1, 4), ['a', 'b', 'c'], [true, false, true])];
    assert(
        JSON.stringify(zipped2) === JSON.stringify([[1, 'a', true], [2, 'b', false], [3, 'c', true]]),
        'zip: three iterables'
    );

    // Test 15: zip - different lengths (stops at shortest)
    const zipped3 = [...zip(range(1, 10), ['a', 'b'])];
    assert(
        JSON.stringify(zipped3) === JSON.stringify([[1, 'a'], [2, 'b']]),
        'zip: stops at shortest'
    );

    // Test 16: Complex pipeline
    const pipeline = [...
        take(
            map(
                filter(range(1, 100), x => x % 3 === 0),
                x => x * 2
            ),
            5
        )
    ];
    assert(JSON.stringify(pipeline) === JSON.stringify([6, 12, 18, 24, 30]), 'pipeline: complex chaining');

    // Test 17: AsyncQueue - basic enqueue/dequeue
    const queue1 = new AsyncQueue();
    queue1.enqueue(1);
    queue1.enqueue(2);
    queue1.enqueue(3);
    queue1.close();

    const items1 = [];
    for await (const item of queue1) {
        items1.push(item);
    }
    assert(JSON.stringify(items1) === JSON.stringify([1, 2, 3]), 'AsyncQueue: basic enqueue/dequeue');

    // Test 18: AsyncQueue - async production
    const queue2 = new AsyncQueue();

    (async () => {
        await sleep(10);
        queue2.enqueue('a');
        await sleep(10);
        queue2.enqueue('b');
        await sleep(10);
        queue2.enqueue('c');
        queue2.close();
    })();

    const items2 = [];
    for await (const item of queue2) {
        items2.push(item);
    }
    assert(JSON.stringify(items2) === JSON.stringify(['a', 'b', 'c']), 'AsyncQueue: async production');

    // Test 19: Lazy evaluation proof
    let mapCalls = 0;
    const lazyMap = map(range(1, 1000000), x => {
        mapCalls++;
        return x * 2;
    });

    const first5 = [...take(lazyMap, 5)];
    assert(mapCalls === 5, `lazy: map only called 5 times, not 1000000 (was ${mapCalls})`);

    // Test 20: Generator is iterable
    const gen = range(1, 4);
    let sum = 0;
    for (const n of gen) {
        sum += n;
    }
    assert(sum === 6, 'iterable: generators work with for-of');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));

    // process.exit not available in sandbox
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

runTests();
