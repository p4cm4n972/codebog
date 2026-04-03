# Good Objects

## Philosophie

En JavaScript, les objets sont des collections dynamiques de propriétés. Contrairement aux objets dans les langages classiques, ils n'ont pas besoin de classes pour exister.

## Les objets comme conteneurs

```javascript
// Un objet est simplement un conteneur de paires clé-valeur
const person = {
  name: 'Alice',
  age: 30,
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};
```

## Accès aux propriétés

```javascript
// Notation point (préférée)
person.name;

// Notation crochets (pour clés dynamiques)
person['name'];
const key = 'age';
person[key];
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 05 | Object Literals | Création et accès |
| 06 | Object Update | Modification et référence |
| 07 | Prototype | Chaîne de prototypes |
| 08 | Reflection | Introspection d'objets |
| 09 | Enumeration | Parcours de propriétés |
| 10 | Global Abatement | Éviter les variables globales |
