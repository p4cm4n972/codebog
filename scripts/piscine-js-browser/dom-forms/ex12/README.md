# Ex12 - Form Basics

## Objectif
Accéder aux éléments et valeurs des formulaires.

## Accéder aux formulaires

```javascript
// Par ID
const form = document.getElementById('myForm');

// Tous les formulaires de la page
const forms = document.forms;

// Par nom
const loginForm = document.forms['login'];
const loginForm = document.forms.login;
```

## Accéder aux champs

```javascript
// Via elements collection
const form = document.getElementById('myForm');
const email = form.elements['email'];
const password = form.elements.password;

// Par index
const firstField = form.elements[0];

// Nombre de champs
const count = form.elements.length;
```

## Types d'input et leurs valeurs

```javascript
// Text, email, password, etc.
input.value;           // String

// Checkbox
checkbox.checked;      // Boolean

// Radio (groupe)
const selected = document.querySelector('input[name="gender"]:checked');
selected?.value;

// Select
select.value;          // Valeur sélectionnée
select.selectedIndex;  // Index de l'option
select.options;        // HTMLCollection des options

// Select multiple
const values = [...select.selectedOptions].map(o => o.value);

// Textarea
textarea.value;
```

## FormData API

```javascript
const form = document.getElementById('myForm');
const formData = new FormData(form);

// Accéder aux valeurs
formData.get('email');
formData.getAll('interests');  // Pour les champs multiples

// Itérer
for (const [name, value] of formData) {
  console.log(name, value);
}

// Convertir en objet
const data = Object.fromEntries(formData);
```
