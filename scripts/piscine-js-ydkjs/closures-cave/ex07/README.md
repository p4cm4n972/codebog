# Ex07 - Currying

## Objectif
Transformer une fonction multi-arguments en chaîne de fonctions unaires.

## Contexte
Le currying transforme `f(a, b, c)` en `f(a)(b)(c)`. Chaque appel retourne une nouvelle fonction jusqu'à ce que tous les arguments soient fournis. C'est nommé d'après le mathématicien Haskell Curry.

## Instructions

### `curry(fn)`
Implémente le currying.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function(...moreArgs) {
      return curried.apply(this, args.concat(moreArgs));
    };
  };
}
```

### `testCurry()`
```javascript
const add3 = (a, b, c) => a + b + c;
const curriedAdd = curry(add3);

return [
  curriedAdd(1)(2)(3),     // 6
  curriedAdd(1, 2)(3),     // 6
  curriedAdd(1)(2, 3),     // 6
  curriedAdd(1, 2, 3)      // 6
];
```

### `explainDifference()`
Retourne la différence entre curry et partial.

## Indice
- `fn.length` donne le nombre de paramètres attendus
- La fonction currifiée peut recevoir plusieurs arguments à la fois
- Dès que tous les arguments sont fournis, la fonction originale est appelée

## Curry vs Partial
- **Curry** : transforme la structure de la fonction
- **Partial** : fixe des arguments spécifiques

## Concepts
- Currying
- Function arity (fn.length)
- Recursive function transformation
- Functional programming pattern
