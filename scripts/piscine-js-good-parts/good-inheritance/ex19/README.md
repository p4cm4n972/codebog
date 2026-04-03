# Ex19 - Prototypal Inheritance

## Objectif
Comprendre l'héritage prototypal natif de JavaScript.

## Object.create()

```javascript
const parent = {
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const child = Object.create(parent);
child.name = 'Alice';
child.greet();  // 'Hello, I'm Alice'
```

## Chaîne de prototypes

```javascript
const grandparent = { a: 1 };
const parent = Object.create(grandparent);
parent.b = 2;
const child = Object.create(parent);
child.c = 3;

child.a;  // 1 (hérité de grandparent)
child.b;  // 2 (hérité de parent)
child.c;  // 3 (propre)
```

## Différencier propre vs hérité

```javascript
child.hasOwnProperty('c');  // true
child.hasOwnProperty('a');  // false

'a' in child;  // true (vérifie aussi la chaîne)
```
