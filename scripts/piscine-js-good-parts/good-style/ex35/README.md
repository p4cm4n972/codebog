# Ex35 - Defensive Programming

## Objectif
Écrire du code robuste qui gère les cas limites.

## Validation des entrées

```javascript
function processUser(user) {
  // Valider tôt
  if (!user) throw new Error('User required');
  if (typeof user.name !== 'string') throw new Error('Invalid name');

  // Puis traiter
  return { ...user, processed: true };
}
```

## Valeurs par défaut

```javascript
// ❌ Dangereux
function greet(name) {
  return `Hello, ${name}!`;
}

// ✅ Défensif
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// Avec nullish coalescing
const displayName = user.name ?? 'Anonymous';
```

## Assertion functions

```javascript
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function divide(a, b) {
  assert(typeof a === 'number', 'a must be a number');
  assert(typeof b === 'number', 'b must be a number');
  assert(b !== 0, 'cannot divide by zero');
  return a / b;
}
```

## Freezing

```javascript
// Empêcher les modifications accidentelles
const config = Object.freeze({
  apiUrl: 'https://api.example.com',
  timeout: 5000
});
```
