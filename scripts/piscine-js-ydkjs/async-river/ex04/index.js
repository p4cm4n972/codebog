/**
 * Ex04 - Promise Chaining
 * then/catch/finally flow
 */

/**
 * Chaînage simple
 * @returns {Promise<number>}
 */
export async function chain1() {
  // TODO: Retourne Promise.resolve(1).then(x => x + 1).then(x => x * 2).then(x => x + 3)
  return undefined;
}

/**
 * Erreur et catch
 * @returns {Promise<string>}
 */
export async function chain2() {
  // TODO: Retourne le chaînage avec throw et catch
  return undefined;
}

/**
 * finally ne modifie pas la valeur
 * @returns {Promise<string[]>}
 */
export async function chain3() {
  const result = [];

  await Promise.resolve()
    .then(() => result.push("then 1"))
    .then(() => result.push("then 2"))
    .finally(() => result.push("finally"))
    .then(() => result.push("then 3"));

  // TODO: Retourne result
  return undefined;
}

/**
 * Erreur dans catch
 * @returns {Promise<string>}
 */
export async function chain4() {
  // TODO: Retourne Promise.reject("error").catch(e => { throw new Error("new error"); }).catch(e => e.message)
  return undefined;
}
