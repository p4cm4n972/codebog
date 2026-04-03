# Ex05 - WeakMap & WeakSet

## Objectif
Comprendre les références faibles et leurs cas d'usage.

## Contexte
`WeakMap` et `WeakSet` stockent des références "faibles" vers leurs clés/valeurs. Si l'objet n'est plus référencé ailleurs, il peut être garbage collecté. Utilisés pour associer des données privées à des objets.

## Instructions

### `weak1()` - WeakMap basique
```javascript
const wm = new WeakMap();
let obj = { name: "test" };
wm.set(obj, "secret data");

const result = wm.get(obj);
return result;
```

### `weak2()` - Clés doivent être des objets
```javascript
const wm = new WeakMap();
try {
  wm.set("string key", "value");
  return "ok";
} catch (e) {
  return "TypeError";
}
```

### `weak3()` - Pas d'itération
```javascript
const wm = new WeakMap();
const obj = { id: 1 };
wm.set(obj, { privateData: "secret" });

return [
  typeof wm.keys,
  typeof wm.values,
  typeof wm.entries
];
```

### `weak4()` - Use case: données privées
```javascript
const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    privateData.set(this, { name, age });
  }
  getName() {
    return privateData.get(this).name;
  }
  getAge() {
    return privateData.get(this).age;
  }
}

const p = new Person("Alice", 30);
return [p.getName(), p.getAge(), p.name];
```

### `weak5()` - WeakSet
```javascript
const ws = new WeakSet();
const obj = { id: 1 };
ws.add(obj);

return [ws.has(obj), ws.has({ id: 1 })];
```

## Indice
- Les clés de WeakMap doivent être des objets
- WeakMap/WeakSet ne sont pas iterables (pas de `.keys()`, etc.)
- Parfait pour stocker des métadonnées sans empêcher le garbage collection
- WeakSet est utile pour marquer des objets (visited, processed, etc.)

## Concepts
- Weak references
- Garbage collection
- Private data pattern
- Memory management
