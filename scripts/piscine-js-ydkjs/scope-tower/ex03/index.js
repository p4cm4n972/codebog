/**
 * Ex03 - Block Scope
 * Comprendre le scope de bloc pour let/const vs var
 */

/**
 * var après un bloc if
 * @returns {string}
 */
export function block1() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  // TODO: Retourne typeof x
  return undefined;
}

/**
 * let après un bloc if
 * @returns {string|number}
 */
export function block2() {
  if (true) {
    var x = 1;
    let y = 2;
  }
  // TODO: Retourne y ou "ReferenceError" si erreur
  return undefined;
}

/**
 * Boucle for avec var - le piège classique
 * @returns {number[]}
 */
export function block3() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(() => i);
  }
  // TODO: Retourne funcs.map(f => f())
  return undefined;
}

/**
 * Boucle for avec let - la solution
 * @returns {number[]}
 */
export function block4() {
  const funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(() => i);
  }
  // TODO: Retourne funcs.map(f => f())
  return undefined;
}

/**
 * const dans une boucle for classique
 * @returns {string}
 */
export function block5() {
  // TODO: Retourne "ok" ou "TypeError"
  // Note: const i = 0; i++ échoue car const ne peut être réassigné
  return undefined;
}
