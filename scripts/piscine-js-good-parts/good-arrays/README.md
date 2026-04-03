# Good Arrays

## Philosophie

Les tableaux en JavaScript sont des objets spéciaux avec une propriété `length` magique. Les méthodes fonctionnelles (`map`, `filter`, `reduce`) sont préférables aux boucles impératives.

## Littéral vs Constructor

```javascript
// ❌ Comportement surprenant
new Array(3);      // [undefined, undefined, undefined]
new Array(1, 2);   // [1, 2]

// ✅ Prévisible
const arr = [1, 2, 3];
const empty = [];
```

## Méthodes fonctionnelles

```javascript
const numbers = [1, 2, 3, 4, 5];

// map: transformer
numbers.map(x => x * 2);  // [2, 4, 6, 8, 10]

// filter: filtrer
numbers.filter(x => x > 2);  // [3, 4, 5]

// reduce: réduire
numbers.reduce((sum, x) => sum + x, 0);  // 15

// find: chercher
numbers.find(x => x > 3);  // 4
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 24 | Array Methods | map, filter, reduce |
| 25 | Array Search | find, findIndex, includes |
| 26 | Array Transform | flat, flatMap, sort |
| 27 | Array Mutation | splice, sort in-place vs immutable |
| 28 | Advanced Patterns | Méthodes chainées et compositions |
