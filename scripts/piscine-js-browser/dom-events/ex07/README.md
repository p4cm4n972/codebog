# Ex07 - Event Object

## Objectif
Comprendre et utiliser l'objet événement.

## Propriétés communes

```javascript
element.addEventListener('click', (event) => {
  // Élément cible
  event.target;        // Élément qui a déclenché l'événement
  event.currentTarget; // Élément avec le listener

  // Type et phase
  event.type;          // 'click', 'keydown', etc.
  event.eventPhase;    // 1=capture, 2=target, 3=bubbling

  // Timestamps
  event.timeStamp;     // Millisecondes depuis le chargement

  // Modificateurs
  event.altKey;
  event.ctrlKey;
  event.shiftKey;
  event.metaKey;       // Cmd (Mac) ou Windows (PC)
});
```

## Méthodes importantes

```javascript
element.addEventListener('click', (event) => {
  // Empêcher le comportement par défaut
  event.preventDefault();

  // Arrêter la propagation
  event.stopPropagation();

  // Arrêter TOUTE propagation (même les autres handlers)
  event.stopImmediatePropagation();
});
```

## MouseEvent

```javascript
element.addEventListener('click', (event) => {
  // Position relative à la fenêtre
  event.clientX;
  event.clientY;

  // Position relative à la page
  event.pageX;
  event.pageY;

  // Position relative à l'élément cible
  event.offsetX;
  event.offsetY;

  // Bouton de souris
  event.button;  // 0=gauche, 1=molette, 2=droit
});
```

## KeyboardEvent

```javascript
element.addEventListener('keydown', (event) => {
  event.key;     // 'a', 'Enter', 'Escape', etc.
  event.code;    // 'KeyA', 'Enter', 'Escape' (layout-indépendant)
  event.repeat;  // true si touche maintenue
});
```
