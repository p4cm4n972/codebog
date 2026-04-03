# Ex04 - Object & Array Literals

## Objectif
Utiliser les littéraux d'objets et de tableaux - la façon idiomatique de créer des structures.

## Object Literals vs new Object()

```javascript
// ❌ Bad
const obj = new Object();
obj.name = 'Alice';
obj.age = 30;

// ✅ Good
const obj = {
  name: 'Alice',
  age: 30
};
```

## Array Literals vs new Array()

```javascript
// ❌ Bad - Comportement surprenant
const arr = new Array(3);    // [undefined, undefined, undefined]
const arr2 = new Array(1, 2); // [1, 2]

// ✅ Good - Prévisible
const arr = [1, 2, 3];
const empty = [];
```

## Propriétés calculées (ES6+)

```javascript
const key = 'dynamic';
const obj = {
  [key]: 'value',
  [`${key}Two`]: 'value2'
};
```
