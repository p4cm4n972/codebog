# Ex17 - Module Pattern

## Objectif
Encapsuler le code avec le pattern module - l'ancêtre des ES Modules.

## IIFE (Immediately Invoked Function Expression)

```javascript
const counter = (function() {
  // Variables privées
  let count = 0;

  // API publique
  return {
    increment() { return ++count; },
    getCount() { return count; }
  };
})();

counter.increment();  // 1
counter.count;        // undefined (privé!)
```

## Revealing Module Pattern

```javascript
const calculator = (function() {
  // Tout est privé
  function add(a, b) { return a + b; }
  function multiply(a, b) { return a * b; }

  // On révèle ce qu'on veut
  return {
    add,
    multiply
  };
})();
```

## Module avec dépendances

```javascript
const myModule = (function(dependency) {
  return {
    doSomething() {
      return dependency.helper();
    }
  };
})(otherModule);
```
