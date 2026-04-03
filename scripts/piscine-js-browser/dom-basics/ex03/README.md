# Ex03 - Modify Elements

## Objectif
Modifier les styles et classes des éléments.

## classList

```javascript
// Ajouter/retirer des classes
element.classList.add('active');
element.classList.remove('hidden');
element.classList.toggle('open');

// Vérifier
element.classList.contains('active');  // true/false

// Remplacer
element.classList.replace('old', 'new');

// Plusieurs à la fois
element.classList.add('a', 'b', 'c');
```

## Styles inline

```javascript
// Propriétés individuelles
element.style.color = 'red';
element.style.backgroundColor = 'blue';  // camelCase!
element.style.fontSize = '16px';

// Lire le style calculé
const computed = getComputedStyle(element);
computed.color;  // 'rgb(255, 0, 0)'
```

## Dimensions et position

```javascript
// Dimensions (content + padding + border)
element.offsetWidth;
element.offsetHeight;

// Position relative au parent positionné
element.offsetTop;
element.offsetLeft;

// Dimensions précises
const rect = element.getBoundingClientRect();
rect.width;
rect.height;
rect.top;  // Par rapport au viewport
```
