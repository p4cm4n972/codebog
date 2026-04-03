# Ex00 - Strict Equality

## Objectif
Comprendre pourquoi `===` et `!==` sont les "good parts" et `==` / `!=` sont les "bad parts".

## Le problème avec `==`

```javascript
'' == '0'           // false
0 == ''             // true
0 == '0'            // true
false == 'false'    // false
false == '0'        // true
false == undefined  // false
false == null       // false
null == undefined   // true
' \t\r\n ' == 0     // true
```

## La solution : `===`

```javascript
'' === '0'          // false
0 === ''            // false
0 === '0'           // false
false === 'false'   // false
```

## Instructions

Implémentez les fonctions qui utilisent UNIQUEMENT `===` et `!==`.
