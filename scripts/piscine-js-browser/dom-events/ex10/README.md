# Ex10 - Common Events

## Objectif
Maîtriser les événements courants du navigateur.

## Événements souris

```javascript
element.addEventListener('click', handler);      // Clic gauche
element.addEventListener('dblclick', handler);   // Double-clic
element.addEventListener('contextmenu', handler); // Clic droit
element.addEventListener('mousedown', handler);  // Bouton pressé
element.addEventListener('mouseup', handler);    // Bouton relâché
element.addEventListener('mousemove', handler);  // Déplacement
element.addEventListener('mouseenter', handler); // Entrée (ne bubble pas)
element.addEventListener('mouseleave', handler); // Sortie (ne bubble pas)
element.addEventListener('mouseover', handler);  // Entrée (bubble)
element.addEventListener('mouseout', handler);   // Sortie (bubble)
```

## Événements clavier

```javascript
element.addEventListener('keydown', handler);   // Touche pressée
element.addEventListener('keyup', handler);     // Touche relâchée
element.addEventListener('keypress', handler);  // OBSOLÈTE - ne pas utiliser

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();
    save();
  }
});
```

## Événements de formulaire

```javascript
input.addEventListener('input', handler);   // Valeur change
input.addEventListener('change', handler);  // Valeur finale (blur)
input.addEventListener('focus', handler);   // Élément focusé
input.addEventListener('blur', handler);    // Perte de focus
form.addEventListener('submit', handler);   // Soumission
form.addEventListener('reset', handler);    // Reset du formulaire
```

## Événements de fenêtre

```javascript
window.addEventListener('load', handler);       // Page chargée
window.addEventListener('DOMContentLoaded', handler); // DOM prêt
window.addEventListener('resize', handler);     // Redimensionnement
window.addEventListener('scroll', handler);     // Défilement
window.addEventListener('beforeunload', handler); // Avant fermeture
```

## Événements tactiles

```javascript
element.addEventListener('touchstart', handler);
element.addEventListener('touchmove', handler);
element.addEventListener('touchend', handler);
element.addEventListener('touchcancel', handler);
```
