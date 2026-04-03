# Ex18 - POST and Other Methods

## Objectif
Envoyer des données avec différentes méthodes HTTP.

## POST avec JSON

```javascript
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com'
  })
});

const newUser = await response.json();
```

## POST avec FormData

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('name', 'document.pdf');

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData  // Content-Type automatique (multipart/form-data)
});
```

## PUT et PATCH

```javascript
// PUT: remplacer entièrement
await fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

// PATCH: mise à jour partielle
await fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane' })
});
```

## DELETE

```javascript
const response = await fetch('/api/users/1', {
  method: 'DELETE'
});

if (response.ok) {
  console.log('Deleted successfully');
}
```

## HEAD et OPTIONS

```javascript
// HEAD: comme GET mais sans body (pour vérifier l'existence)
const response = await fetch('/api/resource', {
  method: 'HEAD'
});
console.log(response.ok);  // true si existe

// OPTIONS: méthodes autorisées (CORS preflight)
const response = await fetch('/api/resource', {
  method: 'OPTIONS'
});
```
