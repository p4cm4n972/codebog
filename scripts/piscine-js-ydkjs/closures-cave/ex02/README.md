# Ex02 - Module Pattern

## Objectif
Créer des modules avec variables privées via les closures (pattern pré-ES6).

## Contexte
Avant les modules ES6, le "Module Pattern" utilisait les closures pour créer de l'encapsulation. Une fonction retourne un objet avec des méthodes publiques qui ont accès aux variables privées via closure.

## Instructions

### `createModule()`
Implémente un module avec :
- `privateData` : variable privée initialisée à 0
- `privateSecret` : constante privée "hidden"
- `privateIncrement()` : fonction privée qui incrémente privateData
- API publique : `increment()` et `getCount()`

```javascript
function createModule() {
  let privateData = 0;
  const privateSecret = "hidden";

  function privateIncrement() {
    privateData++;
  }

  return {
    increment() {
      privateIncrement();
    },
    getCount() {
      return privateData;
    }
  };
}
```

### `testModule()`
```javascript
const mod = createModule();
mod.increment();
mod.increment();
const count = mod.getCount();
const secret = mod.privateSecret;  // undefined
const data = mod.privateData;      // undefined
return [count, secret, data];
```

## Indice
- Les variables déclarées dans la fonction sont inaccessibles de l'extérieur
- Seules les méthodes retournées dans l'objet sont publiques
- Les méthodes publiques ont accès aux variables privées via closure

## Concepts
- Module Pattern
- Public vs Private members
- Closure-based encapsulation
- Revealing Module Pattern
