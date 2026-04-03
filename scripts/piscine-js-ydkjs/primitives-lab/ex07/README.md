# Ex07 - BigInt & Symbols

## Objectif
Maîtriser les deux nouveaux types primitifs : BigInt (ES2020) et Symbol (ES6).

## Contexte
BigInt permet de représenter des entiers arbitrairement grands. Symbol crée des identifiants uniques, utiles pour les propriétés "cachées" d'objets.

## Instructions

### BigInt

#### `bigint1()` - `typeof 42n`
Quel est le type d'un BigInt ?

#### `bigint2()` - `42n === 42`
Un BigInt est-il strictement égal à un Number ?

#### `bigint3()` - `42n == 42`
Et avec l'égalité abstraite ?

#### `bigint4()`
Peut-on mélanger BigInt et Number dans une opération arithmétique ?
```javascript
try {
  return 42n + 1;
} catch (e) {
  return "TypeError";
}
```

### Symbol

#### `symbol1()` - `typeof Symbol("test")`
Quel est le type d'un Symbol ?

#### `symbol2()` - `Symbol("test") === Symbol("test")`
Deux Symbols avec la même description sont-ils égaux ?

#### `symbol3()` - `Symbol.for("test") === Symbol.for("test")`
Et avec `Symbol.for()` (registre global) ?

#### `symbol4()`
```javascript
const sym = Symbol("hidden");
const obj = { [sym]: "secret", visible: "public" };
return Object.keys(obj).length;
```
Les clés Symbol sont-elles énumérables par `Object.keys()` ?

## Indice
- BigInt : suffixe `n` ou `BigInt(value)`
- Pas de mélange implicite BigInt/Number
- `Symbol("desc")` crée toujours un symbol unique
- `Symbol.for("key")` utilise un registre global partagé
- `Object.keys()` n'inclut pas les Symbols

## Concepts
- BigInt primitive type
- BigInt arithmetic restrictions
- Symbol uniqueness
- Symbol.for() global registry
- Symbol as property key
- Object.getOwnPropertySymbols()
