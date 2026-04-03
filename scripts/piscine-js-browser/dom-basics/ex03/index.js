/**
 * Ex03 - Modify Elements
 * Modification des styles et classes
 */

/**
 * Ajoute une classe à un élément
 * @param {Element} element - Élément DOM
 * @param {string} className - Classe à ajouter
 */
export function addClass(element, className) {
  void element;
  void className;
  // TODO: classList.add
}

/**
 * Retire une classe d'un élément
 * @param {Element} element - Élément DOM
 * @param {string} className - Classe à retirer
 */
export function removeClass(element, className) {
  void element;
  void className;
  // TODO: classList.remove
}

/**
 * Bascule une classe
 * @param {Element} element - Élément DOM
 * @param {string} className - Classe à basculer
 * @returns {boolean} True si la classe est maintenant présente
 */
export function toggleClass(element, className) {
  void element;
  void className;
  // TODO: classList.toggle
  return undefined;
}

/**
 * Vérifie si un élément a une classe
 * @param {Element} element - Élément DOM
 * @param {string} className - Classe à vérifier
 * @returns {boolean} True si présente
 */
export function hasClass(element, className) {
  void element;
  void className;
  // TODO: classList.contains
  return undefined;
}

/**
 * Définit un style inline
 * @param {Element} element - Élément DOM
 * @param {string} property - Propriété CSS (camelCase)
 * @param {string} value - Valeur
 */
export function setStyle(element, property, value) {
  void element;
  void property;
  void value;
  // TODO: element.style[property] = value
}

/**
 * Définit plusieurs styles
 * @param {Element} element - Élément DOM
 * @param {Object} styles - { property: value }
 */
export function setStyles(element, styles) {
  void element;
  void styles;
  // TODO: Appliquer chaque style
}

/**
 * Récupère le style calculé
 * @param {Element} element - Élément DOM
 * @param {string} property - Propriété CSS
 * @returns {string} Valeur calculée
 */
export function getComputedStyleValue(element, property) {
  void element;
  void property;
  // TODO: getComputedStyle
  return undefined;
}

/**
 * Cache un élément (display: none)
 * @param {Element} element - Élément DOM
 */
export function hide(element) {
  void element;
  // TODO: style.display = 'none'
}

/**
 * Affiche un élément
 * @param {Element} element - Élément DOM
 * @param {string} display - Type d'affichage (default: 'block')
 */
export function show(element, display = 'block') {
  void element;
  void display;
  // TODO: style.display = display
}

/**
 * Récupère les dimensions d'un élément
 * @param {Element} element - Élément DOM
 * @returns {Object} { width, height }
 */
export function getDimensions(element) {
  void element;
  // TODO: Utiliser getBoundingClientRect
  return undefined;
}
