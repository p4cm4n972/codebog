// Note: Functions are expected to be defined by user code
// (getGrade, fizzBuzz, sumRange, countOccurrences, getObjectKeys)

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
    } catch (error) {
        console.log(`❌ ${name}`);
        console.error(error.message);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function arrayEquals(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

console.log('\n🧪 Testing ex07 - Conditions & Loops\n');

test('getGrade: should return correct grade', () => {
    assert(getGrade(95) === 'A', 'Expected "A" for 95');
    assert(getGrade(85) === 'B', 'Expected "B" for 85');
    assert(getGrade(75) === 'C', 'Expected "C" for 75');
    assert(getGrade(65) === 'D', 'Expected "D" for 65');
    assert(getGrade(50) === 'F', 'Expected "F" for 50');
});

test('fizzBuzz: should return correct FizzBuzz array', () => {
    const result = fizzBuzz(15);
    const expected = [1, 2, "Fizz", 4, "Buzz", "Fizz", 7, 8, "Fizz", "Buzz", 11, "Fizz", 13, 14, "FizzBuzz"];
    assert(arrayEquals(result, expected), 'FizzBuzz array mismatch');
});

test('fizzBuzz: should handle small numbers', () => {
    const result = fizzBuzz(5);
    const expected = [1, 2, "Fizz", 4, "Buzz"];
    assert(arrayEquals(result, expected), 'Expected correct small FizzBuzz');
});

test('sumRange: should sum numbers in range', () => {
    assert(sumRange(1, 5) === 15, 'Expected 15 (1+2+3+4+5)');
    assert(sumRange(1, 10) === 55, 'Expected 55');
    assert(sumRange(5, 5) === 5, 'Expected 5');
});

test('countOccurrences: should count occurrences', () => {
    assert(countOccurrences([1, 2, 2, 3, 2], 2) === 3, 'Expected 3 occurrences');
    assert(countOccurrences([1, 1, 1], 1) === 3, 'Expected 3 occurrences');
    assert(countOccurrences([1, 2, 3], 4) === 0, 'Expected 0 occurrences');
});

test('getObjectKeys: should return object keys', () => {
    const result = getObjectKeys({a: 1, b: 2, c: 3});
    assert(arrayEquals(result, ['a', 'b', 'c']), 'Expected ["a", "b", "c"]');
});

console.log('\n✨ Tests completed!\n');
