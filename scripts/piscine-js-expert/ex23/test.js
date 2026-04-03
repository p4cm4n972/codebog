// Note: Functions are expected to be defined by user code
// (createMemoryMonitor, createLeakDetector, createLRUCache, Resource, using, createMetadataManager, createStringPool, hasCircularReference)

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

async function runTests() {
    console.log('Testing Memory Management...\n');

    // Test 1: createMemoryMonitor - provides snapshot
    const monitor1 = createMemoryMonitor();
    const snapshot1 = monitor1.snapshot();
    assert(typeof snapshot1.timestamp === 'number', 'createMemoryMonitor: snapshot has timestamp');
    assert(typeof snapshot1.heapUsed === 'number', 'createMemoryMonitor: snapshot has heapUsed');

    // Test 2: createMemoryMonitor - compares snapshots
    const monitor2 = createMemoryMonitor();
    const snap2a = { timestamp: 0, heapUsed: 1000 };
    const snap2b = { timestamp: 100, heapUsed: 2000 };
    const diff2 = monitor2.compare(snap2a, snap2b);
    assert(diff2.heapDiff === 1000, 'createMemoryMonitor: compare works');

    // Test 3: createLRUCache - store and retrieve
    const cache3 = createLRUCache(3);
    cache3.set('a', 1);
    cache3.set('b', 2);
    assert(cache3.get('a') === 1, 'createLRUCache: get returns value');
    assert(cache3.get('b') === 2, 'createLRUCache: get returns another value');

    // Test 4: createLRUCache - evicts least recently used
    const cache4 = createLRUCache(2);
    cache4.set('a', 1);
    cache4.set('b', 2);
    cache4.get('a');
    cache4.set('c', 3);
    assert(cache4.has('a') === true, 'createLRUCache: keeps recently used');
    assert(cache4.has('b') === false, 'createLRUCache: evicts LRU');
    assert(cache4.has('c') === true, 'createLRUCache: keeps newest');

    // Test 5: createLRUCache - updates order on get
    const cache5 = createLRUCache(2);
    cache5.set('a', 1);
    cache5.set('b', 2);
    cache5.get('a');
    cache5.set('c', 3);
    assert(cache5.get('a') === 1, 'createLRUCache: a is still cached');
    assert(cache5.get('b') === undefined, 'createLRUCache: b was evicted');

    // Test 6: Resource - usable when not disposed
    const resource6 = new Resource();
    let useThrown6 = false;
    try {
        resource6.use();
    } catch (e) {
        useThrown6 = true;
    }
    assert(useThrown6 === false, 'Resource: usable when not disposed');

    // Test 7: Resource - throws after dispose
    const resource7 = new Resource();
    resource7.dispose();
    let disposeThrown7 = false;
    try {
        resource7.use();
    } catch (e) {
        disposeThrown7 = true;
    }
    assert(disposeThrown7, 'Resource: throws after dispose');

    // Test 8: Resource - reports disposed state
    const resource8 = new Resource();
    assert(resource8.isDisposed === false, 'Resource: isDisposed false initially');
    resource8.dispose();
    assert(resource8.isDisposed === true, 'Resource: isDisposed true after dispose');

    // Test 9: using - auto-dispose after use
    const resource9 = new Resource();
    await using(resource9, (res) => {
        assert(res.isDisposed === false, 'using: not disposed during use');
        return res.use();
    });
    assert(resource9.isDisposed === true, 'using: disposed after use');

    // Test 10: using - dispose even on error
    const resource10 = new Resource();
    try {
        await using(resource10, () => {
            throw new Error('test');
        });
    } catch (e) {
        // Expected
    }
    assert(resource10.isDisposed === true, 'using: disposed even on error');

    // Test 11: createMetadataManager - stores metadata
    const manager11 = createMetadataManager();
    const obj11 = { id: 1 };
    manager11.setMetadata(obj11, { created: Date.now() });
    assert(manager11.getMetadata(obj11).created !== undefined, 'createMetadataManager: stores metadata');

    // Test 12: createMetadataManager - hasMetadata
    const manager12 = createMetadataManager();
    const obj12 = { id: 1 };
    manager12.setMetadata(obj12, { data: 'test' });
    assert(manager12.hasMetadata(obj12) === true, 'createMetadataManager: hasMetadata true');

    // Test 13: createStringPool - interns strings
    const pool13 = createStringPool();
    const s13a = pool13.intern('hello');
    const s13b = pool13.intern('hello');
    assert(s13a === s13b, 'createStringPool: interns strings');

    // Test 14: createStringPool - tracks stats
    const pool14 = createStringPool();
    pool14.intern('a');
    pool14.intern('b');
    pool14.intern('a');
    const stats14 = pool14.stats;
    assert(stats14.size === 2, 'createStringPool: tracks size');
    assert(stats14.hits === 1, 'createStringPool: tracks hits');

    // Test 15: hasCircularReference - detects direct circular
    const obj15 = { a: 1 };
    obj15.self = obj15;
    assert(hasCircularReference(obj15) === true, 'hasCircularReference: detects direct circular');

    // Test 16: hasCircularReference - detects indirect circular
    const a16 = { name: 'a' };
    const b16 = { name: 'b', ref: a16 };
    a16.ref = b16;
    assert(hasCircularReference(a16) === true, 'hasCircularReference: detects indirect circular');

    // Test 17: hasCircularReference - false for non-circular
    const obj17 = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3]
    };
    assert(hasCircularReference(obj17) === false, 'hasCircularReference: false for non-circular');

    // Test 18: hasCircularReference - handles arrays
    const arr18 = [1, 2];
    arr18.push(arr18);
    assert(hasCircularReference(arr18) === true, 'hasCircularReference: detects in arrays');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
