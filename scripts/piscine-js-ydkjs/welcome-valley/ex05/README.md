# Ex05 - Functions Basics

## Objectif
Maîtriser les trois façons de déclarer des fonctions en JavaScript.

## Contexte
JavaScript offre plusieurs syntaxes pour déclarer des fonctions. Chacune a ses cas d'usage. Les arrow functions (ES6) sont devenues la norme pour les fonctions courtes.

## Instructions

### `greet(name)`
**Function Declaration** - la forme classique.
Retourne `` `Hello, ${name}!` ``.

### `multiply`
**Function Expression** - assignée à une variable.
`const multiply = function(a, b) { return a * b; }`

### `divide`
**Arrow Function** - syntaxe courte ES6.
`const divide = (a, b) => a / b`

### `double`
**Arrow avec un seul paramètre** - parenthèses optionnelles.
`const double = x => x * 2`

### `greetFormal(name)`
**Arrow avec corps de fonction** - pour plusieurs lignes.
```javascript
const greetFormal = (name) => {
  const greeting = `Good morning, ${name}`;
  return greeting;
};
```

### `testFunctions()`
Appelle toutes les fonctions et retourne leurs résultats :
`[greet("Alice"), multiply(3, 4), divide(10, 2), double(21)]`

### `greetWithDefault(name = "Guest")`
**Default parameters** - valeur par défaut si non fourni.
Retourne `` `Welcome, ${name}!` ``

### `testDefaults()`
Retourne `[greetWithDefault(), greetWithDefault("Bob")]`.

## Exemple
```javascript
greet("Alice");       // "Hello, Alice!"
multiply(3, 4);       // 12
divide(10, 2);        // 5
double(21);           // 42
testFunctions();      // ["Hello, Alice!", 12, 5, 42]
testDefaults();       // ["Welcome, Guest!", "Welcome, Bob!"]
```

## Concepts
- Function declaration vs expression
- Arrow functions (ES6)
- Implicit return
- Default parameters
- Template literals
