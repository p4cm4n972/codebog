/**
 * Ex06 - Promise Combinators
 * Promise.all, race, any, allSettled
 */

/**
 * Promise.all succès
 * @returns {Promise<number[]>}
 */
export async function all1() {
  // TODO: Retourne Promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)])
  return undefined;
}

/**
 * Promise.all avec erreur
 * @returns {Promise<string>}
 */
export async function all2() {
  try {
    return await Promise.all([
      Promise.resolve(1),
      Promise.reject("error"),
      Promise.resolve(3)
    ]);
  } catch (e) {
    // TODO: Retourne `caught: ${e}`
    return undefined;
  }
}

/**
 * Promise.race
 * @returns {Promise<string>}
 */
export async function race1() {
  // TODO: Retourne Promise.race avec "slow" (100ms) et "fast" (10ms)
  return undefined;
}

/**
 * Promise.any
 * @returns {Promise<string>}
 */
export async function any1() {
  // TODO: Retourne Promise.any([reject, resolve, reject])
  return undefined;
}

/**
 * Promise.allSettled
 * @returns {Promise<PromiseSettledResult<number>[]>}
 */
export async function settled1() {
  // TODO: Retourne Promise.allSettled([resolve(1), reject("error"), resolve(3)])
  return undefined;
}
