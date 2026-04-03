/**
 * Ex21 - AbortController
 * Annuler des requêtes HTTP avec AbortController
 */

/**
 * Crée une requête annulable
 * @param {string} url - URL à requêter
 * @returns {Object} { promise, abort }
 */
export function createCancellableRequest(url) {
  void url;
  // TODO: AbortController + retourner promise et fonction abort
  return undefined;
}

/**
 * Fetch avec timeout
 * @param {string} url - URL à requêter
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithTimeout(url, timeout) {
  void url;
  void timeout;
  // TODO: AbortController + setTimeout
  return undefined;
}

/**
 * Vérifie si une erreur est une annulation
 * @param {Error} error - Erreur à vérifier
 * @returns {boolean} True si AbortError
 */
export function isAbortError(error) {
  void error;
  // TODO: Vérifier error.name === 'AbortError'
  return undefined;
}

/**
 * Crée un gestionnaire de recherche avec annulation auto
 * @returns {Object} { search(query), cancel() }
 */
export function createSearchHandler() {
  // TODO: Annuler automatiquement la recherche précédente
  return undefined;
}

/**
 * Fetch plusieurs URLs avec un signal partagé
 * @param {string[]} urls - URLs à requêter
 * @param {AbortSignal} signal - Signal d'annulation
 * @returns {Promise<*[]>} Tableau de données
 */
export async function fetchAllWithSignal(urls, signal) {
  void urls;
  void signal;
  // TODO: Promise.all avec le même signal
  return undefined;
}

/**
 * Course entre fetch et timeout
 * @param {string} url - URL à requêter
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<*>} Données ou erreur timeout
 */
export async function raceWithTimeout(url, timeout) {
  void url;
  void timeout;
  // TODO: Promise.race entre fetch et setTimeout qui rejette
  return undefined;
}

/**
 * Fetch avec annulation si composant démonté
 * @param {string} url - URL à requêter
 * @returns {Object} { promise, cleanup }
 */
export function fetchWithCleanup(url) {
  void url;
  // TODO: Retourner promise et fonction de cleanup
  return undefined;
}

/**
 * Crée un pool de requêtes annulables
 * @returns {Object} { add(url), abortAll(), getResults() }
 */
export function createRequestPool() {
  // TODO: Gérer plusieurs requêtes avec un controller partagé
  return undefined;
}
