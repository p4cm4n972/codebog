# Ex00 - [[Prototype]] Link

## Objectif
Comprendre le lien prototype interne `[[Prototype]]`.

## Contexte
Chaque objet JavaScript a un lien interne vers un autre objet appelé son **prototype**. Ce lien est accessible via `Object.getPrototypeOf()` (méthode standard) ou `__proto__` (legacy).

## Instructions

### `proto1()` - Prototype d'un objet littéral
```javascript
const obj = {};
return Object.getPrototypeOf(obj) === Object.prototype;
```

### `proto2()` - Chaîne de prototype d'un tableau
```javascript
const arr = [];
return [
  Object.getPrototypeOf(arr) === Array.prototype,
  Object.getPrototypeOf(Array.prototype) === Object.prototype
];
```

### `proto3()` - Prototype d'une instance
```javascript
function Foo() {}
const f = new Foo();
return Object.getPrototypeOf(f) === Foo.prototype;
```

### `proto4()` - Objet sans prototype
```javascript
const obj = Object.create(null);
return Object.getPrototypeOf(obj);
```

## Indice
- Tout objet hérite de `Object.prototype` (sauf `Object.create(null)`)
- `Object.getPrototypeOf(obj)` retourne le prototype de `obj`
- Les tableaux héritent de `Array.prototype`, qui hérite de `Object.prototype`
- `new Foo()` crée un objet dont le prototype est `Foo.prototype`

## Concepts
- [[Prototype]] internal slot
- Object.getPrototypeOf()
- Prototype chain
- Object.create(null)
