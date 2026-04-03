# Ex01 - Property Lookup

## Objectif
Comprendre comment JavaScript remonte la chaîne prototype pour trouver une propriété.

## Contexte
Quand on accède à une propriété, JavaScript la cherche d'abord sur l'objet lui-même. Si elle n'existe pas, il remonte la chaîne prototype jusqu'à la trouver ou atteindre `null`.

## Instructions

### `lookup1()` - Propriété héritée simple
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
return child.x;
```

### `lookup2()` - Chaîne à 3 niveaux
```javascript
const grandparent = { x: 1 };
const parent = Object.create(grandparent);
const child = Object.create(parent);
return child.x;
```

### `lookup3()` - Propriété propre vs héritée
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
child.y = 2;
return [child.x, child.y, parent.y];
```

### `lookup4()` - hasOwnProperty vs in
```javascript
const parent = { x: 1 };
const child = Object.create(parent);
return [
  child.hasOwnProperty("x"),
  "x" in child
];
```

## Indice
- `hasOwnProperty` ne vérifie que les propriétés propres
- L'opérateur `in` vérifie aussi la chaîne prototype
- Une propriété propre masque une propriété héritée

## Concepts
- Property lookup algorithm
- Own properties vs inherited
- hasOwnProperty()
- in operator
