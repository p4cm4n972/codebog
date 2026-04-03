# Ex14 - Form Validation

## Objectif
Valider les formulaires avec l'API Constraint Validation.

## Attributs HTML de validation

```html
<input type="email" required minlength="5" maxlength="50">
<input type="number" min="0" max="100" step="5">
<input type="text" pattern="[A-Za-z]{3}">
```

## Constraint Validation API

```javascript
// Vérifier si un champ est valide
input.checkValidity();     // true/false
input.reportValidity();    // true/false + affiche le message

// État de validité détaillé
input.validity.valid;           // true si tout est OK
input.validity.valueMissing;    // required non rempli
input.validity.typeMismatch;    // type invalide (email, url)
input.validity.patternMismatch; // pattern non respecté
input.validity.tooLong;         // maxlength dépassé
input.validity.tooShort;        // minlength non atteint
input.validity.rangeOverflow;   // > max
input.validity.rangeUnderflow;  // < min
input.validity.stepMismatch;    // step non respecté
input.validity.customError;     // erreur personnalisée

// Message d'erreur
input.validationMessage;  // Message du navigateur
```

## Messages personnalisés

```javascript
// Définir un message d'erreur personnalisé
input.setCustomValidity('Email déjà utilisé');

// Effacer l'erreur personnalisée
input.setCustomValidity('');
```

## Validation du formulaire

```javascript
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    // Afficher les erreurs
    form.reportValidity();
  }
});

// Désactiver la validation native
<form novalidate>
```

## Validation personnalisée

```javascript
input.addEventListener('input', () => {
  if (input.value.includes('spam')) {
    input.setCustomValidity('Pas de spam !');
  } else {
    input.setCustomValidity('');
  }
});
```
