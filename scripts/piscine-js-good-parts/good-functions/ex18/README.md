# Ex18 - Curry & Compose

## Objectif
Maîtriser la composition fonctionnelle - transformer et combiner des fonctions.

## Currying

```javascript
// Fonction normale
const add = (a, b) => a + b;

// Fonction curriée
const curriedAdd = a => b => a + b;

const add5 = curriedAdd(5);
add5(3);  // 8
```

## Composition

```javascript
// compose: exécute de droite à gauche
const compose = (f, g) => x => f(g(x));

const double = x => x * 2;
const addOne = x => x + 1;

const doubleThenAddOne = compose(addOne, double);
doubleThenAddOne(5);  // 11 (5*2=10, 10+1=11)

// pipe: exécute de gauche à droite
const pipe = (f, g) => x => g(f(x));

const addOneThenDouble = pipe(addOne, double);
addOneThenDouble(5);  // 12 ((5+1)*2=12)
```

## Application partielle

```javascript
// Figer certains arguments
const greet = (greeting, name) => `${greeting}, ${name}!`;
const sayHello = greet.bind(null, 'Hello');

sayHello('World');  // 'Hello, World!'
```
