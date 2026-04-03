# Ex02 - Primitive Types

## Objectif
Connaître les 7 types primitifs de JavaScript et leurs particularités.

## Contexte
JavaScript a 7 types primitifs : `string`, `number`, `boolean`, `undefined`, `null`, `symbol`, et `bigint`. Chacun a des comportements uniques, y compris quelques bizarreries historiques.

## Instructions

### `stringType()`
Crée une variable `greeting = "Hello"` et un template literal `template = \`Value: ${42}\``.
Retourne `[typeof greeting, template]`.

### `numberType()`
Tous les nombres (entiers, flottants, Infinity, NaN) sont de type `"number"`.
Retourne `[typeof 42, typeof 3.14, typeof NaN]`.

### `booleanType()`
Retourne `typeof true`.

### `nullAndUndefined()`
- `undefined` : variable déclarée mais pas assignée
- `null` : valeur intentionnellement vide
Retourne `[typeof undefined, typeof null]`.

**Attention** : `typeof null` retourne `"object"` - c'est un bug historique de JS !

### `symbolType()`
Crée `const sym = Symbol("description")` et retourne `typeof sym`.

### `bigIntType()`
Crée `const big = 9007199254740991n` et retourne `typeof big`.

### `allPrimitives()`
Retourne un tableau listant les 7 types primitifs en strings.

## Exemple
```javascript
stringType();        // ["string", "Value: 42"]
numberType();        // ["number", "number", "number"]
nullAndUndefined();  // ["undefined", "object"]  // <- piège !
```

## Concepts
- Les 7 types primitifs
- `typeof` operator
- Le bug historique de `typeof null`
