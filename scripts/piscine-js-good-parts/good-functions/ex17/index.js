/**
 * Ex17 - Module Pattern
 * Encapsulation avec closures
 */

/**
 * Crée un module compteur
 * @returns {Object} { increment, decrement, getCount }
 */
export function createCounterModule() {
  // TODO: Utiliser une IIFE ou closure pour créer un compteur privé
  return undefined;
}

/**
 * Crée un module de cache (key-value store)
 * @param {number} maxSize - Taille maximum du cache
 * @returns {Object} { set, get, has, clear, size }
 */
export function createCacheModule(maxSize = 100) {
  void maxSize;
  // TODO: Créer un cache avec limite de taille
  return undefined;
}

/**
 * Crée un module de validation
 * @returns {Object} { addRule, validate, getErrors }
 */
export function createValidatorModule() {
  // TODO: Module avec règles de validation personnalisables
  // addRule(name, validator) ajoute une règle
  // validate(value) exécute toutes les règles
  // getErrors() retourne les erreurs de la dernière validation
  return undefined;
}

/**
 * Crée un module pub/sub (publish/subscribe)
 * @returns {Object} { subscribe, unsubscribe, publish }
 */
export function createPubSubModule() {
  // TODO: Créer un système d'événements
  // subscribe(event, callback) retourne une fonction unsubscribe
  // publish(event, data) notifie tous les abonnés
  return undefined;
}

/**
 * Crée un module de state management simple
 * @param {Object} initialState - État initial
 * @returns {Object} { getState, setState, subscribe }
 */
export function createStoreModule(initialState = {}) {
  void initialState;
  // TODO: Créer un store avec notifications aux abonnés
  return undefined;
}

/**
 * Crée un module logger avec niveaux
 * @param {string} minLevel - Niveau minimum ('debug', 'info', 'warn', 'error')
 * @returns {Object} { debug, info, warn, error, setLevel, getLogs }
 */
export function createLoggerModule(minLevel = 'info') {
  void minLevel;
  // TODO: Logger qui filtre par niveau et conserve l'historique
  return undefined;
}
