/**
 * Ex04 - Global Pollution
 * Variables globales implicites et globalThis
 */

/**
 * Global implicite en mode sloppy
 * @returns {string}
 */
export function global1() {
  // En mode sloppy, x = 5 crée globalThis.x
  // TODO: Retourne "number" ou "undefined"
  return undefined;
}

/**
 * Strict mode empêche les globals implicites
 * @returns {string}
 */
export function global2() {
  "use strict";
  try {
    // y = 5; // Sans déclaration
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }
  // TODO: Que retourne cette fonction ?
}

/**
 * var dans une fonction n'est PAS une propriété globale
 * @returns {boolean}
 */
export function global3() {
  var myVar = 1;
  // TODO: Retourne globalThis.myVar === myVar
  // Note: myVar est locale à la fonction, pas globale
  return undefined;
}

/**
 * Accéder à une propriété globale comme variable
 * @returns {number}
 */
export function global4() {
  globalThis.myGlobalForEx04 = 42;
  // TODO: Retourne myGlobalForEx04
  return undefined;
}

/**
 * var shadow une propriété globale
 * @returns {[number, number]}
 */
export function global5() {
  globalThis.testForEx04 = 1;
  var testForEx04 = 2;
  // TODO: Retourne [globalThis.testForEx04, testForEx04]
  return undefined;
}
