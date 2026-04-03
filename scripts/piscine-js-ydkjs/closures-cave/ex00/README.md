# Ex00 - Closure Basics

## Objectif
Comprendre ce qu'est une closure et comment elle capture son environnement.

## Contexte
Une **closure** est une fonction qui "se souvient" des variables de son scope lexical, même après que ce scope ait terminé son exécution. C'est l'un des concepts les plus puissants de JavaScript.

## Instructions

### `createCounter()`
Crée et retourne une fonction qui incrémente et retourne un compteur.
```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
```

### `testClosure1()`
```javascript
const counter = createCounter();
return [counter(), counter(), counter()];
```

### `testClosure2()`
Deux compteurs indépendants.
```javascript
const c1 = createCounter();
const c2 = createCounter();
c1(); c1(); c2();
return [c1(), c2()];
```

### `testClosure3()`
Closure avec paramètre capturé.
```javascript
function outer(x) {
  return function(y) {
    return x + y;
  };
}
const add5 = outer(5);
const add10 = outer(10);
return [add5(3), add10(3)];
```

## Indice
- Chaque appel à `createCounter()` crée un **nouvel environnement** avec son propre `count`
- La fonction retournée "ferme sur" (closes over) la variable `count`
- Les closures sont indépendantes les unes des autres

## Concepts
- Closure definition
- Captured environment
- Independent closure instances
- Parameterized closures
