/**
 * Ex08 - Event Bubbling & Capturing
 * Comprendre la propagation des événements
 */

/**
 * Ajoute un listener en phase de capture
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 * @param {Function} handler - Fonction à exécuter
 */
export function addCaptureListener(element, eventType, handler) {
  void element;
  void eventType;
  void handler;
  // TODO: addEventListener avec capture: true
}

/**
 * Ajoute un listener en phase de bubbling (défaut)
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 * @param {Function} handler - Fonction à exécuter
 */
export function addBubbleListener(element, eventType, handler) {
  void element;
  void eventType;
  void handler;
  // TODO: addEventListener normal (bubble par défaut)
}

/**
 * Crée un handler qui arrête la propagation
 * @param {Function} handler - Handler original
 * @returns {Function} Handler qui stop la propagation
 */
export function createStopPropagationHandler(handler) {
  void handler;
  // TODO: Retourner handler qui appelle stopPropagation
  return undefined;
}

/**
 * Crée un handler qui arrête toute propagation
 * @param {Function} handler - Handler original
 * @returns {Function} Handler qui stop immédiatement
 */
export function createStopImmediateHandler(handler) {
  void handler;
  // TODO: Retourner handler qui appelle stopImmediatePropagation
  return undefined;
}

/**
 * Trace le chemin de propagation d'un événement
 * @param {Element} element - Élément racine
 * @returns {string[]} Chemins traversés
 */
export function setupPropagationTracker(element) {
  void element;
  // TODO: Installer des listeners sur chaque niveau
  // Retourner un tableau qui sera rempli lors de la propagation
  return undefined;
}

/**
 * Vérifie si un événement bubble
 * @param {Event} event - Objet événement
 * @returns {boolean} True si l'événement bubble
 */
export function doesEventBubble(event) {
  void event;
  // TODO: Utiliser event.bubbles
  return undefined;
}

/**
 * Vérifie la phase actuelle de l'événement
 * @param {Event} event - Objet événement
 * @returns {string} 'capturing', 'at_target', ou 'bubbling'
 */
export function getEventPhase(event) {
  void event;
  // TODO: Utiliser event.eventPhase (1, 2, ou 3)
  return undefined;
}

/**
 * Crée une structure avec tracking de propagation
 * @returns {Object} { container, child, clicks[] }
 */
export function createTrackingStructure() {
  // TODO: Créer parent et enfant avec listeners qui trackent l'ordre
  return undefined;
}
