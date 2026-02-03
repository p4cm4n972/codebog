// Note: Functions are expected to be defined by user code
// (str1, str2, str3, str4, str5, str6)

// Test utilities
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

console.log('Testing Ex03 - Strings & Unicode...\n');

assert(str1() === 4, 'should return 4');
assert(str1() === "café".length, 'matches actual JS behavior');
assert(str2() === 8, 'should return 8 (emoji family = multiple code units)');
assert(str2() === "👨‍👩‍👧".length, 'matches actual JS behavior');
assert(str3() === 8, 'should return 8 (split by code unit)');
assert(str3() === "👨‍👩‍👧".split("", 'matches actual JS behavior');
assert(str4() === 5, 'should return 5 (spread by codepoint, not grapheme)');
assert(JSON.stringify(str4()) === JSON.stringify([...'👨‍👩‍👧'].length), 'matches actual JS behavior');
assert(str5() === false, 'should return false (different representations)');
assert(JSON.stringify(str5()) === JSON.stringify(a === b), 'matches actual JS behavior');
assert(str6() === true, 'should return true (normalize unifies representations)');
assert(JSON.stringify(str6()) === JSON.stringify(a === b), 'matches actual JS behavior');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
