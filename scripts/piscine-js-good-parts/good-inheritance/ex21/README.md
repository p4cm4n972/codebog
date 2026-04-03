# Ex21 - Object Composition

## Objectif
Favoriser la composition plutôt que l'héritage - plus flexible et maintenable.

## Composition vs Inheritance

```javascript
// ❌ Héritage: relation "est un"
class FlyingDog extends Dog { ... }  // Un chien qui vole?

// ✅ Composition: relation "a un"
const flyingDog = {
  ...createDog(),
  ...canFly()
};
```

## Mixins

```javascript
const canSwim = {
  swim() { return `${this.name} swims`; }
};

const canFly = {
  fly() { return `${this.name} flies`; }
};

// Composition
const duck = {
  name: 'Donald',
  ...canSwim,
  ...canFly
};

duck.swim();  // 'Donald swims'
duck.fly();   // 'Donald flies'
```

## Factory avec composition

```javascript
function createDuck(name) {
  return {
    name,
    ...canSwim,
    ...canFly,
    quack() { return `${name} quacks`; }
  };
}
```
