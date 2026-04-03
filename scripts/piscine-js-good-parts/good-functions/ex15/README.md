# Ex15 - Closure

## Objectif
Maîtriser les fermetures lexicales - l'une des fonctionnalités les plus puissantes de JavaScript.

## Qu'est-ce qu'une closure?

```javascript
function outer() {
  const secret = 'hidden';  // Variable dans le scope externe

  return function inner() {
    return secret;  // inner "ferme" sur secret
  };
}

const getSecret = outer();
getSecret();  // 'hidden' - la closure conserve l'accès
```

## Compteur avec closure

```javascript
function createCounter() {
  let count = 0;  // État privé

  return {
    increment() { return ++count; },
    decrement() { return --count; },
    getCount() { return count; }
  };
}

const counter = createCounter();
counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
```

## Piège classique: closure dans une boucle

```javascript
// ❌ Bug: toutes les fonctions référencent le même i
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);  // 3, 3, 3
}

// ✅ Solution: let crée un nouveau scope
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);  // 0, 1, 2
}
```
