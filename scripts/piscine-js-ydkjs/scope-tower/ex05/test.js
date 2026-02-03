// Note: Functions are expected to be defined by user code
// (explainDynamicScopeDangers, safeAlternatives, safeDispatch)

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

console.log('Testing Ex05 - Dynamic Scope Dangers...\n');

assert(dangers.length === 5, 'should return an array with 5 dangers');
assert(dangers[0] === 'Injection de code malveillant possible', 'should list injection as first danger');
assert(dangers[1] === 'Modification imprévue du scope parent', 'should list scope modification');
assert(dangers[2] === 'Performance dégradée (pas d\'optimisation par le moteur, 'should list performance issues');
assert(dangers[3] === 'Code difficile à analyser et débugger', 'should list debugging difficulties');
assert(dangers[4] === 'Impossible à typer statiquement', 'should list typing issues');
assert(Object.keys(alternatives).length === 4, 'should return an object with 4 alternatives');
assert(alternatives['parser JSON'] === 'JSON.parse(, 'should recommend JSON.parse for JSON parsing');
assert(alternatives['templates'] === 'Template literals ou moteur de template', 'should recommend template literals for templates');
assert(alternatives['configuration'] === 'Objets/Maps avec clés prédéfinies', 'should recommend Maps for configuration');
assert(alternatives['dispatch dynamique'] === 'Pattern Strategy avec Map de fonctions', 'should recommend Strategy pattern for dynamic dispatch');
assert(safeDispatch() === 8, 'should return 8 (5 + 3)');
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

// process.exit not available in sandbox
