# Ex01 - Declarations

## Objectif
Utiliser `const` par défaut, `let` quand nécessaire, éviter `var`.

## Pourquoi éviter `var` ?

```javascript
// var a un scope de fonction, pas de bloc
function badVar() {
  if (true) {
    var x = 1;
  }
  console.log(x); // 1 (fuite du bloc!)
}

// let/const ont un scope de bloc
function goodLet() {
  if (true) {
    let x = 1;
  }
  console.log(x); // ReferenceError
}
```

## Règle de Crockford

> "I recommend using const for all variables that don't need to change.
> Use let for variables that will be reassigned. Never use var."

## Instructions

Implémentez les fonctions en respectant ces règles de déclaration.
