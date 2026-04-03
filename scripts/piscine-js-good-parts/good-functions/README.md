# Good Functions

## Philosophie

Les fonctions sont au coeur de JavaScript. Elles sont des objets de première classe, ce qui signifie qu'elles peuvent être assignées à des variables, passées en arguments, et retournées par d'autres fonctions.

## Fonctions comme valeurs

```javascript
// Fonction comme variable
const add = (a, b) => a + b;

// Fonction comme argument
[1, 2, 3].map(x => x * 2);

// Fonction comme retour
const multiplier = factor => n => n * factor;
const double = multiplier(2);
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 11 | Function Literals | Expressions de fonctions |
| 12 | Invocation Patterns | Les 4 patterns d'appel |
| 13 | Arguments | Paramètres et arguments |
| 14 | Return | Valeurs de retour |
| 15 | Closure | Fermetures lexicales |
| 16 | Callbacks | Fonctions de rappel |
| 17 | Module Pattern | Encapsulation avec closures |
| 18 | Curry & Compose | Composition fonctionnelle |
