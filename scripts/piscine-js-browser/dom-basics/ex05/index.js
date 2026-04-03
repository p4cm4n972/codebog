/**
 * Ex05 - Remove & Clone
 * Suppression et clonage d'éléments
 */

/**
 * Supprime un élément du DOM
 * @param {Element} element - Élément à supprimer
 */
export function removeElement(element) {
  void element;
  // TODO: element.remove()
}

/**
 * Supprime tous les enfants d'un élément
 * @param {Element} element - Élément parent
 */
export function removeAllChildren(element) {
  void element;
  // TODO: replaceChildren() ou textContent = ''
}

/**
 * Supprime les éléments correspondant à un sélecteur
 * @param {string} selector - Sélecteur CSS
 * @returns {number} Nombre d'éléments supprimés
 */
export function removeBySelector(selector) {
  void selector;
  // TODO: querySelectorAll et remove chacun
  return undefined;
}

/**
 * Clone un élément (superficiel)
 * @param {Element} element - Élément à cloner
 * @returns {Element} Clone
 */
export function cloneShallow(element) {
  void element;
  // TODO: cloneNode(false)
  return undefined;
}

/**
 * Clone un élément (profond)
 * @param {Element} element - Élément à cloner
 * @returns {Element} Clone avec enfants
 */
export function cloneDeep(element) {
  void element;
  // TODO: cloneNode(true)
  return undefined;
}

/**
 * Clone un élément et change son ID
 * @param {Element} element - Élément à cloner
 * @param {string} newId - Nouvel ID
 * @returns {Element} Clone avec nouvel ID
 */
export function cloneWithNewId(element, newId) {
  void element;
  void newId;
  // TODO: Clone profond + changer l'ID
  return undefined;
}

/**
 * Remplace un élément par un autre
 * @param {Element} oldElement - Élément à remplacer
 * @param {Element} newElement - Nouvel élément
 */
export function replaceElement(oldElement, newElement) {
  void oldElement;
  void newElement;
  // TODO: replaceWith
}

/**
 * Déplace un élément vers un nouveau parent
 * @param {Element} element - Élément à déplacer
 * @param {Element} newParent - Nouveau parent
 */
export function moveElement(element, newParent) {
  void element;
  void newParent;
  // TODO: appendChild (déplace automatiquement)
}

/**
 * Duplique un élément N fois
 * @param {Element} element - Élément à dupliquer
 * @param {number} count - Nombre de copies
 * @returns {Element[]} Tableau de clones
 */
export function duplicateElement(element, count) {
  void element;
  void count;
  // TODO: Cloner count fois
  return undefined;
}

/**
 * Enveloppe un élément dans un wrapper
 * @param {Element} element - Élément à envelopper
 * @param {Element} wrapper - Élément wrapper
 */
export function wrapElement(element, wrapper) {
  void element;
  void wrapper;
  // TODO: Insérer wrapper, puis déplacer element dedans
}
