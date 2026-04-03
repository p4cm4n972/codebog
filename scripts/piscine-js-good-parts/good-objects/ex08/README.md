# Ex08 - Reflection

## Objectif
Inspecter la structure des objets - introspection et métaprogrammation.

## Vérifier les propriétés

```javascript
const obj = { name: 'Alice' };

// Propriété propre seulement
Object.hasOwn(obj, 'name');        // true (ES2022)
obj.hasOwnProperty('name');        // true (legacy)

// Propriété propre OU héritée
'toString' in obj;                  // true (hérité)

// typeof pour le type
typeof obj.name === 'string';       // true
```

## Lister les propriétés

```javascript
const obj = { a: 1, b: 2 };

Object.keys(obj);    // ['a', 'b'] - clés propres énumérables
Object.values(obj);  // [1, 2] - valeurs propres énumérables
Object.entries(obj); // [['a', 1], ['b', 2]]

// Toutes les propriétés propres (même non-énumérables)
Object.getOwnPropertyNames(obj);
```

## Descripteurs de propriétés

```javascript
Object.getOwnPropertyDescriptor(obj, 'name');
// { value: 'Alice', writable: true, enumerable: true, configurable: true }
```
