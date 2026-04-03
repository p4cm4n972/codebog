# Ex04 - Arrow Functions

## Objectif
Comprendre que les arrow functions n'ont pas leur propre `this`.

## Contexte
Les arrow functions héritent `this` du scope lexical où elles sont définies. Elles ne peuvent pas être re-bindées avec `call`, `apply` ou `bind`.

## Instructions

### `arrow1()` - Arrow vs Regular
```javascript
const obj = {
  name: "obj",
  regular() { return this.name; },
  arrow: () => this.name
};
return [obj.regular(), obj.arrow()];
```

### `arrow2()` - Arrow dans une méthode
```javascript
const obj = {
  name: "obj",
  getGreeter() {
    return () => `Hello, ${this.name}`;
  }
};
const greeter = obj.getGreeter();
return greeter();
```

### `arrow3()` - call n'affecte pas arrow
```javascript
const obj = {
  name: "obj",
  getGreeter() {
    return () => `Hello, ${this.name}`;
  }
};
const greeter = obj.getGreeter();
return greeter.call({ name: "other" });
```

### `arrow4()` - Arrow dans objet imbriqué
```javascript
const obj = {
  name: "obj",
  nested: {
    name: "nested",
    getArrow() {
      return () => this.name;
    }
  }
};
return obj.nested.getArrow()();
```

## Indice
- Arrow function : `this` = `this` du scope où elle est **définie**
- Méthode arrow directe sur objet : `this` = scope global
- Arrow dans une méthode : `this` = `this` de la méthode
- `call`/`apply`/`bind` sont ignorés pour les arrows

## Concepts
- Lexical this
- Arrow functions vs regular functions
- this capture at definition time
- call/apply/bind ignored
