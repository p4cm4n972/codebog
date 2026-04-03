# Ex26 - Array Transform

## Objectif
Transformer la structure des tableaux avec flat, flatMap, sort et reverse.

## flat()

```javascript
// Aplatir un niveau
[[1, 2], [3, 4]].flat();  // [1, 2, 3, 4]

// Aplatir plusieurs niveaux
[1, [2, [3, [4]]]].flat(2);  // [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity);  // [1, 2, 3, 4]
```

## flatMap()

```javascript
// map + flat en une étape
['hello world', 'foo bar']
  .flatMap(s => s.split(' '));
// ['hello', 'world', 'foo', 'bar']

// Filtrer et transformer
[1, 2, 3, 4].flatMap(x => x % 2 ? [x * 2] : []);
// [2, 6] - équivalent à filter puis map
```

## sort()

```javascript
// ⚠️ sort() mute le tableau!
const arr = [3, 1, 2];
arr.sort();  // arr est maintenant [1, 2, 3]

// Tri personnalisé
[10, 2, 30].sort((a, b) => a - b);  // [2, 10, 30]

// ✅ Copie immutable avec toSorted() (ES2023)
const sorted = arr.toSorted();
```
