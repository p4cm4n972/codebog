/**
 * Ex11 - Custom Events
 * Créer et dispatcher des événements personnalisés
 */

/**
 * Crée un événement simple
 * @param {string} name - Nom de l'événement
 * @param {Object} options - { bubbles, cancelable }
 * @returns {Event} Événement créé
 */
export function createEvent(name, options = {}) {
  void name;
  void options;
  // TODO: new Event(name, options)
  return undefined;
}

/**
 * Crée un événement personnalisé avec données
 * @param {string} name - Nom de l'événement
 * @param {*} data - Données à inclure
 * @param {Object} options - { bubbles, cancelable }
 * @returns {CustomEvent} Événement créé
 */
export function createCustomEvent(name, data, options = {}) {
  void name;
  void data;
  void options;
  // TODO: new CustomEvent avec detail
  return undefined;
}

/**
 * Dispatch un événement sur un élément
 * @param {Element} element - Élément cible
 * @param {Event} event - Événement à dispatcher
 * @returns {boolean} True si l'événement n'a pas été annulé
 */
export function dispatchEvent(element, event) {
  void element;
  void event;
  // TODO: element.dispatchEvent(event)
  return undefined;
}

/**
 * Crée un système d'événements pub/sub
 * @returns {Object} { on, off, emit }
 */
export function createEventBus() {
  // TODO: Créer un système pub/sub avec addEventListener/dispatchEvent
  return undefined;
}

/**
 * Déclenche un événement avec confirmation
 * @param {Element} element - Élément cible
 * @param {string} eventName - Nom de l'événement
 * @param {*} data - Données de l'événement
 * @returns {boolean} True si non annulé
 */
export function triggerCancelableEvent(element, eventName, data) {
  void element;
  void eventName;
  void data;
  // TODO: CustomEvent cancelable et vérifier le retour de dispatchEvent
  return undefined;
}

/**
 * Crée un émetteur d'événements typé
 * @param {Element} element - Élément de base
 * @param {string[]} eventTypes - Types d'événements supportés
 * @returns {Object} { emit(type, data), on(type, handler) }
 */
export function createTypedEmitter(element, eventTypes) {
  void element;
  void eventTypes;
  // TODO: Vérifier que le type est dans la liste avant d'émettre
  return undefined;
}

/**
 * Écoute un événement une seule fois avec timeout
 * @param {Element} element - Élément cible
 * @param {string} eventType - Type d'événement
 * @param {number} timeout - Timeout en ms
 * @returns {Promise} Résolu avec event ou rejeté si timeout
 */
export function waitForEvent(element, eventType, timeout) {
  void element;
  void eventType;
  void timeout;
  // TODO: Promise avec once et setTimeout
  return undefined;
}

/**
 * Crée un proxy d'événements entre deux éléments
 * @param {Element} source - Élément source
 * @param {Element} target - Élément cible
 * @param {string[]} eventTypes - Événements à relayer
 * @returns {Function} Cleanup function
 */
export function relayEvents(source, target, eventTypes) {
  void source;
  void target;
  void eventTypes;
  // TODO: Écouter sur source et dispatcher sur target
  return undefined;
}

/**
 * Crée un événement composé de plusieurs sous-événements
 * @param {Element} element - Élément cible
 * @param {string[]} eventTypes - Événements requis
 * @param {string} composedEventName - Nom de l'événement composé
 * @param {number} timeout - Timeout pour recevoir tous les événements
 */
export function createComposedEvent(element, eventTypes, composedEventName, timeout) {
  void element;
  void eventTypes;
  void composedEventName;
  void timeout;
  // TODO: Déclencher composedEvent quand tous les sous-événements sont reçus
}
