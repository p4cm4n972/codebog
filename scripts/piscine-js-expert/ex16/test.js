// Note: Functions are expected to be defined by user code
// (Singleton, Database, createUser, createUIFactory, createObservable, validators, createValidator, withLogging, withTiming, readonly)

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

console.log('Testing Design Patterns OOP...\n');

// Test 1: Singleton - same instance
const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
assert(s1 === s2, 'Singleton: returns same instance');

// Test 2: Singleton - share state
const s3 = Singleton.getInstance();
s3.add('item');
const s4 = Singleton.getInstance();
assert(s4.getAll().includes('item'), 'Singleton: shares state between calls');

// Test 3: Database Singleton - same instance
const db1 = new Database();
const db2 = new Database();
assert(db1 === db2, 'Database: returns same instance');

// Test 4: Database - share connection
const db3 = new Database();
db3.connect('postgres://localhost');
const db4 = new Database();
assert(db4.isConnected() === true, 'Database: shares connection state');

// Test 5: createUser - admin with all permissions
const admin = createUser('admin', { name: 'Alice' });
assert(admin.role === 'admin', 'createUser: admin role');
assert(admin.permissions.includes('delete'), 'createUser: admin has delete permission');

// Test 6: createUser - editor with read/write
const editor = createUser('editor', { name: 'Bob' });
assert(editor.role === 'editor', 'createUser: editor role');
assert(editor.permissions.includes('write'), 'createUser: editor has write');
assert(!editor.permissions.includes('delete'), 'createUser: editor has no delete');

// Test 7: createUser - viewer with read only
const viewer = createUser('viewer', { name: 'Charlie' });
assert(viewer.role === 'viewer', 'createUser: viewer role');
assert(JSON.stringify(viewer.permissions) === JSON.stringify(['read']), 'createUser: viewer read only');

// Test 8: createUser - throw on unknown type
let unknownThrown = false;
try {
    createUser('superuser', {});
} catch (e) {
    unknownThrown = true;
}
assert(unknownThrown, 'createUser: throws on unknown type');

// Test 9: createUIFactory - dark theme
const darkUI = createUIFactory('dark');
const darkButton = darkUI.createButton('Click');
assert(darkButton.bg === '#333', 'createUIFactory: dark button bg');
assert(darkButton.color === '#fff', 'createUIFactory: dark button color');

// Test 10: createUIFactory - light theme
const lightUI = createUIFactory('light');
const lightButton = lightUI.createButton('Click');
assert(lightButton.bg === '#fff', 'createUIFactory: light button bg');
assert(lightButton.color === '#333', 'createUIFactory: light button color');

// Test 11: createObservable - notify on change
let notified11 = false;
let oldVal11 = null;
let newVal11 = null;
const counter11 = createObservable(0);
counter11.subscribe((newV, oldV) => {
    notified11 = true;
    newVal11 = newV;
    oldVal11 = oldV;
});
counter11.value = 1;
assert(notified11 && newVal11 === 1 && oldVal11 === 0, 'createObservable: notifies on change');

// Test 12: createObservable - unsubscribe
let called12 = false;
const counter12 = createObservable(0);
const unsub12 = counter12.subscribe(() => { called12 = true; });
unsub12();
counter12.value = 1;
assert(called12 === false, 'createObservable: unsubscribe works');

// Test 13: validators - required
assert(validators.required('value') === true, 'validators.required: true for value');
assert(validators.required('') === false, 'validators.required: false for empty');
assert(validators.required(null) === false, 'validators.required: false for null');

// Test 14: validators - email
assert(validators.email('test@example.com') === true, 'validators.email: valid email');
assert(validators.email('invalid') === false, 'validators.email: invalid email');

// Test 15: validators - minLength
const min5 = validators.minLength(5);
assert(min5('hello') === true, 'validators.minLength: passes for hello');
assert(min5('hi') === false, 'validators.minLength: fails for hi');

// Test 16: createValidator - multiple rules
const emailValidator = createValidator({
    required: validators.required,
    email: validators.email
});
const valid16 = emailValidator('test@example.com');
assert(valid16.valid === true && valid16.errors.length === 0, 'createValidator: valid email passes');

const invalid16 = emailValidator('invalid');
assert(invalid16.valid === false && invalid16.errors.includes('email'), 'createValidator: invalid email fails');

// Test 17: readonly - prevent modifications
const config17 = readonly({ apiUrl: 'https://api.example.com' });
assert(config17.apiUrl === 'https://api.example.com', 'readonly: can read');
let modThrown = false;
try {
    config17.apiUrl = 'other';
} catch (e) {
    modThrown = true;
}
assert(modThrown, 'readonly: prevents modifications');

// Test 18: readonly - prevent deletions
const config18 = readonly({ key: 'value' });
let delThrown = false;
try {
    delete config18.key;
} catch (e) {
    delThrown = true;
}
assert(delThrown, 'readonly: prevents deletions');

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));
