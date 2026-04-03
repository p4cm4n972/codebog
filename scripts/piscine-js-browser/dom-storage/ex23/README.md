# Ex23 - localStorage

## Objectif
Stocker des données persistantes dans le navigateur.

## API de base

```javascript
// Stocker
localStorage.setItem('username', 'John');

// Récupérer
const username = localStorage.getItem('username'); // 'John'

// Supprimer
localStorage.removeItem('username');

// Tout effacer
localStorage.clear();

// Nombre d'items
localStorage.length;

// Récupérer une clé par index
localStorage.key(0);  // Nom de la première clé
```

## Stocker des objets

```javascript
// localStorage ne stocke que des strings!
// Il faut sérialiser/désérialiser

// Sauvegarder
const user = { name: 'John', age: 30 };
localStorage.setItem('user', JSON.stringify(user));

// Récupérer
const savedUser = JSON.parse(localStorage.getItem('user'));
```

## Wrapper pratique

```javascript
const storage = {
  get(key, defaultValue = null) {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};
```

## Événement storage

```javascript
// Déclenché quand le storage change dans une AUTRE tab
window.addEventListener('storage', (event) => {
  console.log('Key changed:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('URL:', event.url);
});
```

## Limites
- ~5-10 MB par origine
- Synchrone (peut bloquer le thread principal)
- Pas de date d'expiration
- Même origine seulement
