# Ex09 - Event Delegation

## Objectif
Optimiser la gestion des événements avec la délégation.

## Le problème

```javascript
// ❌ Mauvaise approche: un listener par élément
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', handleClick);
});
// Problème: coûteux en mémoire, ne marche pas pour les nouveaux éléments
```

## La solution: Event Delegation

```javascript
// ✅ Un seul listener sur le parent
const container = document.querySelector('.container');
container.addEventListener('click', (event) => {
  // Vérifier si l'élément cliqué est un item
  if (event.target.matches('.item')) {
    handleClick(event);
  }
});
```

## closest() pour les éléments imbriqués

```javascript
// Si le click peut être sur un enfant de l'item
container.addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (item) {
    handleClick(item);
  }
});
```

## Avantages

1. **Performance**: Un seul listener au lieu de N
2. **Éléments dynamiques**: Marche automatiquement pour les nouveaux éléments
3. **Mémoire**: Moins de handlers à stocker

## Pattern complet

```javascript
function delegate(container, selector, eventType, handler) {
  container.addEventListener(eventType, (event) => {
    const target = event.target.closest(selector);
    if (target && container.contains(target)) {
      handler.call(target, event);
    }
  });
}

// Utilisation
delegate(list, '.item', 'click', function(event) {
  console.log('Clicked:', this.textContent);
});
```
