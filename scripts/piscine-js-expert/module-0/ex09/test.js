// Note: Functions are expected to be defined by user code
// (greet, formatPrice, createHTMLCard, createURL, taggedTemplate)

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

console.log('\n🧪 Testing ex09 - Template Literals\n');

test('greet: should return greeting message', () => {
    const result = greet("Alice");
    assert(result === "Hello, Alice! Welcome to JavaScript.", 'Expected greeting message');
});

test('formatPrice: should format product and price', () => {
    const result = formatPrice("Laptop", 999.99);
    assert(result === "Product: Laptop - Price: $999.99", 'Expected formatted price');
});

test('createHTMLCard: should create multi-line HTML card', () => {
    const result = createHTMLCard("Alice", 25, "Paris");
    const expected = `<div class="card">
  <h2>Alice</h2>
  <p>Age: 25</p>
  <p>City: Paris</p>
</div>`;
    assert(result === expected, 'Expected HTML card structure');
});

test('createURL: should create URL with query params', () => {
    const result = createURL("https://api.example.com/users", {id: 123, filter: "active"});
    // Note: order might vary, so check both possibilities
    const valid1 = "https://api.example.com/users?id=123&filter=active";
    const valid2 = "https://api.example.com/users?filter=active&id=123";
    assert(result === valid1 || result === valid2, 'Expected URL with query params');
});

test('createURL: should handle empty params', () => {
    const result = createURL("https://api.example.com/users", {});
    assert(result === "https://api.example.com/users?", 'Expected base URL with ?');
});

test('taggedTemplate: should uppercase interpolated values', () => {
    const result = taggedTemplate`Hello ${"world"}! Welcome to ${"javascript"}.`;
    assert(result === "Hello WORLD! Welcome to JAVASCRIPT.", 'Expected uppercased values');
});

test('taggedTemplate: should work with numbers', () => {
    const result = taggedTemplate`Number: ${42}`;
    assert(result === "Number: 42", 'Expected number preserved');
});

console.log('\n✨ Tests completed!\n');
