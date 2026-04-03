# Ex24 - Array Methods

## Objectif
Maîtriser map, filter et reduce - le trio fonctionnel.

## map()

```javascript
// Transforme chaque élément
[1, 2, 3].map(x => x * 2);  // [2, 4, 6]

// Avec index
['a', 'b'].map((el, i) => `${i}: ${el}`);  // ['0: a', '1: b']
```

## filter()

```javascript
// Garde les éléments qui passent le test
[1, 2, 3, 4].filter(x => x % 2 === 0);  // [2, 4]

// Filtrer les nulls
[1, null, 2, undefined, 3].filter(Boolean);  // [1, 2, 3]
```

## reduce()

```javascript
// Réduire à une valeur unique
[1, 2, 3].reduce((sum, x) => sum + x, 0);  // 6

// Construire un objet
const pairs = [['a', 1], ['b', 2]];
pairs.reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});
// { a: 1, b: 2 }
```
