# Ex19 - Error Handling

## Objectif
Gérer les erreurs des requêtes HTTP.

## Types d'erreurs

```javascript
// 1. Erreur réseau (pas de connexion, DNS, etc.)
// fetch rejette la promesse

// 2. Erreur HTTP (4xx, 5xx)
// fetch ne rejette PAS! Il faut vérifier response.ok

// 3. Erreur de parsing JSON
// response.json() rejette si le body n'est pas du JSON valide
```

## Pattern de gestion d'erreurs

```javascript
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);

    // Vérifier le status HTTP
    if (!response.ok) {
      // Essayer de parser le message d'erreur de l'API
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }

      throw new Error(`HTTP ${response.status}: ${errorMessage}`);
    }

    return await response.json();

  } catch (error) {
    if (error.name === 'TypeError') {
      // Erreur réseau
      throw new Error('Network error: Unable to reach the server');
    }
    throw error;  // Relancer les autres erreurs
  }
}
```

## Erreurs personnalisées

```javascript
class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function fetchApi(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      data?.message || response.statusText,
      data
    );
  }

  return response.json();
}
```

## Retry automatique

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response.json();
      if (response.status < 500) throw new Error('Client error');
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));  // Backoff
    }
  }
}
```
