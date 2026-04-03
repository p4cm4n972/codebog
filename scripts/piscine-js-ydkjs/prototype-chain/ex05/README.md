# Ex05 - Class Sugar

## Objectif
Comprendre que `class` est du sucre syntaxique sur le système de prototypes.

## Contexte
ES6 a introduit le mot-clé `class`, mais ce n'est qu'une syntaxe plus claire pour créer des fonctions constructeurs et configurer les prototypes. Sous le capot, c'est toujours du prototype-based inheritance.

## Instructions

### `class1()` - Class est une fonction
```javascript
class Dog {
  constructor(name) {
    this.name = name;
  }
  bark() {
    return `${this.name} barks`;
  }
}

const d = new Dog("Rex");
return [
  typeof Dog,
  Object.getPrototypeOf(d) === Dog.prototype
];
```

### `class2()` - extends et la chaîne prototype
```javascript
class Animal {
  speak() {
    return `${this.name} speaks`;
  }
}

class Dog extends Animal {
  constructor(name) {
    super();
    this.name = name;
  }
  bark() {
    return `${this.name} barks`;
  }
}

const d = new Dog("Rex");
return [
  d.speak(),
  Object.getPrototypeOf(Dog.prototype) === Animal.prototype
];
```

### `class3()` - Classes ne sont pas hoisted
```javascript
try {
  const d = new Dog("Rex");
  return "ok";
} catch (e) {
  return "ReferenceError";
}

class Dog {
  constructor(name) {
    this.name = name;
  }
}
```

## Indice
- `typeof ClassName` retourne `"function"`
- `extends` configure la chaîne prototype automatiquement
- Contrairement aux fonctions, les classes ne sont pas hoisted
- `super()` doit être appelé avant d'utiliser `this` dans un constructeur dérivé

## Concepts
- Class syntax
- Syntactic sugar
- extends keyword
- Temporal Dead Zone (TDZ)
