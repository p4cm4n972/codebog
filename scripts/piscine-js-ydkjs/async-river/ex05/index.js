/**
 * Ex05 - Error Propagation
 * try/catch avec async/await
 */

/**
 * try/catch avec await
 * @returns {Promise<string>}
 */
export async function error1() {
  try {
    await Promise.reject("error");
    return "no error";
  } catch (e) {
    // TODO: Retourne `caught: ${e}`
    return undefined;
  }
}

/**
 * Promise rejetée stockée
 * @returns {Promise<string>}
 */
export async function error2() {
  const p = Promise.reject("error");

  try {
    const result = await p;
    return result;
  } catch (e) {
    // TODO: Retourne `caught: ${e}`
    return undefined;
  }
}

/**
 * throw dans async function
 * @returns {Promise<string>}
 */
export async function error3() {
  async function failing() {
    throw new Error("oops");
  }

  try {
    await failing();
    return "ok";
  } catch (e) {
    // TODO: Retourne e.message
    return undefined;
  }
}

/**
 * Erreur qui remonte
 * @returns {Promise<string>}
 */
export async function error4() {
  async function outer() {
    async function inner() {
      throw new Error("inner error");
    }
    // Pas de try/catch ici
    await inner();
  }

  try {
    await outer();
    return "ok";
  } catch (e) {
    // TODO: Retourne e.message
    return undefined;
  }
}
