# Ex01 - Spread & Rest

## Objectif
Maîtriser l'opérateur spread dans différents contextes.

## Contexte
L'opérateur spread (`...`) "étale" un iterable. Il est utilisé pour copier/fusionner des tableaux et objets, et pour collecter des arguments de fonction (rest parameters).

## Instructions

### `spread1()` - Fusion de tableaux
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
return [...arr1, ...arr2];
```

### `spread2()` - Fusion d'objets
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
return { ...obj1, ...obj2 };
```

### `spread3()` - Spread sur string
```javascript
const str = "hello";
return [...str];
```

### `spread4()` - Rest parameters
```javascript
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
return sum(1, 2, 3, 4);
```

### `spread5()` - Shallow copy
```javascript
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.nested.b = 999;
return original.nested.b;
```

### `spread6()` - Objet non-iterable
```javascript
const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
try {
  return [...obj];
} catch (e) {
  return "TypeError";
}
```

## Indice
- Le spread crée une copie **superficielle** (shallow copy)
- Le dernier spread gagne pour les propriétés en conflit
- Les strings sont iterables (caractère par caractère)
- Un array-like n'est pas forcément iterable

## Concepts
- Spread operator
- Rest parameters
- Shallow copy
- Iterables
