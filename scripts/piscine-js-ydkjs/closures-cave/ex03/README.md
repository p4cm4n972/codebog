# Ex03 - Private State

## Objectif
Créer des "classes" avec état vraiment privé via closure.

## Contexte
Contrairement aux classes ES6 avec `#private`, les closures offrent une encapsulation totale. La variable privée n'existe même pas sur l'objet, elle est uniquement dans le scope de la closure.

## Instructions

### `createPerson(name, age)`
Crée une "personne" avec état privé et méthodes publiques.

```javascript
function createPerson(name, age) {
  let _name = name;
  let _age = age;

  return {
    getName() { return _name; },
    getAge() { return _age; },
    birthday() { _age++; },
    rename(newName) {
      if (typeof newName === "string" && newName.length > 0) {
        _name = newName;
      }
    }
  };
}
```

### `testPrivate()`
```javascript
const person = createPerson("Alice", 25);
person.birthday();
person._age = 100;  // Tentative de modification directe
person.rename("Bob");
return [person.getName(), person.getAge()];
```

## Indice
- `_name` et `_age` sont des conventions, pas une vraie protection
- La vraie protection vient de la closure : les variables ne sont pas sur l'objet
- `person._age = 100` crée une **nouvelle propriété** `_age`, n'affecte pas la closure

## Concepts
- True private state
- Closure-based encapsulation
- Property shadowing vs closure variables
- Validation in setters
