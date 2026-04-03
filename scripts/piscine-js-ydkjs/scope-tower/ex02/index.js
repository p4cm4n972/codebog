/**
 * Ex02 - TDZ (Temporal Dead Zone)
 * Comprendre la TDZ pour let et const
 */

/**
 * Assignation avant déclaration let
 * @returns {string}
 */
export function tdz1() {
  // TODO: Retourne "ok" ou "ReferenceError"
  return undefined;
}

/**
 * Auto-référence avec const
 * @returns {string}
 */
export function tdz2() {
  // TODO: Retourne "ok" ou "ReferenceError"
  // const x = x; // x référence lui-même pendant l'initialisation
  return undefined;
}

/**
 * TDZ dans un bloc interne
 * @returns {string}
 */
export function tdz3() {
  // TODO: Retourne "ok" ou "ReferenceError"
  // let x = 1;
  // { console.log(x); let x = 2; }
  return undefined;
}

/**
 * typeof sur variable non déclarée (safe)
 * @returns {string}
 */
export function tdz4() {
  // TODO: Retourne le résultat ou "error"
  try {
    return typeof undeclared;
  } catch (e) {
    return "error";
  }
}

/**
 * typeof ne protège PAS de la TDZ
 * @returns {string}
 */
export function tdz5() {
  // TODO: Retourne le résultat ou "ReferenceError"
  return undefined;
}
