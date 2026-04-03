/**
 * Ex07 - Currying
 * Transformer une fonction en chaîne de fonctions unaires
 */

/**
 * Curry une fonction
 * @param {function} fn
 * @returns {function}
 */
export function curry(fn) {
  // TODO: Implémente le currying
  // return function curried(...args) {
  //   if (args.length >= fn.length) {
  //     return fn.apply(this, args);
  //   }
  //   return function(...moreArgs) {
  //     return curried.apply(this, args.concat(moreArgs));
  //   };
  // };
  return undefined;
}

/**
 * Teste le currying
 * @returns {number[]}
 */
export function testCurry() {
  const add3 = (a, b, c) => a + b + c;
  const curriedAdd = curry(add3);

  // TODO: Retourne [
  //   curriedAdd(1)(2)(3),
  //   curriedAdd(1, 2)(3),
  //   curriedAdd(1)(2, 3),
  //   curriedAdd(1, 2, 3)
  // ]
  return undefined;
}

/**
 * Explique la différence entre curry et partial
 * @returns {string}
 */
export function explainDifference() {
  // TODO: Retourne "curry transforms, partial fixes"
  return undefined;
}
