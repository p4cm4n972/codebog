# Ex06 - Event Listeners

## Objectif
Attacher et détacher des écouteurs d'événements.

## addEventListener

```javascript
// Syntaxe de base
element.addEventListener('click', handler);

// Avec options
element.addEventListener('click', handler, {
  once: true,      // Se déclenche une seule fois
  capture: true,   // Phase de capture
  passive: true    // N'appellera pas preventDefault()
});

// Handler avec fonction nommée (pour pouvoir la retirer)
function handleClick(event) {
  console.log('Clicked!');
}
element.addEventListener('click', handleClick);
```

## removeEventListener

```javascript
// Nécessite la MÊME référence de fonction
element.removeEventListener('click', handleClick);

// Ne fonctionne PAS avec des fonctions anonymes
element.addEventListener('click', () => console.log('Hi'));
element.removeEventListener('click', () => console.log('Hi')); // NON!
```

## AbortController (moderne)

```javascript
const controller = new AbortController();

element.addEventListener('click', handler, {
  signal: controller.signal
});

// Pour retirer tous les listeners d'un coup
controller.abort();
```

## Bonnes pratiques

```javascript
// Toujours nettoyer les listeners pour éviter les memory leaks
class Component {
  constructor(element) {
    this.element = element;
    this.handleClick = this.handleClick.bind(this);
    this.element.addEventListener('click', this.handleClick);
  }

  handleClick(event) {
    console.log('Clicked');
  }

  destroy() {
    this.element.removeEventListener('click', this.handleClick);
  }
}
```
