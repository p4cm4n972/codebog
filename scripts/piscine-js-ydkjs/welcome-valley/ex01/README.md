# Ex01 - Variables & Constants

## Objectif
Comprendre la différence entre `var`, `let` et `const`.

## Contexte
JavaScript a trois façons de déclarer des variables. Chacune a un comportement différent. Comprendre ces différences est fondamental pour écrire du code moderne.

## Instructions

Complète les fonctions pour démontrer ta compréhension :

### `varTest()`
`var` peut être redéclaré dans le même scope. Déclare `var x = 1`, puis redéclare `var x = 2`, et retourne `x`.

### `letTest()`
`let` peut être réassigné mais pas redéclaré. Déclare `let y = 1`, puis réassigne `y = 2`, et retourne `y`.

### `constTest()`
`const` ne peut pas être réassigné. Déclare `const z = 42` et retourne `z`.

### `constObject()`
`const` empêche la réassignation, mais pas la mutation d'un objet. Crée `const obj = { name: "Alice" }`, modifie `obj.name = "Bob"`, et retourne `obj.name`.

### `namingConventions()`
Retourne un tableau `[true, true]` si tu as compris les conventions :
- `camelCase` pour les variables
- `SCREAMING_SNAKE_CASE` pour les constantes

## Exemple
```javascript
varTest();          // 2
letTest();          // 2
constTest();        // 42
constObject();      // "Bob"
namingConventions(); // [true, true]
```

## Concepts
- `var` vs `let` vs `const`
- Redéclaration vs réassignation
- Mutation d'objets avec `const`
- Conventions de nommage
