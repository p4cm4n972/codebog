# Ex04 - Constructor Functions

## Objectif
Comprendre le pattern des fonctions constructeurs avec `new` et `.prototype`.

## Contexte
Avant ES6 classes, les fonctions constructeurs étaient la manière standard de créer des "classes" en JavaScript. La propriété `.prototype` d'une fonction est automatiquement utilisée comme prototype des instances créées avec `new`.

## Instructions

### `constructor1()` - Méthodes partagées via prototype
```javascript
function Dog(name) {
  this.name = name;
}
Dog.prototype.bark = function() {
  return `${this.name} says woof!`;
};

const d1 = new Dog("Rex");
const d2 = new Dog("Max");

return [
  d1.bark(),
  d1.bark === d2.bark
];
```

### `constructor2()` - Remplacement de prototype (bug)
```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype = {
  bark() {
    return "woof";
  }
};

const d = new Dog("Rex");
return d.constructor === Dog;
```

### `constructor3()` - Fix avec constructor explicite
```javascript
function Dog(name) {
  this.name = name;
}

Dog.prototype = {
  constructor: Dog,
  bark() {
    return "woof";
  }
};

const d = new Dog("Rex");
return d.constructor === Dog;
```

## Indice
- `new Foo()` crée un objet avec `Foo.prototype` comme prototype
- Les méthodes sur `.prototype` sont partagées par toutes les instances
- Remplacer `.prototype` casse la référence `constructor`
- Toujours restaurer `constructor` quand on remplace le prototype

## Concepts
- Constructor functions
- Function.prototype property
- Shared methods
- constructor property
