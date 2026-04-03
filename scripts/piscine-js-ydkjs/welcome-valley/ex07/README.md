# Ex07 - Loops

## Objectif
Maîtriser les différentes boucles en JavaScript.

## Contexte
JavaScript propose plusieurs types de boucles. Chacune a son cas d'usage : `for` pour un nombre connu d'itérations, `while` pour des conditions dynamiques, `for...of` pour itérer sur des valeurs, `for...in` pour les clés d'objets.

## Instructions

### `sumWithFor(n)`
Utilise une boucle `for` classique pour retourner la somme de 1 à n.
```javascript
sumWithFor(5); // 1+2+3+4+5 = 15
```

### `sumWithWhile(n)`
Même chose mais avec `while`.

### `iterateArray(arr)`
Utilise `for...of` pour retourner la somme de tous les éléments.
```javascript
iterateArray([1, 2, 3]); // 6
```

### `getObjectKeys(obj)`
Utilise `for...in` pour retourner un array de toutes les clés de l'objet.
```javascript
getObjectKeys({ a: 1, b: 2 }); // ["a", "b"]
```

### `doubleWithForEach(arr)`
Utilise `forEach` pour doubler chaque élément et retourner un nouveau tableau.
```javascript
doubleWithForEach([1, 2, 3]); // [2, 4, 6]
```

### `breakExample()`
Retourne le premier nombre divisible par 7 entre 1 et 100.
Utilise `break` pour sortir de la boucle dès qu'il est trouvé.

### `continueExample()`
Retourne un array des nombres de 1 à 10 qui ne sont PAS divisibles par 3.
Utilise `continue` pour sauter les multiples de 3.

## Exemple
```javascript
sumWithFor(5);           // 15
sumWithWhile(5);         // 15
iterateArray([1, 2, 3]); // 6
getObjectKeys({ x: 1 }); // ["x"]
doubleWithForEach([1, 2]); // [2, 4]
breakExample();          // 7
continueExample();       // [1, 2, 4, 5, 7, 8, 10]
```

## Concepts
- for loop (initialisation; condition; incrémentation)
- while loop
- for...of (itération sur valeurs)
- for...in (itération sur clés)
- forEach (méthode de tableau)
- break et continue
