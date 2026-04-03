/**
 * Ex07 - Async Iteration
 * for await...of, async generators
 */

/**
 * for await sur tableau de Promises
 * @returns {Promise<number[]>}
 */
export async function asyncIter1() {
  const result = [];

  const asyncArray = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3)
  ];

  for await (const val of asyncArray) {
    result.push(val);
  }

  // TODO: Retourne result
  return undefined;
}

/**
 * Async generator
 * @returns {Promise<number[]>}
 */
export async function asyncIter2() {
  async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  }

  const result = [];
  for await (const val of asyncGenerator()) {
    result.push(val);
  }
  // TODO: Retourne result
  return undefined;
}

/**
 * Countdown async
 * @returns {Promise<number[]>}
 */
export async function asyncIter3() {
  async function* countdown(n) {
    while (n > 0) {
      yield n--;
      await new Promise(r => setTimeout(r, 10));
    }
  }

  const result = [];
  for await (const val of countdown(3)) {
    result.push(val);
  }
  // TODO: Retourne result
  return undefined;
}
