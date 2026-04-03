# Ex02 - Shadowing

## Objectif
Comprendre le masquage (shadowing) de propriétés dans la chaîne prototype.

## Contexte
Quand on assigne une propriété à un objet, elle est créée directement sur cet objet, "masquant" potentiellement une propriété du même nom dans le prototype. Mais attention aux cas particuliers avec les getters et `writable: false`.

## Instructions

### `shadow1()` - Shadowing basique
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
child.x = 2;
return [child.x, parent.x];
```

### `shadow2()` - Getter sans setter
```javascript
const parent = {
  get x() { return 1; }
};
const child = Object.create(parent);
child.x = 2; // Que se passe-t-il ?
return child.x;
```

### `shadow3()` - writable: false (sloppy mode)
```javascript
const parent = {};
Object.defineProperty(parent, "x", {
  value: 1,
  writable: false
});
const child = Object.create(parent);
child.x = 2;
return child.x;
```

### `shadow4()` - writable: false (strict mode)
```javascript
"use strict";
const parent = {};
Object.defineProperty(parent, "x", {
  value: 1,
  writable: false
});
const child = Object.create(parent);
try {
  child.x = 2;
  return "ok";
} catch (e) {
  return "TypeError";
}
```

## Indice
- L'assignation crée une propriété propre qui masque celle du prototype
- Si le prototype a un getter sans setter, l'assignation échoue silencieusement
- Si le prototype a `writable: false`, l'assignation échoue aussi
- En strict mode, ces échecs lancent une TypeError

## Concepts
- Property shadowing
- Getter/setter interception
- writable attribute inheritance
- Strict mode behavior
