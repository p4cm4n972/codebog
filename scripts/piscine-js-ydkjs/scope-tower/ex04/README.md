# Ex04 - Global Pollution

## Objectif
Comprendre les variables globales implicites et `globalThis`.

## Contexte
En mode "sloppy" (non-strict), assigner à une variable non déclarée crée une propriété globale. C'est un anti-pattern dangereux. Le mode strict (`"use strict"`) empêche ce comportement.

## Instructions

### `global1()` - Global implicite en mode sloppy
```javascript
function sloppy() {
  x = 5;  // pas de var/let/const !
}
sloppy();
return typeof globalThis.x;
```

### `global2()` - Strict mode empêche les globals implicites
```javascript
"use strict";
try {
  y = 5;
  return "ok";
} catch (e) {
  return "ReferenceError";
}
```

### `global3()` - var dans une fonction n'est PAS globale
```javascript
var myVar = 1;
return globalThis.myVar === myVar;
```
Note: Ce code est dans une fonction, pas au top-level.

### `global4()` - Accéder à une propriété globale comme variable
```javascript
globalThis.myGlobal = 42;
return myGlobal;
```

### `global5()` - var shadow une propriété globale
```javascript
globalThis.test = 1;
var test = 2;
return [globalThis.test, test];
```

## Indice
- En mode sloppy, `x = 5` sans déclaration crée `globalThis.x`
- En mode strict, `x = 5` sans déclaration génère une `ReferenceError`
- `var` au top-level d'un script crée une propriété globale
- `var` dans une fonction NE crée PAS de propriété globale
- `var` dans une fonction peut "shadow" (masquer) une propriété globale

## Concepts
- Implicit global variables
- globalThis object
- Strict mode
- Global property vs global variable
- Variable shadowing at global level
