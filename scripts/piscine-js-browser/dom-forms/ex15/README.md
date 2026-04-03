# Ex15 - Form Submission

## Objectif
Gérer la soumission des formulaires.

## Événement submit

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Empêche la soumission native

  // Récupérer les données
  const formData = new FormData(form);

  // Envoyer avec fetch
  fetch('/api/submit', {
    method: 'POST',
    body: formData
  });
});
```

## FormData avancé

```javascript
const formData = new FormData(form);

// Ajouter des données
formData.append('extra', 'value');

// Modifier une valeur
formData.set('email', 'new@example.com');

// Supprimer un champ
formData.delete('optional');

// Vérifier l'existence
formData.has('email');  // true

// Convertir en JSON
const json = JSON.stringify(Object.fromEntries(formData));
```

## Envoi avec fetch

```javascript
// Envoi multipart (fichiers)
fetch('/api/upload', {
  method: 'POST',
  body: formData  // Content-Type automatique
});

// Envoi JSON
fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(formData))
});

// Envoi URL-encoded
fetch('/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(formData)
});
```

## États de soumission

```javascript
const submitBtn = form.querySelector('[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi...';

  try {
    await fetch('/api/submit', {
      method: 'POST',
      body: new FormData(form)
    });
    submitBtn.textContent = 'Envoyé !';
  } catch (error) {
    submitBtn.textContent = 'Erreur';
  } finally {
    submitBtn.disabled = false;
  }
});
```

## Soumission programmée

```javascript
// Soumettre le formulaire
form.submit();           // Pas d'event submit déclenché
form.requestSubmit();    // Déclenche l'event submit

// Soumettre via un bouton spécifique
form.requestSubmit(submitButton);
```
