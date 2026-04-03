# Ex04 - Factory Functions

## Objectif
Créer des objets avec état via des factory functions.

## Contexte
Les factory functions sont une alternative aux classes. Elles utilisent les closures pour l'encapsulation et retournent des objets avec une API publique.

## Instructions

### `createStack()`
Implémente une stack (pile) avec :
- `push(item)` : ajoute un élément et retourne `this` pour le chaînage
- `pop()` : retire et retourne le dernier élément
- `peek()` : retourne le dernier élément sans le retirer
- `size()` : retourne le nombre d'éléments
- `isEmpty()` : retourne true si vide

### `testStack()`
```javascript
const stack = createStack();
stack.push(1).push(2).push(3);
const popped = stack.pop();
const peeked = stack.peek();
const size = stack.size();
const directItems = stack.items;  // undefined
return [popped, peeked, size, directItems];
```

## Indice
- `items` est un array privé dans la closure
- `return this` permet le method chaining
- `stack.items` retourne `undefined` car items n'est pas exposé

## Concepts
- Factory functions
- Method chaining (fluent API)
- Private internal state
- Stack data structure
