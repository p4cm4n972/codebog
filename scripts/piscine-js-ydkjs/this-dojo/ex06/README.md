# Ex06 - Lost this

## Objectif
Comprendre comment `this` est "perdu" dans les callbacks et comment le préserver.

## Contexte
Quand on passe une méthode comme callback, elle perd son contexte original. C'est un bug classique en JavaScript.

## Instructions

### `lost1()` - Méthode passée en callback
```javascript
const obj = {
  name: "obj",
  greet() {
    return `Hello, ${this.name}`;
  }
};
const fn = obj.greet;
return fn();
```

### `lost2()` - Fix avec bind
```javascript
const obj = {
  name: "obj",
  greet() {
    return `Hello, ${this.name}`;
  }
};
const fn = obj.greet.bind(obj);
return fn();
```

### `lost3()` - Fix avec arrow function
```javascript
const obj = {
  name: "obj",
  greet() {
    return `Hello, ${this.name}`;
  }
};
const fn = () => obj.greet();
return fn();
```

### `lost4()` - setTimeout perd this
```javascript
const obj = {
  name: "obj",
  delayedGreet() {
    // Simule setTimeout synchrone
    const callback = function() {
      return `Hello, ${this.name}`;
    };
    return callback();
  }
};
return obj.delayedGreet();
```

### `lost5()` - Fix setTimeout avec arrow
```javascript
const obj = {
  name: "obj",
  delayedGreet() {
    // Arrow capture this de delayedGreet
    const callback = () => {
      return `Hello, ${this.name}`;
    };
    return callback();
  }
};
return obj.delayedGreet();
```

## Indice
- `const fn = obj.method` extrait la fonction sans son contexte
- `bind()` crée une nouvelle fonction avec `this` fixé
- Arrow functions n'ont pas leur propre `this`
- Dans `setTimeout`, le callback perd `this` (default binding)

## Concepts
- Lost context problem
- Callback binding
- Self/that pattern (legacy)
- Arrow function solution
- bind() solution
