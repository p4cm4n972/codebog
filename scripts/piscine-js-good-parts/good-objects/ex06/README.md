# Ex06 - Object Update

## Objectif
Comprendre la modification des objets et le passage par référence.

## Modification de propriétés

```javascript
const person = { name: 'Alice', age: 30 };

// Mise à jour
person.age = 31;

// Ajout de propriété
person.city = 'Paris';

// Les objets sont mutables par défaut
```

## Passage par référence

```javascript
const a = { value: 1 };
const b = a;  // b pointe vers le même objet

b.value = 2;
console.log(a.value);  // 2 - a est aussi modifié!
```

## Copie superficielle vs profonde

```javascript
// Copie superficielle (shallow)
const copy = { ...original };
const copy2 = Object.assign({}, original);

// Les objets imbriqués sont toujours partagés
original.nested.value = 'changed';
copy.nested.value;  // 'changed' aussi!

// Copie profonde (deep)
const deepCopy = structuredClone(original);
```
