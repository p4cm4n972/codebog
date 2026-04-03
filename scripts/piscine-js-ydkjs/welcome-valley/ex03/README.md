# Ex03 - Arrays Introduction

## Objectif
Maîtriser les bases des tableaux (arrays) en JavaScript.

## Contexte
Les arrays sont des collections ordonnées de valeurs. Ils sont omniprésents en JavaScript et ont de nombreuses méthodes utiles.

## Instructions

### `createArray()`
Crée un array `fruits = ["apple", "banana", "cherry"]`.
Retourne `fruits.length`.

### `accessElements()`
Crée `colors = ["red", "green", "blue"]`.
Retourne `[colors[0], colors[2], colors[10]]`.

**Note** : Accéder à un index inexistant retourne `undefined`.

### `modifyArray()`
Crée `numbers = [1, 2, 3]`, puis :
- `numbers.push(4)` - ajoute à la fin
- `numbers.unshift(0)` - ajoute au début
Retourne le tableau modifié.

### `arrayMethods()`
Crée `arr = [1, 2, 3, 4, 5]`, puis calcule :
- `doubled` : chaque élément × 2 (utilise `map`)
- `evens` : seulement les pairs (utilise `filter`)
- `sum` : la somme de tous (utilise `reduce`)
Retourne `[doubled, evens, sum]`.

### `spreadArray()`
Crée `arr1 = [1, 2]` et `arr2 = [3, 4]`.
Utilise le spread operator pour les combiner : `[...arr1, ...arr2]`.

## Exemple
```javascript
createArray();      // 3
accessElements();   // ["red", "blue", undefined]
modifyArray();      // [0, 1, 2, 3, 4]
arrayMethods();     // [[2,4,6,8,10], [2,4], 15]
spreadArray();      // [1, 2, 3, 4]
```

## Concepts
- Création d'arrays
- Accès par index (0-based)
- `push`, `unshift`, `pop`, `shift`
- `map`, `filter`, `reduce`
- Spread operator `...`
