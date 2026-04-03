# Ex33 - Clean Code

## Objectif
Écrire du code propre et auto-documenté.

## Nommage

```javascript
// ❌ Mauvais
const d = new Date();
const arr = users.filter(u => u.a > 18);

// ✅ Bon
const currentDate = new Date();
const adultUsers = users.filter(user => user.age > 18);
```

## Fonctions

```javascript
// ❌ Trop de choses
function processUser(user) {
  validate(user);
  save(user);
  sendEmail(user);
  log(user);
}

// ✅ Responsabilité unique
function saveUser(user) {
  validateUser(user);
  return userRepository.save(user);
}
```

## Conditions

```javascript
// ❌ Logique inversée
if (!isNotLoggedIn) { ... }

// ✅ Positif
if (isLoggedIn) { ... }

// ❌ Conditions imbriquées
if (a) {
  if (b) {
    if (c) { doSomething(); }
  }
}

// ✅ Guard clauses
if (!a) return;
if (!b) return;
if (!c) return;
doSomething();
```
