# Ex05 - Memoization

## Objectif
Implémenter un cache de résultats via closure (memoization).

## Contexte
La memoization est une technique d'optimisation qui stocke les résultats de fonctions coûteuses. Si les mêmes arguments sont passés à nouveau, le résultat est retourné du cache au lieu de recalculer.

## Instructions

### `memoize(fn)`
Implémente une fonction de memoization simple.

```javascript
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### `testMemoize()`
```javascript
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

return [r1, r2, r3, r4, callCount];
```

## Indice
- `JSON.stringify(args)` crée une clé unique pour chaque combinaison d'arguments
- `fn.apply(this, args)` préserve le contexte `this`
- Le cache persiste grâce à la closure

## Concepts
- Memoization pattern
- Cache implementation
- Closure for persistent state
- Performance optimization
