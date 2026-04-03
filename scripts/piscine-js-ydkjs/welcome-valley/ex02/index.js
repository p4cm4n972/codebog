/**
 * Ex02 - Primitive Types
 * Les 7 types primitifs de JavaScript
 */

/**
 * String type et template literals
 * @returns {[string, string]}
 */
export function stringType() {
  // TODO: Crée greeting = "Hello" et template = `Value: ${42}`
  // Retourne [typeof greeting, template]
  return undefined;
}

/**
 * Tous les nombres sont de type "number"
 * @returns {[string, string, string]}
 */
export function numberType() {
  // TODO: Retourne [typeof 42, typeof 3.14, typeof NaN]
  return undefined;
}

/**
 * Boolean type
 * @returns {string}
 */
export function booleanType() {
  // TODO: Retourne typeof true
  return undefined;
}

/**
 * null vs undefined - attention au piège !
 * @returns {[string, string]}
 */
export function nullAndUndefined() {
  // TODO: Retourne [typeof undefined, typeof null]
  // Hint: typeof null a une valeur surprenante...
  return undefined;
}

/**
 * Symbol - nouveau type ES6
 * @returns {string}
 */
export function symbolType() {
  // TODO: Crée const sym = Symbol("description")
  // Retourne typeof sym
  return undefined;
}

/**
 * BigInt - pour les très grands nombres
 * @returns {string}
 */
export function bigIntType() {
  // TODO: Crée const big = 9007199254740991n
  // Retourne typeof big
  return undefined;
}

/**
 * Liste tous les types primitifs
 * @returns {string[]}
 */
export function allPrimitives() {
  // TODO: Retourne un tableau avec les 7 types primitifs
  // ["string", "number", "boolean", "undefined", "null", "symbol", "bigint"]
  return undefined;
}
