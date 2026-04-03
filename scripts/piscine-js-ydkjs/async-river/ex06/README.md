# Ex06 - Promise Combinators

## Objectif
Maîtriser Promise.all, race, any et allSettled.

## Contexte
JavaScript fournit des méthodes statiques pour gérer plusieurs Promises :
- `Promise.all` : attend que toutes soient résolues (ou une rejetée)
- `Promise.race` : retourne la première à se terminer
- `Promise.any` : retourne la première résolue
- `Promise.allSettled` : attend toutes, retourne leurs états

## Instructions

### `all1()` - Promise.all succès
```javascript
return Promise.all([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
]);
```

### `all2()` - Promise.all avec erreur
```javascript
try {
  return await Promise.all([
    Promise.resolve(1),
    Promise.reject("error"),
    Promise.resolve(3)
  ]);
} catch (e) {
  return `caught: ${e}`;
}
```

### `race1()` - Promise.race
```javascript
return Promise.race([
  new Promise(r => setTimeout(() => r("slow"), 100)),
  new Promise(r => setTimeout(() => r("fast"), 10))
]);
```

### `any1()` - Promise.any
```javascript
return Promise.any([
  Promise.reject("error 1"),
  Promise.resolve("success"),
  Promise.reject("error 2")
]);
```

### `settled1()` - Promise.allSettled
```javascript
return Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3)
]);
```

## Indice
- `Promise.all` échoue dès qu'une Promise échoue
- `Promise.race` retourne la première terminée (succès ou échec)
- `Promise.any` ignore les rejets jusqu'au premier succès
- `Promise.allSettled` ne rejette jamais, retourne tous les résultats

## Concepts
- Promise.all
- Promise.race
- Promise.any
- Promise.allSettled
- Parallel execution
