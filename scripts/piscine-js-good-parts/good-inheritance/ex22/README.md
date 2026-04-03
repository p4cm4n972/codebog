# Ex22 - Factory Functions

## Objectif
Utiliser les factories au lieu des constructeurs - plus simple et plus sûr.

## Pourquoi pas new?

```javascript
// ❌ Problèmes avec new
function Person(name) {
  this.name = name;
}
const p = Person('Alice');  // Oublié new! this = global!

// ✅ Factory - pas besoin de new
function createPerson(name) {
  return { name };
}
const p = createPerson('Alice');  // Toujours correct
```

## Pattern Factory

```javascript
function createUser({ name, email, role = 'user' }) {
  // Validation
  if (!name || !email) {
    throw new Error('Name and email required');
  }

  // État privé via closure
  let _password = null;

  // API publique
  return {
    name,
    email,
    role,
    setPassword(pwd) { _password = pwd; },
    checkPassword(pwd) { return pwd === _password; }
  };
}
```

## Factory avec variantes

```javascript
const createButton = (type) => ({
  primary: () => ({ color: 'blue', size: 'md' }),
  secondary: () => ({ color: 'gray', size: 'sm' }),
  danger: () => ({ color: 'red', size: 'md' })
}[type]?.() ?? { color: 'default', size: 'md' });
```
