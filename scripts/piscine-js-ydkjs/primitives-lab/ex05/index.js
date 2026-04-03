/**
 * Ex05 - Boxing & Unboxing
 * Comprendre l'auto-boxing et les primitive wrappers
 */

/**
 * Type d'un primitif boxé
 * @returns {string}
 */
export function box1() {
  const temp = Object("hello");
  // TODO: Retourne typeof temp
  return undefined;
}

/**
 * Ajouter une propriété à un primitif
 * @returns {undefined}
 */
export function box2() {
  const str = "hello";
  str.custom = "test";
  // TODO: Retourne str.custom
  return undefined;
}

/**
 * Ajouter une propriété à un wrapper object
 * @returns {string}
 */
export function box3() {
  const strObj = new String("hello");
  strObj.custom = "test";
  // TODO: Retourne strObj.custom
  return undefined;
}

/**
 * typeof new Number(42)
 * @returns {string}
 */
export function box4() {
  // TODO: Retourne typeof new Number(42)
  return undefined;
}

/**
 * new Number(42) === 42
 * @returns {boolean}
 */
export function box5() {
  // TODO: Retourne new Number(42) === 42
  return undefined;
}

/**
 * new Number(42) == 42
 * @returns {boolean}
 */
export function box6() {
  // TODO: Retourne new Number(42) == 42
  return undefined;
}
