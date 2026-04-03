# Ex08 - Event Bubbling & Capturing

## Objectif
Comprendre la propagation des événements.

## Phases d'un événement

```
                    │  Capturing   │  Bubbling
                    │     ↓        │     ↑
    ┌───────────────────────────────────────────┐
    │  window                                   │
    │  ┌─────────────────────────────────────┐  │
    │  │  document                           │  │
    │  │  ┌───────────────────────────────┐  │  │
    │  │  │  html                         │  │  │
    │  │  │  ┌─────────────────────────┐  │  │  │
    │  │  │  │  body                   │  │  │  │
    │  │  │  │  ┌───────────────────┐  │  │  │  │
    │  │  │  │  │  div              │  │  │  │  │
    │  │  │  │  │  ┌─────────────┐  │  │  │  │  │
    │  │  │  │  │  │  button ←── Target  │  │  │
    │  │  │  │  │  └─────────────┘  │  │  │  │  │
    │  │  │  │  └───────────────────┘  │  │  │  │
    │  │  │  └─────────────────────────┘  │  │  │
    │  │  └───────────────────────────────┘  │  │
    │  └─────────────────────────────────────┘  │
    └───────────────────────────────────────────┘
```

## Bubbling (par défaut)

```javascript
// L'événement "remonte" du target vers les parents
child.addEventListener('click', () => {
  console.log('1. Child clicked');
});
parent.addEventListener('click', () => {
  console.log('2. Parent clicked');  // Aussi déclenché!
});
```

## Capturing

```javascript
// L'événement "descend" vers le target
parent.addEventListener('click', () => {
  console.log('1. Parent capture');
}, true);  // ou { capture: true }

child.addEventListener('click', () => {
  console.log('2. Child clicked');
});
```

## Arrêter la propagation

```javascript
child.addEventListener('click', (event) => {
  event.stopPropagation();  // Parents ne recevront pas l'événement
});

// Plus agressif: arrête aussi les autres handlers sur le même élément
child.addEventListener('click', (event) => {
  event.stopImmediatePropagation();
});
```

## Événements qui ne bubblent pas

Certains événements ne remontent pas:
- `focus` / `blur` (utiliser `focusin` / `focusout` à la place)
- `load` / `unload`
- `scroll` (sur certains navigateurs)
