# Ex05 - Object Literals

## Objectif
Créer et accéder aux objets avec les littéraux - la forme la plus simple et la plus expressive.

## Création d'objets

```javascript
// ❌ Éviter
const obj = new Object();

// ✅ Préférer
const obj = {};

// Avec propriétés
const person = {
  firstName: 'Alice',
  lastName: 'Smith',
  age: 30
};
```

## Accès aux propriétés

```javascript
// Notation point (quand le nom est un identifiant valide)
person.firstName;  // 'Alice'

// Notation crochets (pour noms dynamiques ou avec caractères spéciaux)
person['firstName'];  // 'Alice'
person['first-name']; // Pour clés avec tirets
```

## Valeur par défaut

```javascript
// || pour valeur par défaut
const name = person.nickname || 'Anonymous';

// ?? pour null/undefined uniquement (ES2020)
const age = person.age ?? 0;
```
