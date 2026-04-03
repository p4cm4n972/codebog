/**
 * Ex09 - Comparisons & Equality
 * Comprendre == vs === et les comparaisons
 */

/**
 * Égalité stricte (===)
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function strictEquality(a, b) {
  // TODO: Retourne a === b
  return undefined;
}

/**
 * Égalité abstraite (==)
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
export function looseEquality(a, b) {
  // TODO: Retourne a == b
  return undefined;
}

/**
 * Compare strict vs loose equality sur plusieurs cas
 * @returns {boolean[]}
 */
export function compareStrictVsLoose() {
  // TODO: Retourne un array avec ces comparaisons:
  // [
  //   5 === "5",           // false
  //   5 == "5",            // true
  //   null === undefined,  // false
  //   null == undefined,   // true
  //   0 === false,         // false
  //   0 == false           // true
  // ]
  return undefined;
}

/**
 * Tous les opérateurs de comparaison
 * @param {number} a
 * @param {number} b
 * @returns {{ equal: boolean, notEqual: boolean, greater: boolean, less: boolean, greaterOrEqual: boolean, lessOrEqual: boolean }}
 */
export function comparisonOperators(a, b) {
  // TODO: Retourne un objet avec:
  // equal: a === b
  // notEqual: a !== b
  // greater: a > b
  // less: a < b
  // greaterOrEqual: a >= b
  // lessOrEqual: a <= b
  return undefined;
}

/**
 * Égalité des objets (par référence)
 * @returns {boolean[]}
 */
export function objectEquality() {
  // TODO: Crée obj = { a: 1 } et arr = [1, 2]
  // Retourne [
  //   { a: 1 } === { a: 1 },  // false (nouvelles références)
  //   obj === obj,             // true (même référence)
  //   [1, 2] === [1, 2],       // false
  //   arr === arr              // true
  // ]
  return undefined;
}

/**
 * Cas spécial de NaN
 * @returns {boolean[]}
 */
export function nanEquality() {
  // TODO: Retourne [
  //   NaN === NaN,       // false (!)
  //   Number.isNaN(NaN)  // true
  // ]
  return undefined;
}
