# Ex14 - Return

## Objectif
Comprendre les valeurs de retour et le retour implicite.

## Retour explicite

```javascript
function add(a, b) {
  return a + b;  // Retour explicite
}

// Sans return => undefined
function noReturn() {
  const x = 1;
  // Pas de return
}
noReturn();  // undefined
```

## Retour implicite (arrow)

```javascript
// Expression unique => retour implicite
const add = (a, b) => a + b;

// Retour d'objet (attention aux accolades!)
const makePerson = name => ({ name });  // Parenthèses nécessaires
```

## Early return (guard clauses)

```javascript
// ✅ Bon - fail fast
function divide(a, b) {
  if (b === 0) return null;  // Guard clause
  return a / b;
}

// ❌ À éviter - nesting profond
function divide(a, b) {
  if (b !== 0) {
    return a / b;
  } else {
    return null;
  }
}
```

## Retour de fonctions

```javascript
// Higher-order function
const multiplier = factor => number => number * factor;

const double = multiplier(2);
double(5);  // 10
```
