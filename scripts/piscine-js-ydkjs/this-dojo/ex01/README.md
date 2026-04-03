# Ex01 - Implicit Binding

## Objectif
Comprendre que `this` = l'objet avant le point.

## Contexte
Quand une fonction est appelée comme méthode d'un objet (`obj.fn()`), `this` est automatiquement bindé à cet objet. C'est le "implicit binding".

## Instructions

### `implicit1()` - Cas simple
```javascript
const obj = {
  name: "obj",
  getName() { return this.name; }
};
return obj.getName();
```

### `implicit2()` - Perte du contexte
```javascript
const obj = {
  name: "obj",
  getName() { return this.name; }
};
const fn = obj.getName;
return fn();  // Quel this ?
```

### `implicit3()` - Objet imbriqué
```javascript
const obj = {
  name: "outer",
  inner: {
    name: "inner",
    getName() { return this.name; }
  }
};
return obj.inner.getName();
```

### `implicit4()` - Réassignation de méthode
```javascript
const obj = { name: "obj", getName() { return this.name; } };
const other = { name: "other" };
other.fn = obj.getName;
return other.fn();
```

## Indice
- `this` = l'objet **immédiatement** avant le point
- Extraire une méthode perd le binding implicite
- Réassigner une méthode change le binding

## Concepts
- Implicit binding rule
- Lost binding
- Immediate object reference
- Method borrowing
