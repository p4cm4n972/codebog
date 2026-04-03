# Ex24 - sessionStorage

## Objectif
Stocker des données pour la durée de la session.

## Différences avec localStorage

| | localStorage | sessionStorage |
|--|--|--|
| Durée de vie | Permanent | Session du tab |
| Partagé entre tabs | Oui | Non |
| Taille | ~5-10 MB | ~5-10 MB |
| API | Identique | Identique |

## API (identique à localStorage)

```javascript
// Stocker
sessionStorage.setItem('tempData', 'value');

// Récupérer
sessionStorage.getItem('tempData');

// Supprimer
sessionStorage.removeItem('tempData');

// Tout effacer
sessionStorage.clear();
```

## Cas d'usage

```javascript
// Données de formulaire multi-étapes
function saveFormStep(step, data) {
  const formData = JSON.parse(sessionStorage.getItem('formProgress') || '{}');
  formData[step] = data;
  sessionStorage.setItem('formProgress', JSON.stringify(formData));
}

// Récupérer à l'étape finale
function getFormData() {
  return JSON.parse(sessionStorage.getItem('formProgress') || '{}');
}

// Nettoyer après soumission
function clearFormData() {
  sessionStorage.removeItem('formProgress');
}
```

## Panier temporaire

```javascript
const cart = {
  items: JSON.parse(sessionStorage.getItem('cart') || '[]'),

  add(product) {
    this.items.push(product);
    this.save();
  },

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  save() {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  },

  clear() {
    this.items = [];
    sessionStorage.removeItem('cart');
  }
};
```

## Quand utiliser sessionStorage
- Données de navigation (état du wizard, filtres temporaires)
- Cache de session (éviter des appels API répétés)
- État non sensible de l'interface
- Données qui ne doivent pas persister après fermeture
