/**
 * Ex00 - Selectors
 * Sélection d'éléments DOM
 */

/**
 * Sélectionne un élément par son ID
 * @param {string} id - ID de l'élément
 * @returns {Element|null} Élément trouvé
 */
export function getById(id) {
  void id;
  // TODO: Utiliser document.getElementById ou querySelector
  return undefined;
}

/**
 * Sélectionne le premier élément correspondant au sélecteur
 * @param {string} selector - Sélecteur CSS
 * @returns {Element|null} Premier élément trouvé
 */
export function selectOne(selector) {
  void selector;
  // TODO: Utiliser querySelector
  return undefined;
}

/**
 * Sélectionne tous les éléments correspondant au sélecteur
 * @param {string} selector - Sélecteur CSS
 * @returns {Element[]} Tableau d'éléments
 */
export function selectAll(selector) {
  void selector;
  // TODO: Utiliser querySelectorAll et convertir en Array
  return undefined;
}

/**
 * Sélectionne un élément dans un contexte donné
 * @param {Element} context - Élément parent
 * @param {string} selector - Sélecteur CSS
 * @returns {Element|null} Élément trouvé
 */
export function selectWithin(context, selector) {
  void context;
  void selector;
  // TODO: Utiliser context.querySelector
  return undefined;
}

/**
 * Vérifie si un élément correspond à un sélecteur
 * @param {Element} element - Élément à tester
 * @param {string} selector - Sélecteur CSS
 * @returns {boolean} True si correspond
 */
export function matches(element, selector) {
  void element;
  void selector;
  // TODO: Utiliser element.matches()
  return undefined;
}

/**
 * Trouve l'ancêtre le plus proche correspondant au sélecteur
 * @param {Element} element - Élément de départ
 * @param {string} selector - Sélecteur CSS
 * @returns {Element|null} Ancêtre trouvé
 */
export function findClosest(element, selector) {
  void element;
  void selector;
  // TODO: Utiliser element.closest()
  return undefined;
}

/**
 * Compte les éléments correspondant au sélecteur
 * @param {string} selector - Sélecteur CSS
 * @returns {number} Nombre d'éléments
 */
export function countElements(selector) {
  void selector;
  // TODO: Utiliser querySelectorAll.length
  return undefined;
}
