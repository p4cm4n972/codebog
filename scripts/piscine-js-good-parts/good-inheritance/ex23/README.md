# Ex23 - Class Syntax

## Objectif
Comprendre la syntaxe `class` d'ES6 - du sucre syntaxique sur les prototypes.

## Syntaxe de base

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

const animal = new Animal('Rex');
```

## Héritage avec extends

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Appel du constructeur parent
    this.breed = breed;
  }

  speak() {
    return `${super.speak()} (bark!)`;
  }

  bark() {
    return `${this.name} barks`;
  }
}
```

## Getters et Setters

```javascript
class Circle {
  constructor(radius) {
    this._radius = radius;
  }

  get radius() { return this._radius; }
  set radius(value) {
    if (value < 0) throw new Error('Invalid');
    this._radius = value;
  }

  get area() { return Math.PI * this._radius ** 2; }
}
```

## Static

```javascript
class MathUtils {
  static PI = 3.14159;
  static add(a, b) { return a + b; }
}

MathUtils.PI;        // 3.14159
MathUtils.add(2, 3); // 5
```
