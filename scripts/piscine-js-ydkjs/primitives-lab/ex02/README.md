# Ex02 - NaN & Infinity

## Objectif
Comprendre les valeurs spéciales `NaN` et `Infinity` en JavaScript.

## Contexte
`NaN` (Not a Number) est paradoxalement de type `number`. C'est la seule valeur qui n'est pas égale à elle-même. `Infinity` représente l'infini mathématique et a ses propres règles.

## Instructions

### NaN

#### `nan1()` - `typeof NaN`
Quel est le type de NaN ?

#### `nan2()` - `isNaN("hello")`
Que retourne la fonction globale `isNaN` avec une string ?

#### `nan3()` - `Number.isNaN("hello")`
Et `Number.isNaN` ?

#### `nan4()` - `NaN === NaN`
NaN est-il égal à lui-même ?

#### `nan5()` - `Object.is(NaN, NaN)`
Et avec `Object.is` ?

### Infinity

#### `inf1()` - `1 / 0`
Division par zéro.

#### `inf2()` - `-1 / 0`
Division négative par zéro.

#### `inf3()` - `Infinity - Infinity`
Infini moins infini.

#### `inf4()` - `0 / 0`
Zéro divisé par zéro.

## Indice
- `isNaN()` coerce d'abord en number, puis vérifie si c'est NaN
- `Number.isNaN()` vérifie d'abord le type (plus strict)
- `Object.is()` est la façon correcte de comparer NaN

## Concepts
- NaN (Not a Number)
- isNaN() vs Number.isNaN()
- Object.is() pour les comparaisons correctes
- Infinity et -Infinity
- Opérations mathématiques spéciales
