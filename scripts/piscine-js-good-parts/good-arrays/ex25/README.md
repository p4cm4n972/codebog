# Ex25 - Array Search

## Objectif
Trouver des éléments avec find, findIndex, includes et some/every.

## find() et findIndex()

```javascript
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Trouver un élément
users.find(u => u.id === 2);  // { id: 2, name: 'Bob' }

// Trouver l'index
users.findIndex(u => u.id === 2);  // 1
users.findIndex(u => u.id === 999);  // -1
```

## includes()

```javascript
// Vérifie la présence (égalité stricte)
[1, 2, 3].includes(2);  // true
['a', 'b'].includes('c');  // false

// NaN est géré correctement!
[NaN].includes(NaN);  // true (contrairement à indexOf)
```

## some() et every()

```javascript
const numbers = [1, 2, 3, 4, 5];

// Au moins un satisfait?
numbers.some(x => x > 4);  // true

// Tous satisfont?
numbers.every(x => x > 0);  // true
numbers.every(x => x > 3);  // false
```
