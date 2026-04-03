/**
 * Ex03 - Promise States
 * pending, fulfilled, rejected
 */

/**
 * Promise pending
 * @returns {string}
 */
export function state1() {
  const p = new Promise((resolve) => {
    // Ne jamais résoudre
    void resolve;
  });
  void p;
  // TODO: Retourne "pending"
  return undefined;
}

/**
 * Multiples résolutions - retourne la Promise
 * @returns {Promise<string>}
 */
export function state2() {
  const p = new Promise((resolve, reject) => {
    resolve("first");
    resolve("second");
    reject("error");
  });
  // TODO: Retourne p
  return undefined;
}

/**
 * Seule la première compte
 * @returns {Promise<string>}
 */
export async function state3() {
  const p = new Promise((resolve) => {
    resolve("first");
    resolve("second");
  });
  // TODO: Retourne await p
  return undefined;
}

/**
 * Promise.resolve
 * @returns {Promise<number>}
 */
export function state4() {
  // TODO: Retourne Promise.resolve(42)
  return undefined;
}

/**
 * Promise.reject avec catch
 * @returns {Promise<string>}
 */
export function state5() {
  // TODO: Retourne Promise.reject("error").catch(e => `caught: ${e}`)
  return undefined;
}
