# Ex13 - Arguments

## Objectif
Maîtriser la manipulation des paramètres et arguments de fonctions.

## Paramètres par défaut

```javascript
function greet(name = 'World') {
  return `Hello, ${name}!`;
}
greet();        // 'Hello, World!'
greet('Alice'); // 'Hello, Alice!'
```

## Rest parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// Combinaison avec paramètres normaux
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
```

## Destructuring

```javascript
// Dans les paramètres
function createUser({ name, age = 18 }) {
  return { name, age };
}

// Arrays
function first([head]) {
  return head;
}
```

## Spread en appel

```javascript
const numbers = [1, 2, 3];
Math.max(...numbers);  // 3
```
