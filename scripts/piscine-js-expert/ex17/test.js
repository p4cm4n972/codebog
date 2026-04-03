// Note: Functions are expected to be defined by user code
// (mixin, canFly, canSwim, withPosition, withHealth, withInventory, createPlayer, createEntity, compose, createMixinFactory)

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

console.log('Testing Mixins & Composition...\n');

// Test 1: mixin - copy methods from source to target
const target1 = {};
mixin(target1, { method1: () => 'one' });
assert(target1.method1() === 'one', 'mixin: copies method1');

// Test 2: mixin - copy from multiple sources
const target2 = {};
mixin(target2, { a: 1 }, { b: 2 }, { c: 3 });
assert(target2.a === 1 && target2.b === 2 && target2.c === 3, 'mixin: copies from multiple sources');

// Test 3: mixin - works with prototypes
function Duck(name) { this.name = name; }
mixin(Duck.prototype, canFly, canSwim);
const donald = new Duck('Donald');
assert(donald.fly() === 'Donald is flying', 'mixin: fly works on prototype');
assert(donald.swim() === 'Donald is swimming', 'mixin: swim works on prototype');

// Test 4: canFly - adds fly and land methods
const bird = { name: 'Eagle' };
mixin(bird, canFly);
assert(bird.fly() === 'Eagle is flying', 'canFly: fly method works');
assert(bird.land() === 'Eagle landed', 'canFly: land method works');

// Test 5: canSwim - adds swim and dive methods
const fish = { name: 'Nemo' };
mixin(fish, canSwim);
assert(fish.swim() === 'Nemo is swimming', 'canSwim: swim method works');
assert(fish.dive() === 'Nemo dived', 'canSwim: dive method works');

// Test 6: withPosition - getPosition and setPosition
const state6 = { x: 0, y: 0 };
const pos6 = withPosition(state6);
assert(JSON.stringify(pos6.getPosition()) === JSON.stringify({ x: 0, y: 0 }), 'withPosition: getPosition works');
pos6.setPosition(10, 20);
assert(JSON.stringify(pos6.getPosition()) === JSON.stringify({ x: 10, y: 20 }), 'withPosition: setPosition works');

// Test 7: withHealth - health methods
const state7 = { health: 100 };
const health7 = withHealth(state7);
assert(health7.getHealth() === 100, 'withHealth: getHealth returns 100');
health7.damage(25);
assert(health7.getHealth() === 75, 'withHealth: damage reduces health');
health7.heal(10);
assert(health7.getHealth() === 85, 'withHealth: heal increases health');

// Test 8: withInventory - inventory methods
const state8 = { inventory: [] };
const inv8 = withInventory(state8);
inv8.addItem('sword');
inv8.addItem('shield');
assert(JSON.stringify(inv8.getInventory()) === JSON.stringify(['sword', 'shield']), 'withInventory: addItem works');
inv8.removeItem('sword');
assert(JSON.stringify(inv8.getInventory()) === JSON.stringify(['shield']), 'withInventory: removeItem works');

// Test 9: createPlayer - create with all behaviors
const player9 = createPlayer('Hero');
assert(player9.name === 'Hero', 'createPlayer: has name');
assert(typeof player9.getPosition === 'function', 'createPlayer: has getPosition');
assert(player9.getHealth() === 100, 'createPlayer: health is 100');
assert(JSON.stringify(player9.getInventory()) === JSON.stringify([]), 'createPlayer: inventory is empty');

// Test 10: createPlayer - use all methods
const player10 = createPlayer('Hero');
player10.setPosition(5, 10);
player10.damage(20);
player10.addItem('potion');
assert(JSON.stringify(player10.getPosition()) === JSON.stringify({ x: 5, y: 10 }), 'createPlayer: setPosition works');
assert(player10.getHealth() === 80, 'createPlayer: damage works');
assert(player10.getInventory().includes('potion'), 'createPlayer: addItem works');

// Test 11: createEntity - player with inventory
const entityPlayer = createEntity('player', 'Hero');
assert(typeof entityPlayer.getInventory === 'function', 'createEntity: player has inventory');

// Test 12: createEntity - enemy with attack
const enemy = createEntity('enemy', 'Goblin');
assert(typeof enemy.attack === 'function', 'createEntity: enemy has attack');

// Test 13: createEntity - npc with talk
const npc = createEntity('npc', 'Bob');
assert(npc.talk().includes('Bob'), 'createEntity: npc talk contains name');

// Test 14: compose - multiple behaviors
const state14 = { x: 0, y: 0, health: 100 };
const composed14 = compose(withPosition, withHealth);
const entity14 = composed14(state14);
assert(typeof entity14.getPosition === 'function', 'compose: has getPosition');
assert(typeof entity14.getHealth === 'function', 'compose: has getHealth');

// Test 15: createMixinFactory - create with selected mixins
const factory15 = createMixinFactory({
    position: withPosition,
    health: withHealth,
    inventory: withInventory
});
const entity15 = factory15(['position', 'health'], { x: 0, y: 0, health: 100 });
assert(typeof entity15.getPosition === 'function', 'createMixinFactory: has position');
assert(typeof entity15.getHealth === 'function', 'createMixinFactory: has health');
assert(entity15.getInventory === undefined, 'createMixinFactory: no inventory');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
