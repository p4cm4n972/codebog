# Ex05 - Error Propagation

## Objectif
Comprendre la propagation d'erreurs avec try/catch et async/await.

## Contexte
Avec async/await, les erreurs peuvent être gérées avec try/catch de manière synchrone. Une erreur non attrapée dans une fonction async remonte à l'appelant.

## Instructions

### `error1()` - try/catch avec await
```javascript
try {
  await Promise.reject("error");
  return "no error";
} catch (e) {
  return `caught: ${e}`;
}
```

### `error2()` - Promise rejetée stockée
```javascript
const p = Promise.reject("error");

try {
  const result = await p;
  return result;
} catch (e) {
  return `caught: ${e}`;
}
```

### `error3()` - throw dans async function
```javascript
async function failing() {
  throw new Error("oops");
}

try {
  await failing();
  return "ok";
} catch (e) {
  return e.message;
}
```

### `error4()` - Erreur qui remonte
```javascript
async function outer() {
  async function inner() {
    throw new Error("inner error");
  }
  // Pas de try/catch ici
  await inner();
}

try {
  await outer();
  return "ok";
} catch (e) {
  return e.message;
}
```

## Indice
- `await` sur une Promise rejetée lance une exception
- `throw` dans une async function rejette la Promise retournée
- Les erreurs remontent la chaîne d'appels jusqu'au premier catch
- Sans catch, l'erreur devient une "unhandled rejection"

## Concepts
- Error propagation
- try/catch with async/await
- Unhandled rejections
- Error bubbling
