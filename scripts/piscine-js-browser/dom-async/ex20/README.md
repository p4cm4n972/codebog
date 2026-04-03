# Ex20 - Request Headers

## Objectif
Configurer les headers des requêtes HTTP.

## Headers courants

```javascript
const response = await fetch('/api/data', {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
});
```

## L'objet Headers

```javascript
// Créer des headers
const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.set('Authorization', 'Bearer token');

// Vérifier/récupérer
headers.has('Content-Type');  // true
headers.get('Authorization'); // 'Bearer token'

// Itérer
for (const [key, value] of headers) {
  console.log(`${key}: ${value}`);
}

// Supprimer
headers.delete('X-Custom-Header');
```

## Options de fetch

```javascript
fetch(url, {
  method: 'POST',
  headers: { ... },
  body: JSON.stringify(data),

  // Mode CORS
  mode: 'cors',     // Défaut: requête cross-origin
  mode: 'same-origin', // Même origine seulement
  mode: 'no-cors',  // Pas de CORS (réponse opaque)

  // Credentials (cookies)
  credentials: 'same-origin', // Défaut: cookies même origine
  credentials: 'include',     // Toujours envoyer les cookies
  credentials: 'omit',        // Jamais de cookies

  // Cache
  cache: 'default',
  cache: 'no-store',   // Pas de cache
  cache: 'reload',     // Ignorer le cache, mettre à jour
  cache: 'no-cache',   // Vérifier avec le serveur
  cache: 'force-cache', // Utiliser le cache même périmé

  // Redirection
  redirect: 'follow',  // Défaut: suivre
  redirect: 'error',   // Erreur si redirection
  redirect: 'manual',  // Ne pas suivre, retourner la redirection
});
```

## Authentification

```javascript
// Bearer Token
const headers = {
  'Authorization': `Bearer ${accessToken}`
};

// Basic Auth
const credentials = btoa(`${username}:${password}`);
const headers = {
  'Authorization': `Basic ${credentials}`
};

// API Key
const headers = {
  'X-API-Key': apiKey
};
```
