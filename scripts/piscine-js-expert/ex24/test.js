// Note: Functions are expected to be defined by user code
// (createMockWorker, createInlineWorker, createWorkerPool, parallelize, createMutex, createAtomicCounter, createPriorityTaskQueue, transferToWorker)

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
    console.log('Testing Web Workers & Concurrency...\n');

    // Test 1: createMockWorker - simulates message passing
    const worker1 = createMockWorker((data) => data * 2);
    const result1 = await new Promise((resolve) => {
        worker1.onmessage = (e) => resolve(e.data);
        worker1.postMessage(5);
    });
    assert(result1 === 10, 'createMockWorker: processes messages');

    // Test 2: createMockWorker - handles async functions
    const worker2 = createMockWorker(async (data) => {
        await new Promise(r => setTimeout(r, 10));
        return data.map(x => x * 2);
    });
    const result2 = await new Promise((resolve) => {
        worker2.onmessage = (e) => resolve(e.data);
        worker2.postMessage([1, 2, 3]);
    });
    assert(JSON.stringify(result2) === JSON.stringify([2, 4, 6]), 'createMockWorker: handles async');

    // Test 3: parallelize - processes chunks in parallel
    const fn3 = (chunk) => chunk.reduce((a, b) => a + b, 0);
    const chunks3 = [[1, 2], [3, 4], [5, 6]];
    const results3 = await parallelize(fn3, chunks3);
    assert(JSON.stringify(results3) === JSON.stringify([3, 7, 11]), 'parallelize: processes chunks');

    // Test 4: createMutex - lock/unlock
    const buffer4 = new SharedArrayBuffer(4);
    const array4 = new Int32Array(buffer4);
    const mutex4 = createMutex(array4, 0);
    mutex4.lock();
    let lockThrown = false;
    try {
        mutex4.lock();
    } catch (e) {
        lockThrown = true;
    }
    assert(lockThrown, 'createMutex: throws on double lock');
    mutex4.unlock();
    let unlockSuccess = false;
    try {
        mutex4.lock();
        unlockSuccess = true;
        mutex4.unlock();
    } catch (e) {
        // Failed
    }
    assert(unlockSuccess, 'createMutex: can lock after unlock');

    // Test 5: createMutex - withLock
    const buffer5 = new SharedArrayBuffer(4);
    const array5 = new Int32Array(buffer5);
    const mutex5 = createMutex(array5, 0);
    let executed5 = false;
    mutex5.withLock(() => {
        executed5 = true;
    });
    assert(executed5, 'createMutex: withLock executes');

    // Test 6: createAtomicCounter - increment
    const buffer6 = new SharedArrayBuffer(4);
    const counter6 = createAtomicCounter(buffer6);
    assert(counter6.get() === 0, 'createAtomicCounter: starts at 0');
    counter6.increment();
    counter6.increment();
    assert(counter6.get() === 2, 'createAtomicCounter: increments');

    // Test 7: createAtomicCounter - decrement
    const buffer7 = new SharedArrayBuffer(4);
    const counter7 = createAtomicCounter(buffer7);
    counter7.increment();
    counter7.increment();
    counter7.decrement();
    assert(counter7.get() === 1, 'createAtomicCounter: decrements');

    // Test 8: createAtomicCounter - reset
    const buffer8 = new SharedArrayBuffer(4);
    const counter8 = createAtomicCounter(buffer8);
    counter8.increment();
    counter8.increment();
    counter8.reset();
    assert(counter8.get() === 0, 'createAtomicCounter: resets');

    // Test 9: transferToWorker - transfers buffer
    const worker9 = createMockWorker((data) => {
        const arr = new Uint8Array(data.buffer);
        return arr.length;
    });
    const buffer9 = new ArrayBuffer(100);
    const result9 = await transferToWorker(worker9, buffer9);
    assert(result9 === 100, 'transferToWorker: transfers and processes');
    assert(buffer9.byteLength === 0, 'transferToWorker: original buffer detached');

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
