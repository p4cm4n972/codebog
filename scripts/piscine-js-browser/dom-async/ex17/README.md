# Ex17 - Fetch Basics

## Objectif
Comprendre l'API Fetch pour les requêtes HTTP.

## Requête GET simple

```javascript
// Syntaxe de base
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Avec async/await
async function getData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}
```

## L'objet Response

```javascript
const response = await fetch(url);

// Propriétés
response.ok;           // true si status 200-299
response.status;       // 200, 404, 500, etc.
response.statusText;   // 'OK', 'Not Found', etc.
response.headers;      // Headers de la réponse
response.url;          // URL finale (après redirections)

// Méthodes pour lire le body (ne peuvent être appelées qu'une fois!)
await response.json();  // Parse en JSON
await response.text();  // Texte brut
await response.blob();  // Binaire (images, fichiers)
await response.arrayBuffer();  // Buffer binaire
await response.formData();     // FormData
```

## Vérifier la réponse

```javascript
async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
```

## Lire les headers

```javascript
const response = await fetch(url);

// Un header spécifique
const contentType = response.headers.get('Content-Type');

// Tous les headers
for (const [key, value] of response.headers) {
  console.log(`${key}: ${value}`);
}
```

## URL avec paramètres

```javascript
const params = new URLSearchParams({
  query: 'javascript',
  page: 1,
  limit: 10
});

const response = await fetch(`/api/search?${params}`);
```
