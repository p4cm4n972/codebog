/**
 * Ex09 - Event Delegation
 * Optimiser la gestion des événements avec la délégation
 */

/**
 * Délègue un événement à un conteneur
 * @param {Element} container - Élément conteneur
 * @param {string} selector - Sélecteur des éléments cibles
 * @param {string} eventType - Type d'événement
 * @param {Function} handler - Fonction à exécuter (this = élément ciblé)
 */
export function delegate(container, selector, eventType, handler) {
  void container;
  void selector;
  void eventType;
  void handler;
  // TODO: Utiliser closest() et contains()
}

/**
 * Crée un handler délégué simple
 * @param {string} selector - Sélecteur CSS
 * @param {Function} handler - Handler à exécuter
 * @returns {Function} Handler pour addEventListener
 */
export function createDelegatedHandler(selector, handler) {
  void selector;
  void handler;
  // TODO: Retourner un handler qui vérifie target.matches ou closest
  return undefined;
}

/**
 * Gère les clics sur une liste d'items
 * @param {Element} list - Élément liste (ul/ol)
 * @param {Function} onItemClick - Callback(item, index)
 */
export function handleListClicks(list, onItemClick) {
  void list;
  void onItemClick;
  // TODO: Déléguer les clics sur les li
}

/**
 * Crée une table avec délégation pour les actions
 * @param {Element} table - Élément table
 * @param {Object} actions - { 'edit': handler, 'delete': handler }
 */
export function setupTableActions(table, actions) {
  void table;
  void actions;
  // TODO: Déléguer les clics sur les boutons data-action
}

/**
 * Gère le hover sur des éléments dynamiques
 * @param {Element} container - Conteneur
 * @param {string} selector - Sélecteur des éléments
 * @param {Function} onEnter - Callback au mouseenter
 * @param {Function} onLeave - Callback au mouseleave
 */
export function delegateHover(container, selector, onEnter, onLeave) {
  void container;
  void selector;
  void onEnter;
  void onLeave;
  // TODO: Utiliser mouseover/mouseout avec vérification
}

/**
 * Compte les clics par élément avec délégation
 * @param {Element} container - Conteneur
 * @param {string} selector - Sélecteur
 * @returns {Object} { getCount(element), getTotalClicks() }
 */
export function createClickTracker(container, selector) {
  void container;
  void selector;
  // TODO: Utiliser un WeakMap pour tracker les clics
  return undefined;
}

/**
 * Retire la délégation (cleanup)
 * @param {Element} container - Conteneur
 * @param {string} eventType - Type d'événement
 * @param {Function} delegatedHandler - Handler à retirer
 */
export function undelegate(container, eventType, delegatedHandler) {
  void container;
  void eventType;
  void delegatedHandler;
  // TODO: removeEventListener
}
