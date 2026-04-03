# Ex27 - Array Mutation

## Objectif
Comprendre les méthodes mutantes vs immutables.

## Méthodes mutantes (modifient l'original)

```javascript
const arr = [1, 2, 3];

arr.push(4);     // [1, 2, 3, 4] - ajoute à la fin
arr.pop();       // [1, 2, 3] - retire de la fin
arr.unshift(0);  // [0, 1, 2, 3] - ajoute au début
arr.shift();     // [1, 2, 3] - retire du début
arr.splice(1, 1); // [1, 3] - retire à l'index
arr.sort();      // trie en place
arr.reverse();   // inverse en place
```

## Alternatives immutables

```javascript
const arr = [1, 2, 3];

// ES2023+
arr.toSorted();   // Nouvelle copie triée
arr.toReversed(); // Nouvelle copie inversée
arr.toSpliced(1, 1); // Nouvelle copie avec splice

// Classique
[...arr, 4];     // Ajouter à la fin
[0, ...arr];     // Ajouter au début
arr.slice(0, -1); // Retirer de la fin
arr.slice(1);    // Retirer du début
arr.filter((_, i) => i !== 1); // Retirer à l'index
```

## Quand muter?

```javascript
// ✅ OK: variable locale temporaire
function processData(data) {
  const result = [];
  for (const item of data) {
    result.push(transform(item));
  }
  return result;
}

// ❌ Dangereux: muter des arguments
function dangerous(arr) {
  arr.sort();  // L'appelant ne s'y attend pas!
}
```
