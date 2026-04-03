# Good Inheritance

## Philosophie

JavaScript utilise l'héritage prototypal, pas l'héritage classique. Au lieu de classes qui créent des copies, on a des objets qui délèguent à d'autres objets.

## Prototypal vs Classical

```javascript
// ❌ Simuler les classes (avant ES6)
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() {};

// ✅ Délégation directe
const animal = {
  speak() { return `${this.name} speaks`; }
};
const dog = Object.create(animal);
dog.name = 'Rex';
```

## ES6 class (syntaxe, pas sémantique)

```javascript
// class est du sucre syntaxique sur prototypes
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return `${this.name} speaks`;
  }
}

// Équivalent à:
// Animal.prototype.speak = function() {...}
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 19 | Prototypal Inheritance | Object.create et délégation |
| 20 | Functional Inheritance | Héritage par composition |
| 21 | Object Composition | Mixins et composition |
| 22 | Factory Functions | Alternatives aux constructeurs |
| 23 | Class Syntax | ES6 classes (sucre syntaxique) |
