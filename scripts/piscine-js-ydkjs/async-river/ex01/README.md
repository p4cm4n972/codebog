# Ex01 - Event Loop Basics

## Objectif
Comprendre l'event loop et `setTimeout(fn, 0)`.

## Contexte
L'**event loop** (boucle d'événements) permet à JavaScript de gérer l'asynchrone malgré son exécution single-threaded. `setTimeout` planifie une callback dans la **task queue** (file de tâches), qui sera exécutée après que la call stack soit vide.

## Instructions

### `loop1()` - setTimeout(fn, 0)
```javascript
const result = [];

result.push("1");
setTimeout(() => result.push("2"), 0);
result.push("3");

// Attendre que le timeout s'exécute
await new Promise(r => setTimeout(r, 10));
return result;
```

### `loop2()` - Plusieurs setTimeout
```javascript
const result = [];

setTimeout(() => result.push("a"), 0);
setTimeout(() => result.push("b"), 0);
setTimeout(() => result.push("c"), 0);

result.push("sync");

await new Promise(r => setTimeout(r, 10));
return result;
```

### `loop3()` - Ordre par délai
```javascript
const result = [];

setTimeout(() => result.push("timeout 100"), 100);
setTimeout(() => result.push("timeout 0"), 0);
setTimeout(() => result.push("timeout 50"), 50);

result.push("sync");

await new Promise(r => setTimeout(r, 150));
return result;
```

## Indice
- `setTimeout(fn, 0)` n'exécute pas immédiatement, mais dès que possible
- Le code synchrone s'exécute toujours avant les callbacks
- Les callbacks sont exécutées dans l'ordre de leurs délais

## Concepts
- Event loop
- Task queue (macrotask queue)
- setTimeout behavior
- Non-blocking I/O
