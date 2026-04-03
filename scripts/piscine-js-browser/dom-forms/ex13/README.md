# Ex13 - Input Events

## Objectif
Gérer les événements des champs de formulaire.

## input vs change

```javascript
// input: déclenché à chaque modification
input.addEventListener('input', (e) => {
  console.log('Valeur actuelle:', e.target.value);
});

// change: déclenché quand l'utilisateur valide (blur ou Enter)
input.addEventListener('change', (e) => {
  console.log('Valeur finale:', e.target.value);
});
```

## focus et blur

```javascript
// focus: l'élément reçoit le focus
input.addEventListener('focus', () => {
  input.classList.add('focused');
});

// blur: l'élément perd le focus
input.addEventListener('blur', () => {
  input.classList.remove('focused');
  validateField(input);
});

// Équivalents qui bubblent
parent.addEventListener('focusin', handler);   // focus bubble
parent.addEventListener('focusout', handler);  // blur bubble
```

## Contrôle du focus

```javascript
// Donner le focus
input.focus();

// Options de focus
input.focus({ preventScroll: true });

// Retirer le focus
input.blur();

// Sélectionner le contenu
input.select();

// Sélection partielle
input.setSelectionRange(0, 5);
```

## Événements spéciaux

```javascript
// Pour select
select.addEventListener('change', (e) => {
  console.log('Option:', e.target.value);
});

// Pour checkbox/radio
checkbox.addEventListener('change', (e) => {
  console.log('Coché:', e.target.checked);
});

// Pour file input
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  console.log('Fichiers:', files);
});
```

## InputEvent propriétés

```javascript
input.addEventListener('input', (e) => {
  e.data;           // Caractère inséré (ou null si suppression)
  e.inputType;      // 'insertText', 'deleteContentBackward', etc.
  e.isComposing;    // True si en cours de composition (IME)
});
```
