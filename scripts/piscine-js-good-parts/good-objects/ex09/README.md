# Ex09 - Enumeration

## Objectif
Parcourir les propriétés d'un objet de manière sûre et idiomatique.

## for...in (à éviter généralement)

```javascript
const obj = { a: 1, b: 2 };

// ⚠️ Parcourt aussi les propriétés héritées!
for (const key in obj) {
  // Toujours filtrer avec hasOwnProperty
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}
```

## Méthodes modernes (préférées)

```javascript
const obj = { a: 1, b: 2, c: 3 };

// ✅ Object.keys + forEach/map
Object.keys(obj).forEach(key => {
  console.log(key, obj[key]);
});

// ✅ Object.entries pour clé ET valeur
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// ✅ Object.values si seules les valeurs comptent
const sum = Object.values(obj).reduce((a, b) => a + b, 0);
```

## Ordre d'énumération

```javascript
// L'ordre est garanti depuis ES2015:
// 1. Clés numériques (croissant)
// 2. Clés string (ordre d'insertion)
// 3. Symbols (ordre d'insertion)
```
