# Ex03 - Guard Expressions

## Objectif
Utiliser `&&` et `||` pour le contrôle de flux de manière idiomatique.

## Short-circuit evaluation

```javascript
// && retourne le premier falsy ou le dernier truthy
true && 'hello'     // 'hello'
false && 'hello'    // false
'a' && 'b' && 'c'   // 'c'

// || retourne le premier truthy ou le dernier falsy
false || 'default'  // 'default'
'value' || 'default' // 'value'
null || undefined || 'last' // 'last'
```

## Patterns idiomatiques

```javascript
// Guard clause - exécute seulement si condition vraie
isAdmin && deleteUser(id);

// Valeur par défaut
const name = user.name || 'Anonymous';

// Chaînage sécurisé (avant optional chaining)
const city = user && user.address && user.address.city;

// Moderne avec optional chaining
const city = user?.address?.city;
```
