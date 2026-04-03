# Ex11 - Function Literals

## Objectif
Comprendre les différentes façons de définir des fonctions.

## Déclaration vs Expression

```javascript
// Déclaration (hoisted)
function add(a, b) {
  return a + b;
}

// Expression (non-hoisted)
const add = function(a, b) {
  return a + b;
};

// Arrow function (ES6)
const add = (a, b) => a + b;
```

## Arrow Functions

```javascript
// Retour implicite
const square = x => x * x;

// Plusieurs paramètres
const add = (a, b) => a + b;

// Corps avec accolades
const greet = name => {
  const message = `Hello, ${name}!`;
  return message;
};

// ⚠️ Pas de this propre!
const obj = {
  name: 'Alice',
  // ❌ 'this' sera undefined ou window
  badGreet: () => `Hello, ${this.name}`,
  // ✅ Utiliser function pour this
  goodGreet() { return `Hello, ${this.name}`; }
};
```
