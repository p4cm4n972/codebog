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

console.log('Testing Lazy...\n');

// Test 1: Basic from and toArray
const arr1 = Lazy.from([1, 2, 3, 4, 5]).toArray();
assert(JSON.stringify(arr1) === JSON.stringify([1, 2, 3, 4, 5]), 'from/toArray: basic conversion');

// Test 2: map
const mapped = Lazy.from([1, 2, 3])
    .map(x => x * 2)
    .toArray();
assert(JSON.stringify(mapped) === JSON.stringify([2, 4, 6]), 'map: transforms elements');

// Test 3: filter
const filtered = Lazy.from([1, 2, 3, 4, 5, 6])
    .filter(x => x % 2 === 0)
    .toArray();
assert(JSON.stringify(filtered) === JSON.stringify([2, 4, 6]), 'filter: keeps even numbers');

// Test 4: Chained map and filter
const chained = Lazy.from([1, 2, 3, 4, 5])
    .map(x => x * 2)
    .filter(x => x > 5)
    .toArray();
assert(JSON.stringify(chained) === JSON.stringify([6, 8, 10]), 'chain: map then filter');

// Test 5: take
const taken = Lazy.from([1, 2, 3, 4, 5])
    .take(3)
    .toArray();
assert(JSON.stringify(taken) === JSON.stringify([1, 2, 3]), 'take: first 3 elements');

// Test 6: skip
const skipped = Lazy.from([1, 2, 3, 4, 5])
    .skip(2)
    .toArray();
assert(JSON.stringify(skipped) === JSON.stringify([3, 4, 5]), 'skip: skip first 2');

// Test 7: Lazy evaluation proof (take optimization)
let mapCount = 0;
const lazy = Lazy.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .map(x => { mapCount++; return x * 2; })
    .take(3)
    .toArray();

assert(mapCount === 3, `lazy: map only called 3 times, not 10 (was ${mapCount})`);
assert(JSON.stringify(lazy) === JSON.stringify([2, 4, 6]), 'lazy: correct result with take');

// Test 8: reduce
const sum = Lazy.from([1, 2, 3, 4, 5])
    .reduce((acc, x) => acc + x, 0);
assert(sum === 15, 'reduce: sums to 15');

// Test 9: first
const first = Lazy.from([10, 20, 30])
    .first();
assert(first === 10, 'first: returns first element');

// Test 10: count
const cnt = Lazy.from([1, 2, 3, 4, 5])
    .filter(x => x > 2)
    .count();
assert(cnt === 3, 'count: counts filtered elements');

// Test 11: forEach
let forEachSum = 0;
Lazy.from([1, 2, 3, 4, 5])
    .forEach(x => { forEachSum += x; });
assert(forEachSum === 15, 'forEach: iterates correctly');

// Test 12: Complex chain
const complex = Lazy.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .map(x => x * 2)
    .filter(x => x > 10)
    .map(x => x + 1)
    .take(3)
    .toArray();
assert(JSON.stringify(complex) === JSON.stringify([13, 15, 17]), 'complex: multi-step chain');

// Test 13: flatMap
const flatMapped = Lazy.from([1, 2, 3])
    .flatMap(x => [x, x * 10])
    .toArray();
assert(JSON.stringify(flatMapped) === JSON.stringify([1, 10, 2, 20, 3, 30]), 'flatMap: flattens arrays');

// Test 14: Infinite sequence (with take)
function* infinite() {
    let n = 1;
    while (true) yield n++;
}

const fromInfinite = Lazy.from(infinite())
    .filter(x => x % 2 === 0)
    .take(5)
    .toArray();
assert(JSON.stringify(fromInfinite) === JSON.stringify([2, 4, 6, 8, 10]), 'infinite: works with generators');

// Test 15: Skip and take combined
const skipTake = Lazy.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .skip(3)
    .take(4)
    .toArray();
assert(JSON.stringify(skipTake) === JSON.stringify([4, 5, 6, 7]), 'skip+take: pagination-like');

// Test 16: Empty array
const empty = Lazy.from([])
    .map(x => x * 2)
    .filter(x => x > 0)
    .toArray();
assert(JSON.stringify(empty) === JSON.stringify([]), 'edge: empty array');

// Test 17: Take more than available
const takeMore = Lazy.from([1, 2, 3])
    .take(10)
    .toArray();
assert(JSON.stringify(takeMore) === JSON.stringify([1, 2, 3]), 'edge: take more than available');

// Test 18: Performance comparison hint
console.log('\n--- Performance Test ---');
const large = Array.from({ length: 10000 }, (_, i) => i + 1);

// Eager
let eagerOps = 0;
console.time('Eager');
const eagerResult = large
    .map(x => { eagerOps++; return x * 2; })
    .filter(x => { eagerOps++; return x > 100; })
    .slice(0, 10);
console.timeEnd('Eager');
console.log(`Eager operations: ${eagerOps}`);

// Lazy
let lazyOps = 0;
console.time('Lazy');
const lazyResult = Lazy.from(large)
    .map(x => { lazyOps++; return x * 2; })
    .filter(x => { lazyOps++; return x > 100; })
    .take(10)
    .toArray();
console.timeEnd('Lazy');
console.log(`Lazy operations: ${lazyOps}`);

assert(lazyOps < eagerOps, `performance: lazy does fewer operations (${lazyOps} vs ${eagerOps})`);

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
