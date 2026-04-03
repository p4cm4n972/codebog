# Ex00 - Selectors

## Objectif
Maîtriser la sélection d'éléments dans le DOM.

## querySelector vs querySelectorAll

```javascript
// Un seul élément (le premier)
document.querySelector('#unique');
document.querySelector('.first-match');

// Tous les éléments (NodeList)
document.querySelectorAll('.items');
document.querySelectorAll('ul > li');
```

## Sélecteurs CSS courants

```javascript
// Par ID
document.querySelector('#myId');

// Par classe
document.querySelector('.myClass');

// Par tag
document.querySelector('button');

// Combinés
document.querySelector('div.container > p.intro');

// Attributs
document.querySelector('[data-id="123"]');
document.querySelector('input[type="text"]');

// Pseudo-classes
document.querySelector('li:first-child');
document.querySelector('input:not([disabled])');
```

## NodeList vs HTMLCollection

```javascript
// querySelectorAll retourne NodeList (statique)
const items = document.querySelectorAll('.item');
items.forEach(item => ...);  // forEach disponible

// getElementsByClassName retourne HTMLCollection (live)
const items = document.getElementsByClassName('item');
// Pas de forEach, mais se met à jour automatiquement
```
