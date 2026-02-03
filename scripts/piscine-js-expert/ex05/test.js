// Note: Functions are expected to be defined by user code

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
    console.log('Testing MyPromise...\n');

    // Test 1: Basic resolve
    await new Promise(resolve => {
        new MyPromise((res) => res(42))
            .then(value => {
                assert(value === 42, 'basic: resolves with value 42');
                resolve();
            });
    });

    // Test 2: Basic reject
    await new Promise(resolve => {
        new MyPromise((res, rej) => rej('error'))
            .catch(reason => {
                assert(reason === 'error', 'basic: rejects with reason');
                resolve();
            });
    });

    // Test 3: Chaining
    await new Promise(resolve => {
        new MyPromise((res) => res(5))
            .then(x => x * 2)
            .then(x => x + 3)
            .then(x => {
                assert(x === 13, 'chaining: (5 * 2) + 3 = 13');
                resolve();
            });
    });

    // Test 4: Chaining with promise
    await new Promise(resolve => {
        new MyPromise((res) => res(10))
            .then(x => new MyPromise(res => setTimeout(() => res(x * 2), 10)))
            .then(x => {
                assert(x === 20, 'chaining: works with nested promise');
                resolve();
            });
    });

    // Test 5: Error propagation
    await new Promise(resolve => {
        new MyPromise((res) => res(5))
            .then(x => { throw new Error('oops'); })
            .then(x => assert(false, 'error: should not reach here'))
            .catch(err => {
                assert(err.message === 'oops', 'error: propagates through chain');
                resolve();
            });
    });

    // Test 6: Async resolve
    await new Promise(resolve => {
        new MyPromise((res) => {
            setTimeout(() => res('async'), 50);
        }).then(value => {
            assert(value === 'async', 'async: resolves after timeout');
            resolve();
        });
    });

    // Test 7: MyPromise.resolve
    await new Promise(resolve => {
        MyPromise.resolve(100)
            .then(value => {
                assert(value === 100, 'MyPromise.resolve: creates resolved promise');
                resolve();
            });
    });

    // Test 8: MyPromise.reject
    await new Promise(resolve => {
        MyPromise.reject('fail')
            .catch(reason => {
                assert(reason === 'fail', 'MyPromise.reject: creates rejected promise');
                resolve();
            });
    });

    // Test 9: MyPromise.all - success
    await new Promise(resolve => {
        MyPromise.all([
            MyPromise.resolve(1),
            MyPromise.resolve(2),
            MyPromise.resolve(3)
        ]).then(values => {
            assert(
                JSON.stringify(values) === JSON.stringify([1, 2, 3]),
                'MyPromise.all: resolves with array of values'
            );
            resolve();
        });
    });

    // Test 10: MyPromise.all - with one rejection
    await new Promise(resolve => {
        MyPromise.all([
            MyPromise.resolve(1),
            MyPromise.reject('error'),
            MyPromise.resolve(3)
        ]).catch(reason => {
            assert(reason === 'error', 'MyPromise.all: rejects if one rejects');
            resolve();
        });
    });

    // Test 11: MyPromise.race - fastest wins
    await new Promise(resolve => {
        MyPromise.race([
            new MyPromise(res => setTimeout(() => res('slow'), 100)),
            new MyPromise(res => setTimeout(() => res('fast'), 10))
        ]).then(value => {
            assert(value === 'fast', 'MyPromise.race: fastest promise wins');
            resolve();
        });
    });

    // Test 12: MyPromise.allSettled
    await new Promise(resolve => {
        MyPromise.allSettled([
            MyPromise.resolve(1),
            MyPromise.reject('error'),
            MyPromise.resolve(3)
        ]).then(results => {
            assert(results.length === 3, 'MyPromise.allSettled: returns all results');
            assert(results[0].status === 'fulfilled', 'MyPromise.allSettled: first fulfilled');
            assert(results[1].status === 'rejected', 'MyPromise.allSettled: second rejected');
            resolve();
        });
    });

    // Test 13: finally - on success
    let finallyCalled = false;
    await new Promise(resolve => {
        MyPromise.resolve(42)
            .finally(() => { finallyCalled = true; })
            .then(value => {
                assert(finallyCalled && value === 42, 'finally: called on success, value preserved');
                resolve();
            });
    });

    // Test 14: finally - on error
    finallyCalled = false;
    await new Promise(resolve => {
        MyPromise.reject('error')
            .finally(() => { finallyCalled = true; })
            .catch(reason => {
                assert(finallyCalled && reason === 'error', 'finally: called on error, reason preserved');
                resolve();
            });
    });

    // Test 15: State immutability
    await new Promise(resolve => {
        const p = new MyPromise((res, rej) => {
            res(1);
            res(2);  // Should be ignored
            rej(3);  // Should be ignored
        });
        p.then(value => {
            assert(value === 1, 'immutability: promise can only resolve once');
            resolve();
        });
    });

    // Test 16: Executor error handling
    await new Promise(resolve => {
        new MyPromise(() => {
            throw new Error('executor error');
        }).catch(err => {
            assert(err.message === 'executor error', 'executor: errors are caught and rejected');
            resolve();
        });
    });

    // Test 17: Multiple then on same promise
    await new Promise(resolve => {
        const p = MyPromise.resolve(10);
        let count = 0;
        p.then(v => { count++; });
        p.then(v => { count++; });
        p.then(v => {
            count++;
            setTimeout(() => {
                assert(count === 3, 'multiple then: all handlers called');
                resolve();
            }, 10);
        });
    });

    // Test 18: Catch doesn't catch subsequent errors
    await new Promise(resolve => {
        MyPromise.reject('first error')
            .catch(err => {
                throw new Error('second error');
            })
            .catch(err => {
                assert(err.message === 'second error', 'catch: propagates new errors');
                resolve();
            });
    });

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));

    // process.exit not available in sandbox
}

runTests();
