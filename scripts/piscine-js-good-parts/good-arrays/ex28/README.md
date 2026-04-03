# Ex28 - Advanced Patterns

## Objectif
Combiner les méthodes de tableau pour résoudre des problèmes complexes.

## Chaînage

```javascript
const data = [
  { name: 'Alice', age: 30, active: true },
  { name: 'Bob', age: 25, active: false },
  { name: 'Charlie', age: 35, active: true }
];

// Pipeline de transformations
const result = data
  .filter(u => u.active)
  .map(u => u.name)
  .sort()
  .join(', ');

// 'Alice, Charlie'
```

## Partition

```javascript
// Séparer en deux groupes
const [evens, odds] = numbers.reduce(
  ([e, o], n) => n % 2 === 0 ? [[...e, n], o] : [e, [...o, n]],
  [[], []]
);
```

## Zip

```javascript
// Combiner deux tableaux
const zip = (a, b) => a.map((el, i) => [el, b[i]]);
zip([1, 2, 3], ['a', 'b', 'c']);
// [[1, 'a'], [2, 'b'], [3, 'c']]
```

## Chunk

```javascript
// Diviser en morceaux
const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) },
    (_, i) => arr.slice(i * size, i * size + size)
  );

chunk([1, 2, 3, 4, 5], 2);  // [[1, 2], [3, 4], [5]]
```
