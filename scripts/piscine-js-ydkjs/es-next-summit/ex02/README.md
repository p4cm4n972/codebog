# Ex02 - Symbols

## Objectif
Découvrir les Symbols et les well-known symbols.

## Contexte
Les Symbols sont un type primitif unique et immutable, souvent utilisés comme clés de propriétés pour éviter les collisions. Les "well-known symbols" permettent de personnaliser le comportement des objets.

## Instructions

### `symbol1()` - Création et type
```javascript
const sym = Symbol("description");
return [typeof sym, sym.toString()];
```

### `symbol2()` - Symbol.toStringTag
```javascript
const obj = {
  [Symbol.toStringTag]: "MyObject"
};
return Object.prototype.toString.call(obj);
```

### `symbol3()` - Symbol.iterator
```javascript
const obj = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};
return [...obj];
```

### `symbol4()` - Symbol.for (global registry)
```javascript
const sym1 = Symbol.for("shared");
const sym2 = Symbol.for("shared");
const sym3 = Symbol("shared");
return [sym1 === sym2, sym1 === sym3];
```

### `symbol5()` - Symbol.keyFor
```javascript
const sym = Symbol.for("test");
return Symbol.keyFor(sym);
```

## Indice
- Chaque `Symbol()` crée une valeur unique
- `Symbol.for()` utilise un registre global partagé
- `Symbol.iterator` rend un objet iterable
- `Symbol.toStringTag` personnalise `[object ...]`

## Concepts
- Symbol primitive
- Well-known symbols
- Symbol registry
- Custom iterables
