# Ex32 - Practical Patterns

## Objectif
Appliquer les regex à des cas pratiques courants.

## Email (simplifié)

```javascript
const emailPattern = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
emailPattern.test('user@example.com');  // true
```

## URL

```javascript
const urlPattern = /^https?:\/\/[\w.-]+(?:\/[\w./-]*)?$/;
```

## Téléphone (format français)

```javascript
const phonePattern = /^(?:\+33|0)\d{9}$/;
// Ou avec espaces: /^(?:\+33|0)\d(?:\s?\d{2}){4}$/
```

## Mot de passe fort

```javascript
// Au moins 8 chars, une majuscule, une minuscule, un chiffre
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
```

## Conseil

Pour des validations en production, préférez des bibliothèques spécialisées (validator.js, zod) qui gèrent les cas limites.
