# Ex03 - Object.create

## Objectif
Maîtriser `Object.create()` pour créer des objets avec un prototype spécifique.

## Contexte
`Object.create(proto)` crée un nouvel objet dont le prototype interne `[[Prototype]]` est `proto`. C'est la manière la plus directe de créer une chaîne prototype.

## Instructions

### `create1()` - Méthode partagée via prototype
```javascript
const proto = {
  greet() {
    return `Hello, ${this.name}`;
  }
};
const obj = Object.create(proto);
obj.name = "Alice";
return obj.greet();
```

### `create2()` - Property descriptors
```javascript
const proto = { x: 1 };
const obj = Object.create(proto, {
  y: { value: 2, writable: true, enumerable: true }
});
return [obj.x, obj.y];
```

### `create3()` - Simuler l'héritage
```javascript
const Animal = {
  speak() {
    return `${this.name} makes a sound`;
  }
};

const Dog = Object.create(Animal);
Dog.bark = function() {
  return `${this.name} barks`;
};

const myDog = Object.create(Dog);
myDog.name = "Rex";

return [myDog.speak(), myDog.bark()];
```

## Indice
- `Object.create(proto)` définit le prototype de l'objet créé
- Le second argument permet de définir des propriétés avec leurs descripteurs
- Les méthodes dans le prototype utilisent `this` de l'objet appelant

## Concepts
- Object.create()
- Prototype delegation
- Property descriptors
- Behavioral delegation pattern
