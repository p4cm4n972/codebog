# Ex03 - Iterators & Generators

## Objectif
Maîtriser le protocole d'itération et les générateurs.

## Contexte
Les générateurs (`function*`) sont des fonctions qui peuvent être pausées et reprises. Ils implémentent le protocole d'itération et permettent de créer des séquences paresseuses (lazy evaluation).

## Instructions

### `gen1()` - Générateur simple
```javascript
function* simple() {
  yield 1;
  yield 2;
  yield 3;
}
return [...simple()];
```

### `gen2()` - return vs yield
```javascript
function* withReturn() {
  yield 1;
  yield 2;
  return 3;
}
return [...withReturn()];
```

### `gen3()` - Générateur range
```javascript
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}
return [...range(5, 8)];
```

### `gen4()` - yield* (délégation)
```javascript
function* delegating() {
  yield 1;
  yield* [2, 3];
  yield 4;
}
return [...delegating()];
```

### `gen5()` - Communication bidirectionnelle
```javascript
function* twoWay() {
  const x = yield "first";
  const y = yield x + " second";
  return y;
}

const gen = twoWay();
const r1 = gen.next();
const r2 = gen.next("received");
const r3 = gen.next("final");

return [r1.value, r2.value, r3.value];
```

## Indice
- `yield` pause le générateur et retourne une valeur
- `return` termine le générateur (valeur non incluse dans spread)
- `yield*` délègue à un autre iterable
- `gen.next(value)` envoie une valeur au générateur

## Concepts
- Generator functions
- yield expression
- yield* delegation
- Two-way communication
