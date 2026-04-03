# Ex00 - Type Coercion Basics

## Objectif
Comprendre la coercion implicite de type avec l'opérateur `+`.

## Contexte
JavaScript convertit automatiquement les types lors de certaines opérations. L'opérateur `+` est particulièrement tricky car il fait de la concaténation de strings OU de l'addition selon les opérandes. Kyle Simpson insiste : comprendre la coercion, pas l'éviter.

## Instructions

Prédis le résultat de chaque expression. Chaque fonction doit retourner **exactement** ce que l'expression produit.

### `quiz1()` - `[] + {}`
Que se passe-t-il quand on additionne un array vide et un objet vide ?

### `quiz2()` - `{} + []`
Attention : l'ordre compte ! Que retourne cette expression ?
> Note: Dans le contexte d'une fonction, `{}` est un objet, pas un bloc.

### `quiz3()` - `[] + []`
Deux arrays vides additionnés.

### `quiz4()` - `{} + {}`
Deux objets vides additionnés.

### `quiz5()` - `"5" + 3`
String + Number : quelle règle s'applique ?

### `quiz6()` - `"5" - 3`
String - Number : même règle ?

## Indice
- Les arrays se convertissent en string via `.toString()` → `[]` devient `""`
- Les objets se convertissent en `"[object Object]"`
- `+` avec une string → concaténation
- `-` force la conversion en number

## Exemple de raisonnement
```javascript
[] + {}
// [] → "" (toString)
// {} → "[object Object]" (toString)
// "" + "[object Object]" = "[object Object]"
```

## Concepts
- Type coercion (coercition de type)
- ToPrimitive algorithm
- String concatenation vs numeric addition
- Operator overloading with `+`
