# DOM Basics

## Le Document Object Model

Le DOM est une représentation arborescente du document HTML. JavaScript peut :
- **Sélectionner** des éléments
- **Créer** de nouveaux éléments
- **Modifier** le contenu et les attributs
- **Supprimer** des éléments

## Sélection d'éléments

```javascript
// Par ID (un seul élément)
document.getElementById('myId');

// Par sélecteur CSS (premier match)
document.querySelector('.myClass');
document.querySelector('#myId > p');

// Par sélecteur CSS (tous les matches)
document.querySelectorAll('.item');  // NodeList

// Anciennes méthodes (moins flexibles)
document.getElementsByClassName('myClass');  // HTMLCollection
document.getElementsByTagName('p');          // HTMLCollection
```

## Création et insertion

```javascript
// Créer un élément
const div = document.createElement('div');
div.textContent = 'Hello';
div.className = 'box';

// Insérer
parent.appendChild(div);           // À la fin
parent.insertBefore(div, ref);     // Avant ref
parent.prepend(div);               // Au début
element.after(div);                // Après element
```

## Exercices

| Ex | Titre | Concept |
|----|-------|---------|
| 00 | Selectors | querySelector, querySelectorAll |
| 01 | Element Properties | textContent, innerHTML, attributes |
| 02 | Create Elements | createElement, appendChild |
| 03 | Modify Elements | classList, style, dataset |
| 04 | Navigate DOM | parentElement, children, siblings |
| 05 | Remove & Clone | remove, cloneNode |
