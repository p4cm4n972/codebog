# Ex04 - Navigate DOM

## Objectif
Naviguer dans l'arbre DOM (parents, enfants, frères).

## Relations parent/enfant

```javascript
// Parent
element.parentElement;    // Élément parent
element.parentNode;       // Noeud parent (peut être Document)

// Enfants
element.children;         // HTMLCollection des enfants éléments
element.childNodes;       // NodeList incluant texte et commentaires
element.firstElementChild;
element.lastElementChild;
element.childElementCount;
```

## Relations frères (siblings)

```javascript
// Éléments adjacents
element.previousElementSibling;
element.nextElementSibling;

// Noeuds adjacents (incluant texte)
element.previousSibling;
element.nextSibling;
```

## Parcours

```javascript
// Tous les enfants
for (const child of element.children) {
  console.log(child);
}

// Avec querySelectorAll (descendants)
element.querySelectorAll('*');  // Tous
element.querySelectorAll(':scope > *');  // Enfants directs

// Remonter la chaîne
let current = element;
while (current) {
  console.log(current.tagName);
  current = current.parentElement;
}
```

## closest() vs parentElement

```javascript
// parentElement - juste le parent direct
element.parentElement;

// closest - remonte jusqu'à trouver le sélecteur
element.closest('.container');  // Peut être l'élément lui-même!
```
