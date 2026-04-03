# Ex06 - Conditionals

## Objectif
Maîtriser les structures conditionnelles en JavaScript.

## Contexte
Les conditionnels permettent d'exécuter du code selon des conditions. JavaScript offre plusieurs syntaxes : `if/else`, l'opérateur ternaire, et `switch`. Comprendre les valeurs "truthy" et "falsy" est essentiel.

## Instructions

### `checkAge(age)`
Utilise `if/else` pour retourner :
- `"minor"` si age < 18
- `"adult"` si age >= 18

### `checkScore(score)`
Utilise `else if` pour retourner :
- `"A"` si score >= 90
- `"B"` si score >= 80
- `"C"` si score >= 70
- `"D"` si score >= 60
- `"F"` sinon

### `ternaryExample(isRaining)`
Utilise l'opérateur ternaire pour retourner :
- `"umbrella"` si isRaining est true
- `"sunglasses"` sinon

### `getDayName(day)`
Utilise `switch` pour retourner le nom du jour :
- 1 → "Monday", 2 → "Tuesday", ..., 7 → "Sunday"
- default → "Invalid day"

### `isTruthy(value)`
Retourne `true` si la valeur est truthy, `false` sinon.
Rappel : falsy values = `false`, `0`, `""`, `null`, `undefined`, `NaN`

### `testTruthyFalsy()`
Retourne un array des résultats de `isTruthy()` pour :
`[0, 1, "", "hello", null, undefined, [], {}]`

## Exemple
```javascript
checkAge(17);        // "minor"
checkAge(21);        // "adult"
checkScore(85);      // "B"
ternaryExample(true); // "umbrella"
getDayName(3);       // "Wednesday"
isTruthy(0);         // false
isTruthy("hello");   // true
```

## Concepts
- if / else / else if
- Ternary operator (condition ? a : b)
- switch / case / default / break
- Truthy vs Falsy values
