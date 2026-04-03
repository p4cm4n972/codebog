// Note: Functions are expected to be defined by user code
// (createScope, analyzeScopes, findFreeVariables, createSandbox, demonstrateShadowing, demonstrateTDZ)

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

console.log('Testing Scope Chain & Lexical Environment...\n');

// Test 1: createScope - declare variables
const scope1 = createScope();
scope1.declare('x', 10);
assert(scope1.lookup('x') === 10, 'createScope: declare and lookup variable');

// Test 2: createScope - throw on duplicate declaration
const scope2 = createScope();
scope2.declare('x', 10);
let dupThrown = false;
try {
    scope2.declare('x', 20);
} catch (e) {
    dupThrown = true;
}
assert(dupThrown, 'createScope: throws on duplicate declaration');

// Test 3: createScope - assign to existing variables
const scope3 = createScope();
scope3.declare('x', 10);
scope3.assign('x', 20);
assert(scope3.lookup('x') === 20, 'createScope: assign updates value');

// Test 4: createScope - throw on assignment to undeclared
const scope4 = createScope();
let undeclaredThrown = false;
try {
    scope4.assign('x', 10);
} catch (e) {
    undeclaredThrown = true;
}
assert(undeclaredThrown, 'createScope: throws on assignment to undeclared');

// Test 5: createScope - lookup in parent scope
const parent5 = createScope();
parent5.declare('x', 10);
const child5 = parent5.createChild();
assert(child5.lookup('x') === 10, 'createScope: child looks up in parent');

// Test 6: createScope - shadow parent variables
const parent6 = createScope();
parent6.declare('x', 10);
const child6 = parent6.createChild();
child6.declare('x', 100);
assert(child6.lookup('x') === 100, 'createScope: child shadows parent (child sees 100)');
assert(parent6.lookup('x') === 10, 'createScope: parent unchanged after shadow (parent sees 10)');

// Test 7: createScope - assign to parent scope variable
const parent7 = createScope();
parent7.declare('x', 10);
const child7 = parent7.createChild();
child7.assign('x', 20);
assert(parent7.lookup('x') === 20, 'createScope: child assigns to parent scope');

// Test 8: analyzeScopes - identify global variables
const code8 = `
    let x = 1;
    const y = 2;
    var z = 3;
`;
const result8 = analyzeScopes(code8);
assert(
    result8.global && result8.global.includes('x') && result8.global.includes('y'),
    'analyzeScopes: identifies global variables'
);

// Test 9: analyzeScopes - identify function scopes
const code9 = `
    function foo() {
        let a = 1;
    }
`;
const result9 = analyzeScopes(code9);
assert(
    result9.functions && result9.functions.length >= 1,
    'analyzeScopes: identifies function scopes'
);

// Test 10: createSandbox - allow access to specified globals
const sandbox10 = createSandbox(['Math']);
const result10 = sandbox10('Math.sqrt(16)');
assert(result10 === 4, 'createSandbox: allows access to specified globals');

// Test 11: createSandbox - block non-allowed globals
const sandbox11 = createSandbox([]);
let blocked11 = false;
try {
    sandbox11('console.log("hi")');
} catch (e) {
    blocked11 = true;
}
assert(blocked11, 'createSandbox: blocks access to non-allowed globals');

// Test 12: demonstrateShadowing
const shadowResult = demonstrateShadowing();
assert(
    shadowResult.outer !== shadowResult.inner,
    'demonstrateShadowing: outer and inner have different values'
);

// Test 13: demonstrateTDZ
const tdzResult = demonstrateTDZ();
assert(
    tdzResult.errorType === 'ReferenceError',
    'demonstrateTDZ: shows TDZ causes ReferenceError'
);
assert(
    tdzResult.afterDeclaration !== undefined,
    'demonstrateTDZ: value accessible after declaration'
);

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
