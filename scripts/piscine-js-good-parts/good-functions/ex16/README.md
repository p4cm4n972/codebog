# Ex16 - Callbacks

## Objectif
Maîtriser les callbacks - la base de l'asynchrone en JavaScript.

## Callbacks synchrones

```javascript
// Array methods
[1, 2, 3].map(x => x * 2);
[1, 2, 3].filter(x => x > 1);
[1, 2, 3].reduce((sum, x) => sum + x, 0);

// Callbacks personnalisés
function withTiming(fn) {
  const start = Date.now();
  const result = fn();
  console.log(`Took ${Date.now() - start}ms`);
  return result;
}
```

## Callbacks asynchrones

```javascript
// Pattern classique Node.js (error-first)
function readFile(path, callback) {
  // callback(error, data)
}

readFile('file.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

## Inversion de contrôle

```javascript
// Le callback contrôle le flux
function processItems(items, callback) {
  for (const item of items) {
    if (callback(item) === false) break;  // Early exit
  }
}
```
