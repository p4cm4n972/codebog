# Ex06 - Scope Chain

## Objectif
Comprendre la chaîne de scope et la résolution multi-niveaux.

## Contexte
Quand JavaScript cherche une variable, il remonte la "scope chain" : d'abord le scope local, puis le scope parent, et ainsi de suite jusqu'au scope global. C'est toujours basé sur où la fonction est **définie**, pas où elle est **appelée**.

## Instructions

### `chain1()`
Résolution sur plusieurs niveaux de scope.
```javascript
const globalVar = "global";

function chain1() {
  const level1 = "level1";

  function outer() {
    const level2 = "level2";

    function inner() {
      const level3 = "level3";
      return [globalVar, level1, level2, level3];
    }

    return inner();
  }

  return outer();
}
```

### `chain2()`
Scope lexical vs dynamique.
```javascript
const x = 1;

function a() {
  const x = 2;
  return b();  // b est appelée depuis a
}

function b() {
  return x;    // Quel x ? Celui de a ou le global ?
}

return a();
```

### `chain3()`
Closure qui capture une variable privée.
```javascript
function outer() {
  const secret = "hidden";

  return {
    getSecret: () => secret
  };
}

const obj = outer();
return obj.getSecret();
```

## Indice
- La scope chain est établie à la **définition** de la fonction
- `b()` est définie au même niveau que `a()`, donc elle voit le scope global
- Une closure capture les variables du scope où elle est définie

## Concepts
- Scope chain resolution
- Lexical scope vs dynamic scope
- Multi-level variable lookup
- Closure over outer scope
