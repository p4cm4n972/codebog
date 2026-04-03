/**
 * Ex00 - Closure Basics
 * Comprendre les closures et leur environnement capturé
 */

/**
 * Crée un compteur qui incrémente à chaque appel
 * @returns {function(): number}
 */
export function createCounter() {
  let count = 0;
  // TODO: Retourne une fonction qui incrémente count et le retourne
  return function() {
    return undefined;
  };
}

/**
 * Teste un seul compteur appelé 3 fois
 * @returns {number[]}
 */
export function testClosure1() {
  const counter = createCounter();
  // TODO: Retourne [counter(), counter(), counter()]
  return undefined;
}

/**
 * Teste deux compteurs indépendants
 * @returns {number[]}
 */
export function testClosure2() {
  const c1 = createCounter();
  const c2 = createCounter();
  c1();
  c1();
  c2();
  // TODO: Retourne [c1(), c2()]
  return undefined;
}

/**
 * Closure avec paramètre capturé
 * @returns {number[]}
 */
export function testClosure3() {
  function outer(x) {
    return function(y) {
      return x + y;
    };
  }
  const add5 = outer(5);
  const add10 = outer(10);
  // TODO: Retourne [add5(3), add10(3)]
  return undefined;
}
