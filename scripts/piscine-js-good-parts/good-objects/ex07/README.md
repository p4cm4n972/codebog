# Ex07 - Prototype

## Objectif
Comprendre la chaîne de prototypes et la délégation.

## Chaîne de prototypes

```javascript
const parent = {
  greet() {
    return 'Hello!';
  }
};

// Créer un objet avec parent comme prototype
const child = Object.create(parent);
child.name = 'Alice';

child.greet();  // 'Hello!' - hérité du parent
child.name;     // 'Alice' - propriété propre
```

## Object.create()

```javascript
// ✅ Préférer Object.create pour l'héritage
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.speak();  // 'Rex makes a sound'
```

## Vérification du prototype

```javascript
// Obtenir le prototype
Object.getPrototypeOf(child) === parent;  // true

// Vérifier si un objet est dans la chaîne
parent.isPrototypeOf(child);  // true
```
