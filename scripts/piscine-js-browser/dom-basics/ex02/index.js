/**
 * Ex02 - Create Elements
 * Création et insertion d'éléments
 */

/**
 * Crée un élément avec un tag donné
 * @param {string} tag - Nom du tag
 * @returns {Element} Nouvel élément
 */
export function createElement(tag) {
  void tag;
  // TODO: document.createElement
  return undefined;
}

/**
 * Crée un élément avec des options
 * @param {string} tag - Nom du tag
 * @param {Object} options - { id?, className?, text?, attributes? }
 * @returns {Element} Nouvel élément configuré
 */
export function createElementWithOptions(tag, options = {}) {
  void tag;
  void options;
  // TODO: Créer et configurer l'élément
  return undefined;
}

/**
 * Crée un élément de liste (li) avec du texte
 * @param {string} text - Contenu texte
 * @returns {HTMLLIElement} Élément li
 */
export function createListItem(text) {
  void text;
  // TODO: Créer un li avec textContent
  return undefined;
}

/**
 * Crée une liste ul à partir d'un tableau
 * @param {string[]} items - Éléments de la liste
 * @returns {HTMLUListElement} Liste ul
 */
export function createList(items) {
  void items;
  // TODO: Créer ul et ajouter li pour chaque item
  return undefined;
}

/**
 * Ajoute un élément à la fin d'un parent
 * @param {Element} parent - Élément parent
 * @param {Element} child - Élément à ajouter
 */
export function appendTo(parent, child) {
  void parent;
  void child;
  // TODO: appendChild
}

/**
 * Ajoute un élément au début d'un parent
 * @param {Element} parent - Élément parent
 * @param {Element} child - Élément à ajouter
 */
export function prependTo(parent, child) {
  void parent;
  void child;
  // TODO: prepend
}

/**
 * Insère un élément avant un autre
 * @param {Element} newElement - Nouvel élément
 * @param {Element} reference - Élément de référence
 */
export function insertBefore(newElement, reference) {
  void newElement;
  void reference;
  // TODO: Utiliser before() ou parentNode.insertBefore
}

/**
 * Insère un élément après un autre
 * @param {Element} newElement - Nouvel élément
 * @param {Element} reference - Élément de référence
 */
export function insertAfter(newElement, reference) {
  void newElement;
  void reference;
  // TODO: Utiliser after()
}

/**
 * Crée un fragment avec plusieurs éléments
 * @param {Element[]} elements - Éléments à grouper
 * @returns {DocumentFragment} Fragment
 */
export function createFragment(elements) {
  void elements;
  // TODO: Créer fragment et ajouter les éléments
  return undefined;
}

/**
 * Crée une carte (card) avec titre et contenu
 * @param {string} title - Titre
 * @param {string} content - Contenu
 * @returns {Element} Élément card
 */
export function createCard(title, content) {
  void title;
  void content;
  // TODO: Créer div.card avec h2 et p
  return undefined;
}
