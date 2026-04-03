# Ex34 - Error Handling

## Objectif
Gérer les erreurs de façon propre et prévisible.

## Erreurs personnalisées

```javascript
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

throw new ValidationError('email', 'Invalid email format');
```

## Pattern Result

```javascript
// Au lieu de throw, retourner un objet
function divide(a, b) {
  if (b === 0) {
    return { success: false, error: 'Division by zero' };
  }
  return { success: true, value: a / b };
}

const result = divide(10, 0);
if (!result.success) {
  console.error(result.error);
}
```

## Try-Catch approprié

```javascript
// ❌ Catch générique silencieux
try {
  riskyOperation();
} catch (e) {
  // Ignoré silencieusement
}

// ✅ Gestion spécifique
try {
  riskyOperation();
} catch (error) {
  if (error instanceof NetworkError) {
    retryLater();
  } else {
    throw error;  // Re-throw si inconnu
  }
}
```
