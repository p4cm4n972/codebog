# Ex02 - Truthy & Falsy

## Objectif
Comprendre les valeurs "falsy" et utiliser cette connaissance pour écrire du code concis.

## Les 6 valeurs Falsy

```javascript
false       // Boolean false
null        // Absence intentionnelle de valeur
undefined   // Valeur non assignée
0           // Zéro numérique
NaN         // Not a Number
''          // String vide
```

Tout le reste est **truthy**, y compris :
- `[]` (tableau vide)
- `{}` (objet vide)
- `'0'` (string "0")
- `'false'` (string "false")

## Pattern idiomatique

```javascript
// Vérifier si une valeur existe
if (value) {
  // value est truthy
}

// Valeur par défaut (avant nullish coalescing)
const name = userName || 'Anonymous';

// Avec nullish coalescing (moderne)
const count = userCount ?? 0;
```
