// Note: Functions are expected to be defined by user code
// (withSwimming, withFlying, withWalking, createDuck, createPenguin, compose, createMixin, composeWithResolver)

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

console.log('Testing Ex21 - Object Composition...\n');

assert(duck.name === 'Donald', 'should have all abilities');
assert(duck.swim() === 'Donald swims', 'should have all abilities');
assert(duck.fly() === 'Donald flies', 'should have all abilities');
assert(duck.walk() === 'Donald walks', 'should have all abilities');
assert(penguin.swim() === 'Tux swims', 'should swim and walk but not fly');
assert(penguin.walk() === 'Tux walks', 'should swim and walk but not fly');
assert(penguin.fly === undefined, 'should swim and walk but not fly');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
