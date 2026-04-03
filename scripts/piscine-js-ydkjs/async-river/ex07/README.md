# Ex07 - Async Iteration

## Objectif
Découvrir l'itération asynchrone avec `for await...of` et les générateurs async.

## Contexte
JavaScript permet d'itérer sur des sources de données asynchrones :
- `for await...of` : itère sur des Promises ou des async iterables
- Async generators : fonctions qui produisent des valeurs de manière asynchrone

## Instructions

### `asyncIter1()` - for await sur tableau de Promises
```javascript
const result = [];

const asyncArray = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

for await (const val of asyncArray) {
  result.push(val);
}

return result;
```

### `asyncIter2()` - Async generator
```javascript
async function* asyncGenerator() {
  yield await Promise.resolve(1);
  yield await Promise.resolve(2);
  yield await Promise.resolve(3);
}

const result = [];
for await (const val of asyncGenerator()) {
  result.push(val);
}
return result;
```

### `asyncIter3()` - Countdown async
```javascript
async function* countdown(n) {
  while (n > 0) {
    yield n--;
    await new Promise(r => setTimeout(r, 10));
  }
}

const result = [];
for await (const val of countdown(3)) {
  result.push(val);
}
return result;
```

## Indice
- `for await...of` attend chaque Promise avant de continuer
- `async function*` crée un générateur asynchrone
- `yield` dans un async generator peut être utilisé avec `await`
- Les async iterables implémentent `Symbol.asyncIterator`

## Concepts
- for await...of
- Async generators
- Symbol.asyncIterator
- Lazy async sequences
