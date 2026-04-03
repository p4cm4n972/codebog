# Ex02 - Microtasks vs Macrotasks

## Objectif
Comprendre la différence entre microtasks et macrotasks.

## Contexte
L'event loop traite deux types de tâches :
- **Macrotasks** : setTimeout, setInterval, I/O
- **Microtasks** : Promise.then, queueMicrotask, MutationObserver

Les microtasks sont **toujours** exécutées avant les macrotasks, et la queue de microtasks est vidée complètement avant de passer à la macrotask suivante.

## Instructions

### `micro1()` - Promise vs setTimeout
```javascript
const result = [];

result.push("1");
setTimeout(() => result.push("timeout"), 0);
Promise.resolve().then(() => result.push("promise"));
result.push("2");

await new Promise(r => setTimeout(r, 10));
return result;
```

### `micro2()` - Chaîne de microtasks
```javascript
const result = [];

setTimeout(() => result.push("timeout 1"), 0);

Promise.resolve()
  .then(() => result.push("promise 1"))
  .then(() => result.push("promise 2"));

setTimeout(() => result.push("timeout 2"), 0);

Promise.resolve().then(() => result.push("promise 3"));

result.push("sync");

await new Promise(r => setTimeout(r, 10));
return result;
```

### `micro3()` - async/await et microtasks
```javascript
const result = [];

async function async1() {
  result.push("async1 start");
  await async2();
  result.push("async1 end");
}

async function async2() {
  result.push("async2");
}

result.push("script start");
setTimeout(() => result.push("timeout"), 0);
async1();

new Promise(resolve => {
  result.push("promise1");
  resolve();
}).then(() => {
  result.push("promise2");
});

result.push("script end");

await new Promise(r => setTimeout(r, 10));
return result;
```

## Indice
- Les microtasks s'exécutent entre chaque macrotask
- `await` crée une microtask pour la suite de la fonction
- La queue de microtasks est vidée avant le prochain setTimeout

## Concepts
- Microtask queue
- Macrotask queue
- Promise microtasks
- async/await scheduling
