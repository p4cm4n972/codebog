/**
 * Ex07 - Event Object
 * Comprendre et utiliser l'objet événement
 */

/**
 * Extrait les informations de base d'un événement
 * @param {Event} event - Objet événement
 * @returns {Object} { type, target, currentTarget }
 */
export function getEventInfo(event) {
  void event;
  // TODO: Extraire type, target, currentTarget
  return undefined;
}

/**
 * Extrait la position de la souris
 * @param {MouseEvent} event - Événement souris
 * @returns {Object} { clientX, clientY, pageX, pageY }
 */
export function getMousePosition(event) {
  void event;
  // TODO: Extraire les coordonnées
  return undefined;
}

/**
 * Extrait les informations de touche
 * @param {KeyboardEvent} event - Événement clavier
 * @returns {Object} { key, code, modifiers }
 */
export function getKeyInfo(event) {
  void event;
  // TODO: Extraire key, code, et modifiers (ctrl, alt, shift, meta)
  return undefined;
}

/**
 * Vérifie si une combinaison de touches est pressée
 * @param {KeyboardEvent} event - Événement clavier
 * @param {string} key - Touche principale
 * @param {Object} modifiers - { ctrl, alt, shift, meta }
 * @returns {boolean} True si la combinaison correspond
 */
export function isKeyCombination(event, key, modifiers = {}) {
  void event;
  void key;
  void modifiers;
  // TODO: Vérifier key et tous les modifiers
  return undefined;
}

/**
 * Empêche le comportement par défaut si condition
 * @param {Event} event - Objet événement
 * @param {Function} condition - Fonction qui retourne boolean
 */
export function preventDefaultIf(event, condition) {
  void event;
  void condition;
  // TODO: Appeler preventDefault si condition(event) === true
}

/**
 * Crée un handler qui log les détails de l'événement
 * @param {string} label - Label pour le log
 * @returns {Function} Handler
 */
export function createEventLogger(label) {
  void label;
  // TODO: Retourner un handler qui affiche le label et event.type
  return undefined;
}

/**
 * Détecte le bouton de souris utilisé
 * @param {MouseEvent} event - Événement souris
 * @returns {string} 'left', 'middle', 'right', ou 'unknown'
 */
export function getMouseButton(event) {
  void event;
  // TODO: Utiliser event.button (0, 1, 2)
  return undefined;
}

/**
 * Calcule la position relative à un élément
 * @param {MouseEvent} event - Événement souris
 * @param {Element} element - Élément de référence
 * @returns {Object} { x, y } position relative
 */
export function getRelativePosition(event, element) {
  void event;
  void element;
  // TODO: Utiliser getBoundingClientRect et clientX/Y
  return undefined;
}
