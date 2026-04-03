# Ex01 - Element Properties

## Objectif
Lire et modifier les propriétés des éléments DOM.

## Contenu texte

```javascript
// textContent - texte brut (recommandé, plus sûr)
element.textContent = 'Hello';
const text = element.textContent;

// innerText - texte visible (respecte CSS)
element.innerText = 'Visible only';
```

## Attributs

```javascript
// Méthodes génériques
element.getAttribute('href');
element.setAttribute('href', '/new-path');
element.removeAttribute('disabled');
element.hasAttribute('disabled');

// Propriétés directes (quand disponibles)
element.id = 'newId';
element.className = 'new-class';
input.value = 'new value';
input.disabled = true;
```

## Data attributes

```javascript
// HTML: <div data-user-id="123" data-active="true">
element.dataset.userId;     // '123'
element.dataset.active;     // 'true'

// Setter
element.dataset.count = '5';
// Résultat: data-count="5"
```

## Bonnes pratiques

```javascript
// Toujours utiliser textContent pour du texte
element.textContent = userInput;  // Sûr

// Pour du HTML, construire les éléments manuellement
const b = document.createElement('b');
b.textContent = 'Bold';
element.appendChild(b);
```
