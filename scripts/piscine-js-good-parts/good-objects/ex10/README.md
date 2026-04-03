# Ex10 - Global Abatement

## Objectif
Éviter la pollution de l'espace global - une source majeure de bugs.

## Le problème des globales

```javascript
// ❌ Mauvais - pollue l'espace global
var name = 'Alice';  // window.name en navigateur
function greet() {}  // window.greet

// Collision possible avec d'autres scripts!
```

## Pattern Module (IIFE)

```javascript
// ✅ Encapsule dans une IIFE
const MyApp = (function() {
  // Variables privées
  let privateData = 'secret';

  // API publique
  return {
    getData() {
      return privateData;
    }
  };
})();
```

## ES Modules (moderne)

```javascript
// ✅ Chaque fichier est un module avec son propre scope
// utils.js
const privateHelper = () => {};
export const publicUtil = () => {};

// app.js
import { publicUtil } from './utils.js';
```

## Un seul objet global

```javascript
// ✅ Si vraiment nécessaire, un seul namespace
const APP = {};
APP.utils = {};
APP.models = {};
APP.views = {};
```
