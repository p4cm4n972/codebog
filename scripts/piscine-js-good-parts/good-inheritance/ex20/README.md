# Ex20 - Functional Inheritance

## Objectif
L'héritage fonctionnel de Crockford - une approche plus sûre.

## Le pattern

```javascript
function createAnimal(spec) {
  // État privé
  const { name } = spec;

  // Objet de base (optionnel)
  const that = {};

  // Méthodes (ont accès à l'état privé via closure)
  that.getName = () => name;
  that.speak = () => `${name} makes a sound`;

  return that;
}

function createDog(spec) {
  // Hérite d'animal
  const that = createAnimal(spec);

  // Étend avec de nouvelles méthodes
  that.bark = () => `${spec.name} barks`;

  return that;
}

const dog = createDog({ name: 'Rex' });
dog.getName();  // 'Rex'
dog.speak();    // 'Rex makes a sound'
dog.bark();     // 'Rex barks'
```

## Avantages

- Pas de `new` (moins d'erreurs)
- Vrai état privé (via closures)
- Pas de problèmes avec `this`
- Plus flexible que l'héritage classique
