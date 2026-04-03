/**
 * Ex00 - Lexical Scope
 * Comprendre le scope lexical et la résolution de variables
 */

/**
 * Variable x accessible depuis inner
 * @returns {number}
 */
export function scope1() {
  const x = 1;
  function inner() {
    return x;
  }
  // TODO: Retourne inner()
  return undefined;
}

/**
 * Variable x shadowed (masquée) dans inner
 * @returns {number}
 */
export function scope2() {
  const x = 1;
  function inner() {
    const x = 2;
    return x;
  }
  // TODO: Retourne inner()
  return undefined;
}

/**
 * Nested functions et scope chain
 * @returns {number}
 */
export function scope3() {
  const x = 1;
  function inner() {
    const x = 2;
    function deeper() {
      return x;
    }
    return deeper();
  }
  // TODO: Retourne inner()
  return undefined;
}

/**
 * Paramètre de fonction comme variable locale
 * @returns {string}
 */
export function scope4() {
  const x = "outer";
  function inner(x) {
    return x;
  }
  // TODO: Retourne inner("param")
  return undefined;
}
