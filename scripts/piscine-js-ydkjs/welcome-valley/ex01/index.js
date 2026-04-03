/**
 * Ex01 - Variables & Constants
 * Comprendre var, let et const
 */

/**
 * var peut être redéclaré
 * Déclare var x = 1, puis var x = 2, retourne x
 * @returns {number}
 */
export function varTest() {
  // TODO: Déclare var x = 1, puis redéclare var x = 2
  return undefined;
}

/**
 * let peut être réassigné mais pas redéclaré
 * Déclare let y = 1, réassigne y = 2, retourne y
 * @returns {number}
 */
export function letTest() {
  // TODO: Déclare let y = 1, puis réassigne y = 2
  return undefined;
}

/**
 * const ne peut pas être réassigné
 * Déclare const z = 42, retourne z
 * @returns {number}
 */
export function constTest() {
  // TODO: Déclare const z = 42
  return undefined;
}

/**
 * const empêche la réassignation, pas la mutation
 * Crée const obj = { name: "Alice" }, modifie obj.name = "Bob"
 * @returns {string}
 */
export function constObject() {
  // TODO: Crée l'objet et modifie la propriété
  return undefined;
}

/**
 * Conventions de nommage
 * @returns {boolean[]}
 */
export function namingConventions() {
  const firstName = "camelCase pour les variables";
  const CONSTANT_VALUE = "SCREAMING_SNAKE_CASE pour les constantes";

  // TODO: Retourne [true, true] si les deux conventions sont respectées
  return undefined;
}
