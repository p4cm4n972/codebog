# Ex05 - Remove & Clone

## Objectif
Supprimer et cloner des éléments DOM.

## Suppression

```javascript
// Méthode moderne (sur l'élément)
element.remove();

// Méthode classique (via le parent)
parent.removeChild(element);

// Vider un élément
element.textContent = '';           // Rapide
element.replaceChildren();          // Moderne
while (element.firstChild) {        // Classique
  element.firstChild.remove();
}
```

## Clonage

```javascript
// Clone superficiel (sans enfants)
const shallow = element.cloneNode(false);

// Clone profond (avec enfants)
const deep = element.cloneNode(true);

// Attention: les event listeners ne sont PAS clonés!
// Les ID sont dupliqués (à changer manuellement)
```

## Remplacement

```javascript
// Remplacer un élément
oldElement.replaceWith(newElement);

// Via le parent
parent.replaceChild(newElement, oldElement);

// Remplacer le contenu
element.replaceChildren(newContent);
element.replaceChildren(el1, el2, el3);
```

## Déplacement

```javascript
// appendChild déplace si déjà dans le DOM
container2.appendChild(existingElement);
// L'élément est retiré de son parent original
```
