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

console.log('Testing Maybe Monad...\n');

// Test 1: of() creates Just
const just5 = Maybe.of(5);
assert(just5.isJust(), 'Maybe.of: creates Just for valid value');
assert(!just5.isNothing(), 'Maybe.of: Just is not Nothing');

// Test 2: of() with null/undefined creates Nothing
const nothing1 = Maybe.of(null);
const nothing2 = Maybe.of(undefined);
assert(nothing1.isNothing(), 'Maybe.of: null creates Nothing');
assert(nothing2.isNothing(), 'Maybe.of: undefined creates Nothing');

// Test 3: nothing() creates Nothing
const nothing3 = Maybe.nothing();
assert(nothing3.isNothing(), 'Maybe.nothing: creates Nothing');
assert(!nothing3.isJust(), 'Maybe.nothing: Nothing is not Just');

// Test 4: map on Just
const mapped = Maybe.of(5).map(x => x * 2);
assert(mapped.getOrElse(0) === 10, 'map: transforms value in Just');

// Test 5: map on Nothing
const mappedNothing = Maybe.nothing().map(x => x * 2);
assert(mappedNothing.isNothing(), 'map: Nothing stays Nothing');

// Test 6: chained maps
const chained = Maybe.of(3)
    .map(x => x + 2)
    .map(x => x * 2)
    .map(x => x - 1);
assert(chained.getOrElse(0) === 9, 'map: chains correctly (3+2)*2-1 = 9');

// Test 7: getOrElse with Just
assert(Maybe.of(42).getOrElse(0) === 42, 'getOrElse: returns value for Just');

// Test 8: getOrElse with Nothing
assert(Maybe.nothing().getOrElse(99) === 99, 'getOrElse: returns default for Nothing');

// Test 9: filter keeps value if predicate true
const filtered = Maybe.of(10).filter(x => x > 5);
assert(filtered.isJust() && filtered.getOrElse(0) === 10, 'filter: keeps value when predicate true');

// Test 10: filter returns Nothing if predicate false
const filteredOut = Maybe.of(3).filter(x => x > 5);
assert(filteredOut.isNothing(), 'filter: returns Nothing when predicate false');

// Test 11: flatMap with function returning Maybe
const parseNumber = (str) => {
    const n = parseInt(str);
    return isNaN(n) ? Maybe.nothing() : Maybe.of(n);
};

const flatMapped = Maybe.of('42').flatMap(parseNumber);
assert(flatMapped.getOrElse(0) === 42, 'flatMap: unwraps nested Maybe correctly');

// Test 12: flatMap with invalid input
const flatMappedBad = Maybe.of('not a number').flatMap(parseNumber);
assert(flatMappedBad.isNothing(), 'flatMap: propagates Nothing from inner function');

// Test 13: Complex chain
const result = Maybe.of('10')
    .flatMap(parseNumber)
    .map(n => n * 2)
    .filter(n => n > 15)
    .map(n => n + 5)
    .getOrElse(0);
assert(result === 25, 'complex chain: (10*2 > 15) + 5 = 25');

// Test 14: Chain breaks on Nothing
const broken = Maybe.of('10')
    .flatMap(parseNumber)
    .map(n => n * 2)
    .filter(n => n > 100)  // This fails
    .map(n => n + 5)       // This is skipped
    .getOrElse(0);
assert(broken === 0, 'chain: breaks on filter failure');

// Test 15: Real-world example - safe object navigation
const user = {
    profile: {
        address: {
            street: 'Main St'
        }
    }
};

const street = Maybe.of(user)
    .map(u => u.profile)
    .map(p => p.address)
    .map(a => a.street)
    .getOrElse('Unknown');
assert(street === 'Main St', 'real-world: safe object navigation');

// Test 16: Missing nested property
const userNoAddress = { profile: {} };
const noStreet = Maybe.of(userNoAddress)
    .map(u => u.profile)
    .map(p => p.address)
    .map(a => a.street)
    .getOrElse('Unknown');
assert(noStreet === 'Unknown', 'real-world: handles missing nested property');

// Test 17: Zero is a valid value (not Nothing)
const zero = Maybe.of(0);
assert(zero.isJust(), 'edge case: 0 is Just, not Nothing');
assert(zero.getOrElse(99) === 0, 'edge case: 0 is returned correctly');

// Test 18: Empty string is valid
const emptyStr = Maybe.of('');
assert(emptyStr.isJust(), 'edge case: empty string is Just');
assert(emptyStr.getOrElse('default') === '', 'edge case: empty string returned');

// Test 19: false is valid
const falseMaybe = Maybe.of(false);
assert(falseMaybe.isJust(), 'edge case: false is Just');
assert(falseMaybe.getOrElse(true) === false, 'edge case: false returned correctly');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
