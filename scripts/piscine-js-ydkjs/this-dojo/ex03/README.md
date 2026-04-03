# Ex03 - new Binding

## Objectif
Comprendre `this` dans les constructeurs avec `new`.

## Contexte
Quand une fonction est appelée avec `new`, un nouvel objet est créé et `this` y est automatiquement bindé. C'est le "new binding".

## Instructions

### `new1()` - Constructeur basique
```javascript
function Person(name) {
  this.name = name;
}
const p = new Person("Alice");
return p.name;
```

### `new2()` - Return object override
```javascript
function Person(name) {
  this.name = name;
  return { name: "Overridden" };
}
const p = new Person("Alice");
return p.name;
```

### `new3()` - Return primitif ignoré
```javascript
function Person(name) {
  this.name = name;
  return 42;  // ignoré
}
const p = new Person("Alice");
return p.name;
```

### `new4()` - Avec prototype
```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};
const p = new Person("Bob");
return p.greet();
```

## Indice
- `new` crée un objet vide et le bind à `this`
- Si le constructeur retourne un **objet**, celui-ci remplace `this`
- Si le constructeur retourne un **primitif**, le retour est ignoré
- Les méthodes sur `prototype` utilisent `this` de l'instance

## Concepts
- new binding
- Constructor functions
- Return value override
- Prototype methods
