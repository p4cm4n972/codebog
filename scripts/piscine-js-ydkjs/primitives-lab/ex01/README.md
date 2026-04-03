# Ex01 - Equality Operators

## Objectif
Comprendre la différence entre `==` (égalité abstraite) et `===` (égalité stricte).

## Contexte
L'Abstract Equality Algorithm (==) applique des règles de coercion avant de comparer. L'égalité stricte (===) compare type ET valeur sans coercion. Kyle Simpson recommande de comprendre ces règles plutôt que d'éviter `==` aveuglément.

## Instructions

Prédis le résultat de chaque comparaison (`true` ou `false`).

### `eq1()` - `null == undefined`
Cas spécial dans la spec ECMAScript.

### `eq2()` - `null === undefined`
Même comparaison en mode strict.

### `eq3()` - `NaN == NaN`
NaN est-il égal à lui-même ?

### `eq4()` - `[] == false`
Comment un array vide se compare à `false` ?

### `eq5()` - `[] == ![]`
Le cas le plus confus de JavaScript !

### `eq6()` - `"0" == false`
String "0" vs booléen false.

### `eq7()` - `" \\t\\n" == 0`
String avec uniquement des whitespaces vs 0.

## Indice - Abstract Equality Algorithm
1. Si les types sont identiques → comparaison directe
2. `null == undefined` → `true` (cas spécial)
3. Number vs String → String converti en Number
4. Boolean impliqué → Boolean converti en Number d'abord
5. Object vs Primitive → Object converti via ToPrimitive

## Exemple de raisonnement
```javascript
[] == false
// false → 0 (Boolean to Number)
// [] == 0
// [] → "" (ToPrimitive)
// "" == 0
// "" → 0 (String to Number)
// 0 == 0 → true
```

## Concepts
- Abstract Equality (==) vs Strict Equality (===)
- ECMAScript Abstract Equality Algorithm
- Type coercion rules
- Special cases: null, undefined, NaN
