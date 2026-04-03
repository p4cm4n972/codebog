/**
 * Ex01 - Hoisting Deep Dive
 * Comprendre le hoisting de var, let, const et fonctions
 */

/**
 * Que log console.log(x) dans hoist1 ?
 * @returns {undefined}
 */
export function hoist1Answer() {
  // Dans hoist1: console.log(x); var x = 5;
  // TODO: Retourne ce que console.log affiche (undefined, 5, ou "ReferenceError")
  return "___";
}

/**
 * typeof foo avant la déclaration de fonction
 * @returns {string}
 */
export function hoist2() {
  // TODO: Retourne typeof foo AVANT la déclaration
  // function foo() {} est déclarée après
  return undefined;
  function foo() {}
}

/**
 * typeof bar avant la function expression
 * @returns {string}
 */
export function hoist3() {
  // TODO: Retourne typeof bar
  // var bar = function() {} est déclarée après
  return undefined;
  var bar = function() {};
}

/**
 * let et la Temporal Dead Zone
 * @returns {string}
 */
export function hoist4() {
  // TODO: Retourne "no error" ou "ReferenceError"
  try {
    const result = x;
    let x = 5;
    return "no error";
  } catch (e) {
    return "ReferenceError";
  }
}

/**
 * Que log console.log(x) DANS inner ?
 * @returns {undefined}
 */
export function hoist5Answer() {
  // Dans hoist5:
  // var x = 1;
  // function inner() {
  //   console.log(x);  <-- Que log cette ligne ?
  //   var x = 2;
  //   return x;
  // }
  // TODO: Retourne ce que console.log affiche dans inner
  return "___";
}
