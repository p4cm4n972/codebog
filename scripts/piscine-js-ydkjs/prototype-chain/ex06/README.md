# Ex06 - instanceof

## Objectif
Comprendre comment `instanceof` fonctionne vraiment.

## Contexte
`instanceof` vérifie si le prototype d'un constructeur apparaît quelque part dans la chaîne prototype d'un objet. Ce n'est pas une vérification de "type" au sens classique.

## Instructions

### `instance1()` - instanceof basique
```javascript
function Dog() {}
const d = new Dog();
return [
  d instanceof Dog,
  d instanceof Object
];
```

### `instance2()` - Prototype changé après création
```javascript
function Dog() {}
const d = new Dog();

// Changer le prototype après création
Dog.prototype = {};

return d instanceof Dog;
```

### `instance3()` - isPrototypeOf
```javascript
function Dog() {}
const d = new Dog();

return [
  Dog.prototype.isPrototypeOf(d),
  Object.prototype.isPrototypeOf(d)
];
```

### `instance4()` - instanceof avec Object.create
```javascript
const proto = { bark() { return "woof"; } };
const d = Object.create(proto);

function Dog() {}
Dog.prototype = proto;

return d instanceof Dog;
```

## Indice
- `instanceof` vérifie si `Constructor.prototype` est dans la chaîne de `obj`
- Changer `Constructor.prototype` après la création casse `instanceof`
- `isPrototypeOf` fait la même vérification mais depuis le prototype
- Un objet peut être "instanceof" un constructeur créé après lui

## Concepts
- instanceof operator
- Prototype chain check
- isPrototypeOf method
- Dynamic prototype relationship
