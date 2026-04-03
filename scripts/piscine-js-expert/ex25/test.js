// Note: Functions are expected to be defined by user code
// (reactive, effect, computed, ref, h, render, diff, patch, createComponent, mount)
// Note: DOM-dependent tests (render, mount) are simplified for sandbox environment

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

console.log('Testing Mini Framework Reactif...\n');

// Test 1: reactive - makes object reactive
const state1 = reactive({ count: 0 });
assert(state1.count === 0, 'reactive: initial value');
state1.count = 1;
assert(state1.count === 1, 'reactive: updates value');

// Test 2: reactive - triggers effects on change
const state2 = reactive({ count: 0 });
let effectCount2 = 0;
effect(() => {
    effectCount2++;
    state2.count;
});
assert(effectCount2 === 1, 'effect: runs immediately');
state2.count = 1;
assert(effectCount2 === 2, 'effect: runs on change');

// Test 3: effect - runs immediately
let effectRan3 = false;
effect(() => { effectRan3 = true; });
assert(effectRan3, 'effect: runs immediately');

// Test 4: effect - tracks dependencies
const state4 = reactive({ a: 1, b: 2 });
let effectCount4 = 0;
effect(() => {
    effectCount4++;
    state4.a;
});
assert(effectCount4 === 1, 'effect: initial run');
state4.a = 10;
assert(effectCount4 === 2, 'effect: runs on tracked change');
state4.b = 20;
assert(effectCount4 === 2, 'effect: does not run on untracked change');

// Test 5: computed - computes value
const state5 = reactive({ count: 1 });
const double5 = computed(() => state5.count * 2);
assert(double5.value === 2, 'computed: computes value');

// Test 6: computed - caches until dependency changes
let computeCount6 = 0;
const state6 = reactive({ count: 1 });
const double6 = computed(() => {
    computeCount6++;
    return state6.count * 2;
});
double6.value;
double6.value;
assert(computeCount6 === 1, 'computed: caches value');
state6.count = 2;
assert(double6.value === 4, 'computed: recomputes on change');
assert(computeCount6 === 2, 'computed: only recomputes once');

// Test 7: ref - wraps value
const count7 = ref(0);
assert(count7.value === 0, 'ref: initial value');
count7.value = 1;
assert(count7.value === 1, 'ref: updates value');

// Test 8: ref - is reactive
const count8 = ref(0);
let effectRan8 = 0;
effect(() => {
    effectRan8++;
    count8.value;
});
assert(effectRan8 === 1, 'ref: effect runs initially');
count8.value = 1;
assert(effectRan8 === 2, 'ref: effect runs on change');

// Test 9: h - creates vnode
const vnode9 = h('div', { class: 'container' }, []);
assert(vnode9.tag === 'div', 'h: sets tag');
assert(vnode9.props.class === 'container', 'h: sets props');
assert(JSON.stringify(vnode9.children) === JSON.stringify([]), 'h: sets children');

// Test 10: h - handles nested vnodes
const vnode10 = h('div', {}, [
    h('span', {}, ['Hello']),
    h('span', {}, ['World'])
]);
assert(vnode10.children.length === 2, 'h: handles nested vnodes');
assert(vnode10.children[0].tag === 'span', 'h: nested vnode has tag');

// Test 11: diff - detects attribute changes
const oldNode11 = h('div', { class: 'old' }, []);
const newNode11 = h('div', { class: 'new' }, []);
const patches11 = diff(oldNode11, newNode11);
const hasAttrPatch = patches11.some(p => p.type === 'ATTR' && p.key === 'class' && p.value === 'new');
assert(hasAttrPatch, 'diff: detects attribute changes');

// Test 12: diff - detects added children
const oldNode12 = h('div', {}, []);
const newNode12 = h('div', {}, [h('span', {}, [])]);
const patches12 = diff(oldNode12, newNode12);
assert(patches12.some(p => p.type === 'ADD'), 'diff: detects added children');

// Test 13: diff - detects removed children
const oldNode13 = h('div', {}, [h('span', {}, [])]);
const newNode13 = h('div', {}, []);
const patches13 = diff(oldNode13, newNode13);
assert(patches13.some(p => p.type === 'REMOVE'), 'diff: detects removed children');

// Test 14: createComponent - creates with setup
const Counter14 = createComponent({
    setup() {
        const count = ref(0);
        const increment = () => count.value++;
        return { count, increment };
    },
    render() {
        return h('button', { onClick: this.increment }, [
            `Count: ${this.count.value}`
        ]);
    }
});
assert(Counter14.count.value === 0, 'createComponent: initializes state');
Counter14.increment();
assert(Counter14.count.value === 1, 'createComponent: methods work');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
