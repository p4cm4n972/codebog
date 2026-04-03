# Ex11 - Custom Events

## Objectif
Créer et dispatcher des événements personnalisés.

## Créer un événement simple

```javascript
// Event simple (sans données)
const event = new Event('myevent');

// Avec options
const event = new Event('myevent', {
  bubbles: true,     // L'événement remonte
  cancelable: true   // Peut être annulé avec preventDefault()
});
```

## CustomEvent avec données

```javascript
// Événement avec données personnalisées
const event = new CustomEvent('userlogin', {
  detail: {
    userId: 123,
    username: 'john'
  },
  bubbles: true
});

// Écouter et récupérer les données
element.addEventListener('userlogin', (e) => {
  console.log(e.detail.userId);    // 123
  console.log(e.detail.username);  // 'john'
});
```

## Dispatcher un événement

```javascript
// Sur un élément spécifique
element.dispatchEvent(event);

// Sur document (pour les événements globaux)
document.dispatchEvent(event);

// Sur window
window.dispatchEvent(event);
```

## Pattern Pub/Sub avec événements

```javascript
// Publisher
function notifyChange(data) {
  document.dispatchEvent(new CustomEvent('datachange', {
    detail: data
  }));
}

// Subscriber
document.addEventListener('datachange', (e) => {
  updateUI(e.detail);
});

// Utilisation
notifyChange({ items: [1, 2, 3] });
```

## Événements annulables

```javascript
const event = new CustomEvent('beforedelete', {
  cancelable: true,
  detail: { itemId: 42 }
});

// Le listener peut annuler
element.addEventListener('beforedelete', (e) => {
  if (!confirm('Supprimer ?')) {
    e.preventDefault();
  }
});

// Vérifier si annulé
const wasAllowed = element.dispatchEvent(event);
if (wasAllowed) {
  // Procéder à la suppression
}
```
