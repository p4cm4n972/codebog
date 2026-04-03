# Ex03 - Block Scope

## Objectif
Comprendre le scope de bloc pour `let`/`const` vs `var`.

## Contexte
`var` est function-scoped : elle est visible dans toute la fonction. `let` et `const` sont block-scoped : visibles uniquement dans le bloc `{}` où elles sont déclarées. Cette différence est cruciale dans les boucles.

## Instructions

### `block1()` - var après un if
```javascript
if (true) {
  var x = 1;
  let y = 2;
}
return typeof x;
```

### `block2()` - let après un if
```javascript
if (true) {
  var x = 1;
  let y = 2;
}
try {
  return y;
} catch (e) {
  return "ReferenceError";
}
```

### `block3()` - Boucle for avec var (piège classique)
```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => i);
}
return funcs.map(f => f());
```

### `block4()` - Boucle for avec let (solution)
```javascript
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(() => i);
}
return funcs.map(f => f());
```

### `block5()` - const dans une boucle for
```javascript
try {
  for (const i = 0; i < 3; i++) {
    // ...
  }
  return "ok";
} catch (e) {
  return "TypeError";
}
```

## Indice
- `var` dans un `if` reste accessible après le bloc
- `let` dans un `if` disparaît après le bloc
- Dans `for (var i...)`, il n'y a qu'un seul `i` partagé
- Dans `for (let i...)`, chaque itération a son propre `i`
- `const` ne peut pas être réassigné (donc `i++` échoue)

## Concepts
- Block scope vs function scope
- var leaking out of blocks
- Closure over loop variables
- let re-binding in for loops
