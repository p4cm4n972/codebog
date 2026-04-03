/**
 * Ex01 - Property Lookup
 * Remonter la chaîne pour trouver une propriété
 */

/**
 * Propriété héritée simple
 * @returns {number}
 */
export function lookup1() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  // TODO: Retourne child.x
  return undefined;
}

/**
 * Chaîne à 3 niveaux
 * @returns {number}
 */
export function lookup2() {
  const grandparent = { x: 1 };
  const parent = Object.create(grandparent);
  const child = Object.create(parent);
  // TODO: Retourne child.x
  return undefined;
}

/**
 * Propriété propre vs héritée
 * @returns {[number, number, undefined]}
 */
export function lookup3() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  child.y = 2;
  // TODO: Retourne [child.x, child.y, parent.y]
  return undefined;
}

/**
 * hasOwnProperty vs in
 * @returns {[boolean, boolean]}
 */
export function lookup4() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  // TODO: Retourne [child.hasOwnProperty("x"), "x" in child]
  return undefined;
}
