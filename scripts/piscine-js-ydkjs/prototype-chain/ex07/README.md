# Ex07 - Mixins & Composition

## Objectif
Découvrir les alternatives à l'héritage classique : mixins et composition.

## Contexte
L'héritage classique (single inheritance) a des limites. Les mixins permettent de "mélanger" des comportements de plusieurs sources. La composition favorise "has-a" plutôt que "is-a".

## Instructions

### `mixin1()` - Object.assign pour mixer des comportements
```javascript
const canWalk = {
  walk() {
    return `${this.name} walks`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} swims`;
  }
};

function Duck(name) {
  this.name = name;
}

Object.assign(Duck.prototype, canWalk, canSwim);

const d = new Duck("Donald");
return [d.walk(), d.swim()];
```

### `mixin2()` - Mixin avec état privé (factory)
```javascript
const withCounter = (obj) => {
  let count = 0;
  obj.increment = () => ++count;
  obj.getCount = () => count;
  return obj;
};

const obj = withCounter({ name: "counter" });
obj.increment();
obj.increment();
return obj.getCount();
```

### `mixin3()` - Composition over inheritance
```javascript
const createDog = (name) => {
  const state = { name };

  return {
    getName: () => state.name,
    bark: () => `${state.name} barks`,
    walk: () => `${state.name} walks`
  };
};

const dog = createDog("Rex");
return [dog.getName(), dog.bark()];
```

## Indice
- `Object.assign` copie les propriétés d'un objet à un autre
- Les mixins ajoutent des comportements sans héritage
- Les factories (fonctions qui retournent des objets) permettent l'encapsulation
- "Composition over inheritance" est un principe de design

## Concepts
- Mixins pattern
- Object.assign
- Factory functions
- Composition
- Encapsulation via closures
