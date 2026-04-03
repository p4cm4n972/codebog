# Ex22 - Parallel Requests

## Objectif
Exécuter plusieurs requêtes en parallèle efficacement.

## Promise.all

```javascript
// Toutes les requêtes en parallèle
const [users, posts, comments] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/comments').then(r => r.json())
]);

// ⚠️ Si une échoue, tout échoue
```

## Promise.allSettled

```javascript
// Toutes les requêtes, même si certaines échouent
const results = await Promise.allSettled([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json()),
  fetch('/api/invalid').then(r => r.json())  // Cette URL n'existe pas
]);

results.forEach(result => {
  if (result.status === 'fulfilled') {
    console.log('Data:', result.value);
  } else {
    console.log('Error:', result.reason);
  }
});
```

## Promise.race et Promise.any

```javascript
// Le premier qui finit (succès ou échec)
const fastest = await Promise.race([
  fetch('/api/server1/data').then(r => r.json()),
  fetch('/api/server2/data').then(r => r.json())
]);

// Le premier succès (ignore les échecs)
const firstSuccess = await Promise.any([
  fetch('/api/primary').then(r => r.json()),
  fetch('/api/backup').then(r => r.json())
]);
```

## Limiter la concurrence

```javascript
async function fetchWithConcurrencyLimit(urls, limit = 5) {
  const results = [];

  for (let i = 0; i < urls.length; i += limit) {
    const batch = urls.slice(i, i + limit);
    const batchResults = await Promise.all(
      batch.map(url => fetch(url).then(r => r.json()))
    );
    results.push(...batchResults);
  }

  return results;
}
```

## Pattern map/collect

```javascript
// Fetch une liste d'IDs
const userIds = [1, 2, 3, 4, 5];

const users = await Promise.all(
  userIds.map(id => fetch(`/api/users/${id}`).then(r => r.json()))
);
```
