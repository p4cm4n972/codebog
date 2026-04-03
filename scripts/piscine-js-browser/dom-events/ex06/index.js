/**
 * Ex06 - Event Listeners
 * Attacher et détacher des écouteurs d'événements
 */

/**
 * Ajoute un écouteur de clic
 * @param {Element} element - Élément cible
 * @param {Function} handler - Fonction à exécuter
 */
export function addClickListener(element, handler) {
  void element;
  void handler;
  // TODO: addEventListener('click', handler)
}

/**
 * Retire un écouteur de clic
 * @param {Element} element - Élément cible
 * @param {Function} handler - Fonction à retirer
 */
export function removeClickListener(element, handler) {
  void element;
  void handler;
  // TODO: removeEventListener('click', handler)
}

/**
 * Ajoute un écouteur qui ne se déclenche qu'une fois
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 * @param {Function} handler - Fonction à exécuter
 */
export function addOnceListener(element, eventType, handler) {
  void element;
  void eventType;
  void handler;
  // TODO: addEventListener avec { once: true }
}

/**
 * Ajoute plusieurs écouteurs d'un coup
 * @param {Element} element - Élément cible
 * @param {Object} events - { eventType: handler }
 */
export function addMultipleListeners(element, events) {
  void element;
  void events;
  // TODO: Boucler sur l'objet events
}

/**
 * Crée un contrôleur pour gérer les listeners
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 * @param {Function} handler - Fonction à exécuter
 * @returns {Function} Fonction pour retirer le listener
 */
export function createRemovableListener(element, eventType, handler) {
  void element;
  void eventType;
  void handler;
  // TODO: Retourner une fonction qui appelle removeEventListener
  return undefined;
}

/**
 * Utilise AbortController pour les listeners
 * @param {Element} element - Élément cible
 * @param {Array} events - [{type, handler}, ...]
 * @returns {AbortController} Contrôleur pour abort
 */
export function createAbortableListeners(element, events) {
  void element;
  void events;
  // TODO: Créer AbortController et ajouter les listeners avec signal
  return undefined;
}

/**
 * Déclenche un événement programmatiquement
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 */
export function triggerEvent(element, eventType) {
  void element;
  void eventType;
  // TODO: dispatchEvent(new Event(eventType))
}

/**
 * Compte le nombre de clics sur un élément
 * @param {Element} element - Élément cible
 * @returns {Object} { getCount(), reset() }
 */
export function createClickCounter(element) {
  void element;
  // TODO: Créer un compteur avec closure
  return undefined;
}
