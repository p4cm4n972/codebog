# Ex02 - Explicit Binding

## Objectif
Maîtriser `call`, `apply` et `bind`.

## Contexte
Le binding explicite permet de choisir directement la valeur de `this`. `call` et `apply` invoquent immédiatement, `bind` retourne une nouvelle fonction avec `this` fixé.

## Instructions

### `explicit1()` - call
```javascript
function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const person = { name: "Alice" };
return greet.call(person, "Hello");
```

### `explicit2()` - apply
```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: "Bob" };
return greet.apply(person, ["Hi", "!"]);
```

### `explicit3()` - bind gagne sur call
```javascript
function greet() {
  return `Hello, ${this.name}`;
}
const person = { name: "Charlie" };
const bound = greet.bind(person);
return bound.call({ name: "Dave" });
```

### `explicit4()` - bind ne peut pas être re-bind
```javascript
const obj = { name: "obj", greet() { return `Hello, ${this.name}`; } };
const bound = obj.greet.bind({ name: "bound" });
const reBound = bound.bind({ name: "rebound" });
return reBound();
```

## Indice
- `call(thisArg, arg1, arg2, ...)` - arguments séparés
- `apply(thisArg, [args])` - arguments en array
- `bind(thisArg)` - retourne une fonction
- Un `bind` ne peut pas être override par un autre `bind` ou `call`

## Concepts
- call vs apply vs bind
- Hard binding
- bind is permanent
