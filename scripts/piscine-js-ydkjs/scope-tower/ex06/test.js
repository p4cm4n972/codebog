// Note: Functions are expected to be defined by user code
// (chain1, chain2, chain3)

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

console.log('Testing Ex06 - Scope Chain...\n');

assert(JSON.stringify(chain1()) === JSON.stringify(['global', 'level1', 'level2', 'level3']), 'should return all 4 scope levels');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
