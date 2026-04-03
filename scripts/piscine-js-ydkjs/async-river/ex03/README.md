# Ex03 - Promise States

## Objectif
Comprendre les trois états d'une Promise : pending, fulfilled, rejected.

## Contexte
Une Promise est un objet représentant l'achèvement ou l'échec d'une opération asynchrone. Elle a trois états :
- **pending** : état initial, ni résolue ni rejetée
- **fulfilled** : opération réussie
- **rejected** : opération échouée

Une Promise ne peut changer d'état qu'une seule fois.

## Instructions

### `state1()` - Promise pending
```javascript
const p = new Promise((resolve) => {
  // Ne jamais résoudre
});
return "pending"; // Quel est l'état de p ?
```

### `state2()` - Multiples résolutions
```javascript
const p = new Promise((resolve, reject) => {
  resolve("first");
  resolve("second");
  reject("error");
});
return p; // Que retourne-t-elle ?
```

### `state3()` - Seule la première compte
```javascript
const p = new Promise((resolve, reject) => {
  resolve("first");
  resolve("second");
});
return await p;
```

### `state4()` - Promise.resolve
```javascript
return Promise.resolve(42);
```

### `state5()` - Promise.reject avec catch
```javascript
return Promise.reject("error").catch(e => `caught: ${e}`);
```

## Indice
- Une Promise ne peut être résolue/rejetée qu'une seule fois
- Les appels suivants à resolve/reject sont ignorés
- `Promise.resolve()` crée une Promise déjà résolue
- `Promise.reject()` crée une Promise déjà rejetée

## Concepts
- Promise states
- State immutability
- Promise.resolve/reject
- Settlement (fulfillment or rejection)
