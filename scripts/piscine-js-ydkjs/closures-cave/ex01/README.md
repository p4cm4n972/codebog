# Ex01 - Loop Closure Trap

## Objectif
Comprendre le piège classique des closures dans les boucles et ses solutions.

## Contexte
Quand on crée des fonctions dans une boucle avec `var`, toutes les fonctions partagent la même variable. C'est l'un des bugs les plus courants en JavaScript. ES6 (`let`) résout ce problème.

## Instructions

### `loopTrap1()` - Le piège
```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(function() {
    return i;
  });
}
return funcs.map(f => f());
```
Que retourne cet array ?

### `loopFixed1()` - Solution avec let
```javascript
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(function() {
    return i;
  });
}
return funcs.map(f => f());
```

### `loopFixed2()` - Solution IIFE (pre-ES6)
```javascript
const funcs = [];
for (var i = 0; i < 3; i++) {
  (function(j) {
    funcs.push(function() {
      return j;
    });
  })(i);
}
return funcs.map(f => f());
```

### `loopTrap2()` - Cas particulier avec this
```javascript
const buttons = [];
for (var i = 0; i < 3; i++) {
  buttons.push({
    index: i,
    click: function() {
      return this.index;
    }
  });
}
return buttons.map(b => b.click());
```

## Indice
- Avec `var`, il n'y a qu'un seul `i` pour toute la boucle
- Avec `let`, chaque itération a son propre `i`
- L'IIFE crée un nouveau scope avec son propre `j` à chaque itération
- `this.index` fonctionne car l'objet est créé avec la bonne valeur `i`

## Concepts
- Closure over loop variable
- var vs let in loops
- IIFE as scope creator
- this binding in object methods
