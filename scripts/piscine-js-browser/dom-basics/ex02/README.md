# Ex02 - Create Elements

## Objectif
Créer et insérer des éléments dans le DOM.

## Création d'éléments

```javascript
// Créer un élément
const div = document.createElement('div');

// Configurer
div.id = 'myDiv';
div.className = 'box';
div.textContent = 'Hello';

// Créer un fragment (pour plusieurs éléments)
const fragment = document.createDocumentFragment();
fragment.appendChild(el1);
fragment.appendChild(el2);
parent.appendChild(fragment);  // Un seul reflow
```

## Méthodes d'insertion

```javascript
// appendChild - à la fin
parent.appendChild(child);

// insertBefore - avant un élément de référence
parent.insertBefore(newNode, referenceNode);

// Méthodes modernes (Element)
element.append(node1, node2, 'text');  // À la fin
element.prepend(node);                  // Au début
element.before(node);                   // Avant
element.after(node);                    // Après

// Remplacer
parent.replaceChild(newNode, oldNode);
element.replaceWith(newNode);
```

## Créer depuis une chaîne (avec précaution)

```javascript
// Template literal + createElement (plus sûr)
const template = document.createElement('template');
// Note: utiliser avec précaution, valider le contenu

// Ou construire manuellement (recommandé)
function createCard(title, content) {
  const card = document.createElement('div');
  card.className = 'card';

  const h2 = document.createElement('h2');
  h2.textContent = title;

  const p = document.createElement('p');
  p.textContent = content;

  card.append(h2, p);
  return card;
}
```
