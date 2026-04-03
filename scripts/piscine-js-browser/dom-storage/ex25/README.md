# Ex25 - IndexedDB

## Objectif
Utiliser IndexedDB pour le stockage structuré.

## Pourquoi IndexedDB ?
- Grande capacité (50+ MB)
- API asynchrone (ne bloque pas)
- Index et requêtes
- Stockage d'objets (pas seulement strings)
- Transactions

## Ouvrir une base

```javascript
const request = indexedDB.open('myDatabase', 1);

request.onerror = (event) => {
  console.error('Database error:', event.target.error);
};

request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('Database opened');
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Créer un object store (table)
  const store = db.createObjectStore('users', { keyPath: 'id' });

  // Créer des index
  store.createIndex('email', 'email', { unique: true });
  store.createIndex('name', 'name');
};
```

## CRUD Operations

```javascript
// Create/Update
function addUser(db, user) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const request = store.put(user);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Read
function getUser(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Delete
function deleteUser(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readwrite');
    const store = tx.objectStore('users');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get all
function getAllUsers(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

## Wrapper moderne avec Promises

```javascript
async function openDatabase(name, version, onUpgrade) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => onUpgrade(event.target.result);
  });
}
```
