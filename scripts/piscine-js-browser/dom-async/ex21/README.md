# Ex21 - AbortController

## Objectif
Annuler des requêtes HTTP avec AbortController.

## Utilisation de base

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
    }
  });

// Annuler la requête
controller.abort();
```

## Timeout avec AbortController

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
```

## AbortSignal.timeout() (moderne)

```javascript
// Méthode moderne (Node 18+, navigateurs récents)
const response = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000)
});
```

## Annuler plusieurs requêtes

```javascript
const controller = new AbortController();

// Toutes ces requêtes partagent le même signal
const requests = [
  fetch('/api/users', { signal: controller.signal }),
  fetch('/api/posts', { signal: controller.signal }),
  fetch('/api/comments', { signal: controller.signal })
];

// Un seul abort annule tout
controller.abort();
```

## Pattern de recherche avec annulation

```javascript
let currentController = null;

async function search(query) {
  // Annuler la recherche précédente
  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  try {
    const response = await fetch(`/api/search?q=${query}`, {
      signal: currentController.signal
    });
    return response.json();
  } catch (error) {
    if (error.name !== 'AbortError') {
      throw error;
    }
  }
}
```
