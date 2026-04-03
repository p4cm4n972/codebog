// Note: Functions are expected to be defined by user code
// (nextTick, defer, createTaskScheduler, runSequentially)

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
    console.log('Testing Event Loop & Microtasks...\n');

    // Test 1: nextTick - schedules as microtask
    const order1 = [];
    await new Promise(resolve => {
        order1.push('sync start');
        nextTick(() => {
            order1.push('next tick');
            resolve();
        });
        order1.push('sync end');
    });
    assert(
        JSON.stringify(order1) === JSON.stringify(['sync start', 'sync end', 'next tick']),
        'nextTick: schedules callback as microtask'
    );

    // Test 2: nextTick executes before setTimeout
    const order2 = [];
    await new Promise(resolve => {
        setTimeout(() => {
            order2.push('timeout');
            resolve();
        }, 0);
        nextTick(() => order2.push('tick'));
    });
    assert(order2[0] === 'tick', 'nextTick: executes before setTimeout');

    // Test 3: defer - schedules as macrotask
    const order3 = [];
    await new Promise(resolve => {
        Promise.resolve().then(() => order3.push('microtask'));
        defer(() => {
            order3.push('deferred');
            resolve();
        });
    });
    assert(
        JSON.stringify(order3) === JSON.stringify(['microtask', 'deferred']),
        'defer: schedules as macrotask (after microtasks)'
    );

    // Test 4: createTaskScheduler - priority ordering
    const scheduler = createTaskScheduler();
    const order4 = [];

    await new Promise(resolve => {
        scheduler.scheduleLow(() => order4.push('low'));
        scheduler.schedule(() => order4.push('normal'));
        scheduler.scheduleHigh(() => order4.push('high'));

        // Wait for all tasks to complete
        setTimeout(() => resolve(), 50);
    });

    assert(
        order4[0] === 'high' && order4[1] === 'normal' && order4[2] === 'low',
        'createTaskScheduler: executes high priority first'
    );

    // Test 5: createTaskScheduler - tracks pending count
    const scheduler2 = createTaskScheduler();
    let taskRan = false;
    scheduler2.schedule(() => { taskRan = true; });
    const pendingBefore = scheduler2.pendingCount;

    await new Promise(resolve => setTimeout(resolve, 50));

    assert(pendingBefore >= 0, 'createTaskScheduler: has pendingCount property');

    // Test 6: runSequentially - runs in order
    const order6 = [];
    const fns6 = [
        async () => { order6.push(1); return 'a'; },
        async () => { order6.push(2); return 'b'; },
        async () => { order6.push(3); return 'c'; }
    ];

    const results6 = await runSequentially(fns6);

    assert(
        JSON.stringify(order6) === JSON.stringify([1, 2, 3]),
        'runSequentially: runs functions in order'
    );
    assert(
        JSON.stringify(results6) === JSON.stringify(['a', 'b', 'c']),
        'runSequentially: returns results in order'
    );

    // Test 7: runSequentially - not parallel
    let concurrent = 0;
    let maxConcurrent = 0;

    const fns7 = [1, 2, 3].map(() => async () => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        await new Promise(r => setTimeout(r, 20));
        concurrent--;
        return 'done';
    });

    await runSequentially(fns7);
    assert(maxConcurrent === 1, 'runSequentially: runs sequentially, not in parallel');

    // Test 8: Event loop order quiz
    // Sync → Microtasks → Macrotasks
    const quiz1 = [];
    await new Promise(resolve => {
        quiz1.push('1');
        setTimeout(() => quiz1.push('2'), 0);
        Promise.resolve().then(() => quiz1.push('3'));
        quiz1.push('4');
        setTimeout(() => resolve(), 10);
    });
    assert(
        quiz1[0] === '1' && quiz1[1] === '4' && quiz1[2] === '3' && quiz1[3] === '2',
        'Event loop: sync → microtask → macrotask (1, 4, 3, 2)'
    );

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

runTests();
