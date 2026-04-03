# Ex04 - typeof Quirks

## Objectif
Maîtriser l'opérateur `typeof` et ses bizarreries historiques.

## Contexte
L'opérateur `typeof` retourne une string indiquant le type d'une valeur. Cependant, certains résultats sont surprenants à cause de décisions historiques (bugs conservés pour la rétrocompatibilité).

## Instructions

### `type1()` - `typeof undefined`
Le type de undefined.

### `type2()` - `typeof null`
Le type de null.
> C'est le bug le plus célèbre de JavaScript, conservé pour la rétrocompatibilité.

### `type3()` - `typeof function() {}`
Le type d'une fonction.

### `type4()` - `typeof []`
Le type d'un array.

### `type5()` - `typeof Symbol("test")`
Le type d'un Symbol (ES6).

### `type6()` - `typeof 42n`
Le type d'un BigInt (ES2020).

### `type7()` - `typeof undeclaredVariable`
Que retourne typeof sur une variable non déclarée ?
> Contrairement à l'accès direct qui throw une ReferenceError, typeof est "safe".

## Indice
Les 8 valeurs possibles de typeof :
1. `"undefined"`
2. `"boolean"`
3. `"number"`
4. `"string"`
5. `"symbol"`
6. `"bigint"`
7. `"object"` (inclut null, arrays, et objets)
8. `"function"` (sous-type spécial de object)

## Concepts
- typeof operator
- Historical bugs (typeof null)
- Function as special subtype
- typeof safety with undeclared variables
- ES6+ new types (symbol, bigint)
