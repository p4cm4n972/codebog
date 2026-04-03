# Ex04 - Objects Introduction

## Objectif
Maîtriser les objets JavaScript : création, accès et manipulation.

## Contexte
Les objets sont des collections de paires clé-valeur. Ils sont au cœur de JavaScript et permettent de structurer les données de manière flexible.

## Instructions

### `createObject()`
Crée un objet `person = { name: "Alice", age: 30, city: "Paris" }`.
Retourne `person.name`.

### `accessProperty()`
Crée `car = { brand: "Tesla", model: "Model 3" }`.
Deux façons d'accéder aux propriétés :
- Notation point : `car.brand`
- Notation crochet : `car["model"]` ou `car[key]`
Retourne `[car.brand, car["model"]]`.

### `modifyObject()`
Crée `user = { name: "Bob" }`, puis :
- Ajoute `user.age = 25`
- Modifie `user.name = "Robert"`
- Supprime `delete user.age`
Retourne l'objet final.

### `objectShorthand()`
Avec ES6, si la variable a le même nom que la propriété :
```javascript
const name = "Charlie";
const age = 35;
const person = { name, age }; // Shorthand
```
Retourne cet objet.

### `nestedObject()`
Crée un objet imbriqué et accède à une propriété profonde :
```javascript
const company = {
  name: "TechCorp",
  address: { city: "Lyon", zip: "69000" }
};
```
Retourne `company.address.city`.

### `objectMethods()`
Utilise les méthodes statiques d'Object :
- `Object.keys(obj)` - tableau des clés
- `Object.values(obj)` - tableau des valeurs
- `Object.entries(obj)` - tableau de paires [clé, valeur]
Retourne `[keys, values, entries]` pour `{ a: 1, b: 2, c: 3 }`.

## Exemple
```javascript
createObject();      // "Alice"
accessProperty();    // ["Tesla", "Model 3"]
modifyObject();      // { name: "Robert" }
objectShorthand();   // { name: "Charlie", age: 35 }
nestedObject();      // "Lyon"
```

## Concepts
- Création d'objets littéraux
- Notation point vs crochet
- Ajout, modification, suppression de propriétés
- Property shorthand (ES6)
- Objects imbriqués
- `Object.keys()`, `Object.values()`, `Object.entries()`
