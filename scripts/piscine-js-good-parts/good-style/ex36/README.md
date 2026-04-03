# Ex36 - Refactoring

## Objectif
Améliorer du code existant sans changer son comportement.

## Extraire des fonctions

```javascript
// ❌ Avant: tout dans une fonction
function processOrder(order) {
  // 50 lignes de validation...
  // 30 lignes de calcul...
  // 20 lignes de formatage...
}

// ✅ Après: fonctions dédiées
function processOrder(order) {
  const validated = validateOrder(order);
  const calculated = calculateTotals(validated);
  return formatOrder(calculated);
}
```

## Remplacer magic numbers

```javascript
// ❌ Nombre magique
if (user.age >= 18) { ... }

// ✅ Constante nommée
const LEGAL_AGE = 18;
if (user.age >= LEGAL_AGE) { ... }
```

## Simplifier les conditions

```javascript
// ❌ Complexe
if (user && user.role === 'admin' || user && user.permissions.includes('manage')) {
  ...
}

// ✅ Extrait dans une fonction
function canManage(user) {
  if (!user) return false;
  return user.role === 'admin' || user.permissions.includes('manage');
}

if (canManage(user)) { ... }
```
