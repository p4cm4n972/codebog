/**
 * Ex05 - Memoization
 * Cache de résultats via closure
 */

/**
 * Crée une version memoized d'une fonction
 * @param {function} fn
 * @returns {function}
 */
export function memoize(fn) {
  const cache = new Map();

  // TODO: Retourne une fonction qui:
  // 1. Crée une clé avec JSON.stringify(args)
  // 2. Si la clé existe dans cache, retourne cache.get(key)
  // 3. Sinon, calcule le résultat avec fn.apply(this, args)
  // 4. Stocke le résultat dans le cache
  // 5. Retourne le résultat
  return function(...args) {
    return undefined;
  };
}

/**
 * Teste la memoization
 * @returns {[number, number, number, number, number]}
 */
export function testMemoize() {
  let callCount = 0;

  const expensive = (n) => {
    callCount++;
    return n * 2;
  };

  const memoized = memoize(expensive);

  const r1 = memoized(5);   // calcule
  const r2 = memoized(5);   // cache!
  const r3 = memoized(10);  // calcule
  const r4 = memoized(5);   // cache!

  // TODO: Retourne [r1, r2, r3, r4, callCount]
  return undefined;
}
