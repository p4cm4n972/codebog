# Ex02 - TDZ (Temporal Dead Zone)

## Objectif
Comprendre la Temporal Dead Zone pour `let` et `const`.

## Contexte
La TDZ est la période entre l'entrée dans un scope et la déclaration d'une variable `let`/`const`. Pendant cette période, accéder à la variable génère une `ReferenceError`.

## Instructions

### `tdz1()` - Assignation avant déclaration
```javascript
try {
  x = 5;
  let x;
  return "ok";
} catch (e) {
  return "ReferenceError";
}
```

### `tdz2()` - Auto-référence
```javascript
try {
  const x = x;
  return "ok";
} catch (e) {
  return "ReferenceError";
}
```

### `tdz3()` - TDZ dans un bloc
```javascript
let x = 1;
{
  try {
    console.log(x);  // x du bloc interne
    let x = 2;
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }
}
```

### `tdz4()` - typeof sur variable non déclarée
```javascript
try {
  return typeof undeclared;
} catch (e) {
  return "error";
}
```

### `tdz5()` - typeof ne protège pas de la TDZ
```javascript
try {
  return typeof x;
  let x;
} catch (e) {
  return "ReferenceError";
}
```

## Indice
- La TDZ commence au début du bloc, pas à la ligne de déclaration
- `typeof` est "safe" sur les variables **non déclarées**, mais PAS dans la TDZ
- Un `let x` dans un bloc crée une TDZ même si un `x` existe dans le scope parent

## Concepts
- Temporal Dead Zone (TDZ)
- let/const hoisting behavior
- typeof safety limitations
- Block scope and TDZ interaction
