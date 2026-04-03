# Ex09 - Comparisons & Equality

## Objectif
Comprendre la différence entre `==` et `===`, et maîtriser les opérateurs de comparaison.

## Contexte
JavaScript a deux types d'égalité : abstraite (`==`) avec coercition de type, et stricte (`===`) sans coercition. Kyle Simpson recommande de bien comprendre la coercition plutôt que de l'éviter aveuglément. Cette exercice explore ces concepts.

## Instructions

### `strictEquality(a, b)`
Retourne `true` si `a === b`, sinon `false`.

### `looseEquality(a, b)`
Retourne `true` si `a == b`, sinon `false`.

### `compareStrictVsLoose()`
Retourne un array de comparaisons pour illustrer la différence :
```javascript
[
  5 === "5",     // false (types différents)
  5 == "5",      // true (coercition)
  null === undefined, // false
  null == undefined,  // true
  0 === false,   // false
  0 == false     // true
]
```

### `comparisonOperators(a, b)`
Retourne un objet avec toutes les comparaisons :
```javascript
{
  equal: a === b,
  notEqual: a !== b,
  greater: a > b,
  less: a < b,
  greaterOrEqual: a >= b,
  lessOrEqual: a <= b
}
```

### `objectEquality()`
Illustre que les objets sont comparés par référence, pas par valeur.
Retourne :
```javascript
[
  { a: 1 } === { a: 1 },  // false (références différentes)
  obj === obj,             // true (même référence, où obj = { a: 1 })
  [1, 2] === [1, 2],       // false
  arr === arr              // true (où arr = [1, 2])
]
```

### `nanEquality()`
Illustre le cas spécial de NaN.
Retourne :
```javascript
[
  NaN === NaN,      // false (!)
  Number.isNaN(NaN) // true (bonne façon de tester)
]
```

## Exemple
```javascript
strictEquality(5, "5");    // false
looseEquality(5, "5");     // true
compareStrictVsLoose();    // [false, true, false, true, false, true]
comparisonOperators(5, 3); // { equal: false, notEqual: true, greater: true, ... }
objectEquality();          // [false, true, false, true]
nanEquality();             // [false, true]
```

## Concepts
- Strict equality (===) vs Loose equality (==)
- Type coercion (coercition de type)
- Comparison operators (>, <, >=, <=)
- Object reference equality
- NaN special case
