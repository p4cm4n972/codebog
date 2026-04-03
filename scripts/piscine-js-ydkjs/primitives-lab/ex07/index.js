/**
 * Ex07 - BigInt & Symbols
 * Les nouveaux types primitifs ES6+
 */

// === BigInt ===

/**
 * typeof 42n
 * @returns {string}
 */
export function bigint1() {
  // TODO: Retourne typeof 42n
  return undefined;
}

/**
 * 42n === 42
 * @returns {boolean}
 */
export function bigint2() {
  // TODO: Retourne 42n === 42
  return undefined;
}

/**
 * 42n == 42
 * @returns {boolean}
 */
export function bigint3() {
  // TODO: Retourne 42n == 42
  return undefined;
}

/**
 * Peut-on mélanger BigInt et Number ?
 * @returns {string}
 */
export function bigint4() {
  // TODO: Retourne "TypeError" si l'opération échoue
  // try { 42n + 1 } catch { return "TypeError" }
  return undefined;
}

// === Symbol ===

/**
 * typeof Symbol("test")
 * @returns {string}
 */
export function symbol1() {
  // TODO: Retourne typeof Symbol("test")
  return undefined;
}

/**
 * Symbol("test") === Symbol("test")
 * @returns {boolean}
 */
export function symbol2() {
  // TODO: Retourne Symbol("test") === Symbol("test")
  return undefined;
}

/**
 * Symbol.for("test") === Symbol.for("test")
 * @returns {boolean}
 */
export function symbol3() {
  // TODO: Retourne Symbol.for("test") === Symbol.for("test")
  return undefined;
}

/**
 * Nombre de clés énumérables (sans les Symbols)
 * @returns {number}
 */
export function symbol4() {
  const sym = Symbol("hidden");
  const obj = { [sym]: "secret", visible: "public" };
  // TODO: Retourne Object.keys(obj).length
  return undefined;
}
