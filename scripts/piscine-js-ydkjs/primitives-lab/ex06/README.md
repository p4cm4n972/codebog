# Ex06 - Falsy Values

## Objectif
Maîtriser les valeurs falsy et la double négation.

## Contexte
En JavaScript, certaines valeurs sont considérées comme "falsy" (équivalentes à false dans un contexte booléen). Toutes les autres sont "truthy". Cette distinction est fondamentale pour comprendre les conditionnels.

## Instructions

### `isFalsy(value)`
Retourne `true` si la valeur est falsy, `false` sinon.
```javascript
isFalsy(0);     // true
isFalsy("hi");  // false
```

### `getAllFalsyValues()`
Retourne un array contenant **toutes** les valeurs falsy de JavaScript.
> Il y en a 8 si on compte -0 et 0n séparément.

### `falsy1()` - `!![]`
Un array vide est-il truthy ?

### `falsy2()` - `!!""`
Une string vide est-elle truthy ?

### `falsy3()` - `!!"false"`
La string "false" est-elle truthy ?

### `falsy4()` - `!!new Boolean(false)`
Un objet Boolean(false) est-il truthy ?

## Les 8 valeurs falsy
1. `false`
2. `0`
3. `-0`
4. `0n` (BigInt zero)
5. `""` (empty string)
6. `null`
7. `undefined`
8. `NaN`

## Piège courant
- `[]` et `{}` sont **truthy** (même vides !)
- `"0"` et `"false"` sont **truthy** (strings non-vides)
- `new Boolean(false)` est **truthy** (c'est un objet !)

## Concepts
- Falsy values
- Truthy values
- Double negation (!!)
- Boolean coercion
- Object wrappers are always truthy
