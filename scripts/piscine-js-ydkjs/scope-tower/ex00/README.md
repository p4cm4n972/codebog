# Ex00 - Lexical Scope

## Objectif
Comprendre le scope lexical et la résolution de variables.

## Contexte
JavaScript utilise un **scope lexical** (aussi appelé scope statique). Cela signifie que le scope d'une variable est déterminé par sa position dans le code source, pas par où la fonction est appelée.

## Instructions

Prédis la valeur retournée par chaque fonction.

### `scope1()`
```javascript
const x = 1;
function inner() {
  return x;
}
return inner();
```

### `scope2()`
```javascript
const x = 1;
function inner() {
  const x = 2;  // shadowing
  return x;
}
return inner();
```

### `scope3()`
```javascript
const x = 1;
function inner() {
  const x = 2;
  function deeper() {
    return x;
  }
  return deeper();
}
return inner();
```

### `scope4()`
```javascript
const x = "outer";
function inner(x) {  // paramètre
  return x;
}
return inner("param");
```

## Indice
- Le scope lexical regarde où la fonction est **définie**, pas où elle est **appelée**
- Le **shadowing** (masquage) : une variable interne cache la variable externe du même nom
- Les paramètres de fonction sont des variables locales à la fonction

## Concepts
- Lexical scope (scope lexical)
- Variable shadowing (masquage)
- Scope chain (chaîne de scope)
- Parameter binding
