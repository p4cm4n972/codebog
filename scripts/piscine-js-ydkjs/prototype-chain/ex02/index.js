/**
 * Ex02 - Shadowing
 * Masquage de propriétés
 */

/**
 * Shadowing basique
 * @returns {[number, number]}
 */
export function shadow1() {
  const parent = { x: 1 };
  const child = Object.create(parent);
  child.x = 2;
  // TODO: Retourne [child.x, parent.x]
  return undefined;
}

/**
 * Getter sans setter
 * @returns {number}
 */
export function shadow2() {
  const parent = {
    get x() { return 1; }
  };
  const child = Object.create(parent);
  child.x = 2; // Écriture silencieuse échoue
  // TODO: Retourne child.x
  return undefined;
}

/**
 * writable: false (sloppy mode)
 * @returns {number}
 */
export function shadow3() {
  const parent = {};
  Object.defineProperty(parent, "x", {
    value: 1,
    writable: false
  });
  const child = Object.create(parent);
  child.x = 2;
  // TODO: Retourne child.x
  return undefined;
}

/**
 * writable: false (strict mode)
 * @returns {string}
 */
export function shadow4() {
  "use strict";
  const parent = {};
  Object.defineProperty(parent, "x", {
    value: 1,
    writable: false
  });
  const child = Object.create(parent);
  try {
    child.x = 2;
    return "ok";
  } catch (e) {
    return "TypeError";
  }
  // La fonction retourne déjà dans le try/catch
}
