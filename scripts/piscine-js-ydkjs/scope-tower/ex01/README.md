# Ex01 - Hoisting Deep Dive

## Objectif
Comprendre le hoisting de `var`, `let`, `const` et des fonctions.

## Contexte
Le "hoisting" (hissage) est le comportement de JavaScript qui déplace les déclarations au sommet de leur scope. Mais attention : seules les **déclarations** sont hoisted, pas les **initialisations**.

## Instructions

### `hoist1Answer()`
```javascript
function hoist1() {
  console.log(x);  // Que log cette ligne ?
  var x = 5;
  return x;
}
```
Retourne ce que `console.log(x)` affiche.

### `hoist2()` - Function declaration
```javascript
return typeof foo;
function foo() {}
```

### `hoist3()` - Function expression
```javascript
return typeof bar;
var bar = function() {};
```

### `hoist4()` - let et TDZ
```javascript
try {
  console.log(x);
  let x = 5;
  return "no error";
} catch (e) {
  return "ReferenceError";
}
```

### `hoist5Answer()`
```javascript
function hoist5() {
  var x = 1;
  function inner() {
    console.log(x);  // Que log cette ligne ?
    var x = 2;
    return x;
  }
  return inner();
}
```
Retourne ce que `console.log(x)` affiche **dans inner**.

## Indice
- `var` : déclaration hoisted, initialisée à `undefined`
- `function` declaration : entièrement hoisted (nom + corps)
- `function` expression : comme `var`, seul le nom est hoisted
- `let`/`const` : hoisted mais dans la TDZ (Temporal Dead Zone)

## Concepts
- Hoisting (hissage)
- var vs let/const hoisting
- Function declaration vs expression
- Temporal Dead Zone (TDZ)
