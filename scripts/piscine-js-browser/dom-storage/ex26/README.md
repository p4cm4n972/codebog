# Ex26 - Cookies & Storage Patterns

## Objectif
Comprendre les cookies et choisir le bon stockage.

## Cookies

```javascript
// Lire tous les cookies
document.cookie;  // "name=value; other=data"

// Écrire un cookie
document.cookie = "username=John";

// Avec options
document.cookie = "username=John; max-age=3600; path=/; secure";

// Options disponibles:
// - max-age: durée en secondes
// - expires: date d'expiration
// - path: chemin d'application
// - domain: domaine d'application
// - secure: HTTPS seulement
// - samesite: strict/lax/none
```

## Wrapper pour les cookies

```javascript
const cookies = {
  get(name) {
    const value = document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='));
    return value ? decodeURIComponent(value.split('=')[1]) : null;
  },

  set(name, value, options = {}) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
    if (options.path) cookie += `; path=${options.path}`;
    if (options.secure) cookie += '; secure';
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    document.cookie = cookie;
  },

  delete(name) {
    document.cookie = `${name}=; max-age=0`;
  }
};
```

## Comparaison des storages

| | Cookies | localStorage | sessionStorage | IndexedDB |
|--|--|--|--|--|
| Taille | ~4KB | ~5-10MB | ~5-10MB | 50+MB |
| Envoyé au serveur | Oui | Non | Non | Non |
| Expiration | Configurable | Jamais | Session | Jamais |
| API | String | Sync | Sync | Async |
| Cas d'usage | Auth, tracking | Préférences | État temporaire | Gros data |

## Patterns de stockage

```javascript
// Factory pattern pour abstraction
function createStorage(type) {
  switch (type) {
    case 'local':
      return {
        get: key => JSON.parse(localStorage.getItem(key)),
        set: (key, value) => localStorage.setItem(key, JSON.stringify(value))
      };
    case 'session':
      return {
        get: key => JSON.parse(sessionStorage.getItem(key)),
        set: (key, value) => sessionStorage.setItem(key, JSON.stringify(value))
      };
    case 'memory':
      const store = new Map();
      return {
        get: key => store.get(key),
        set: (key, value) => store.set(key, value)
      };
  }
}
```

## Quand utiliser quoi ?
- **Cookies**: Authentification, données envoyées au serveur
- **localStorage**: Préférences utilisateur, cache long-terme
- **sessionStorage**: État de navigation, données temporaires
- **IndexedDB**: Gros fichiers, données structurées, offline
