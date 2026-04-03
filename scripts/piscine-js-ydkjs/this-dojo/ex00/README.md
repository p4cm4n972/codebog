# Ex00 - Default Binding

## Objectif
Comprendre le binding par défaut de `this`.

## Contexte
Quand une fonction est appelée "normalement" (sans objet, call/apply, ou new), `this` prend une valeur par défaut. En mode "sloppy", c'est `globalThis`. En mode strict, c'est `undefined`.

## Instructions

### `default1()` - Mode sloppy
```javascript
function showThis() {
  return this;
}
return showThis() === globalThis;
```

### `default2()` - Mode strict
```javascript
"use strict";
function showThis() {
  return this;
}
return showThis();
```

### `default3()` - Arrow function
```javascript
const arrow = () => this;
return arrow() === globalThis;
```

## Indice
- Mode sloppy (non-strict) : `this` = `globalThis`
- Mode strict : `this` = `undefined`
- Arrow functions : pas de binding propre, héritent du `this` lexical

## Concepts
- Default binding rule
- Strict mode effect on this
- Arrow function this inheritance
- globalThis
