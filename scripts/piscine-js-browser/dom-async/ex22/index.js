/**
 * Ex22 - Parallel Requests
 * Exécuter plusieurs requêtes en parallèle efficacement
 */

/**
 * Fetch toutes les URLs en parallèle (échoue si une échoue)
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<*[]>} Tableau de données
 */
export async function fetchAll(urls) {
  void urls;
  // TODO: Promise.all
  return undefined;
}

/**
 * Fetch toutes les URLs, même si certaines échouent
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<Object[]>} [{ status, value/reason }]
 */
export async function fetchAllSettled(urls) {
  void urls;
  // TODO: Promise.allSettled
  return undefined;
}

/**
 * Retourne le résultat de la première requête terminée
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<*>} Première donnée reçue
 */
export async function fetchRace(urls) {
  void urls;
  // TODO: Promise.race
  return undefined;
}

/**
 * Retourne le premier succès (ignore les erreurs)
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<*>} Premier succès
 */
export async function fetchAny(urls) {
  void urls;
  // TODO: Promise.any
  return undefined;
}

/**
 * Fetch avec limite de concurrence
 * @param {string[]} urls - URLs à requêter
 * @param {number} limit - Nombre max de requêtes simultanées
 * @returns {Promise<*[]>} Tableau de données
 */
export async function fetchWithLimit(urls, limit) {
  void urls;
  void limit;
  // TODO: Traiter par batch de 'limit' requêtes
  return undefined;
}

/**
 * Fetch une liste de ressources par ID
 * @param {string} baseUrl - URL de base (ex: /api/users)
 * @param {(string|number)[]} ids - IDs à requêter
 * @returns {Promise<*[]>} Tableau de ressources
 */
export async function fetchByIds(baseUrl, ids) {
  void baseUrl;
  void ids;
  // TODO: map + Promise.all
  return undefined;
}

/**
 * Fetch séquentiel (un après l'autre)
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<*[]>} Tableau de données
 */
export async function fetchSequential(urls) {
  void urls;
  // TODO: for...of avec await
  return undefined;
}

/**
 * Sépare les succès et les erreurs
 * @param {string[]} urls - URLs à requêter
 * @returns {Promise<Object>} { successes: [], failures: [] }
 */
export async function fetchWithPartition(urls) {
  void urls;
  // TODO: allSettled puis partition
  return undefined;
}

/**
 * Fetch avec retry individuel pour chaque URL
 * @param {string[]} urls - URLs à requêter
 * @param {number} retries - Nombre de retries par URL
 * @returns {Promise<*[]>} Tableau de données
 */
export async function fetchAllWithRetry(urls, retries = 3) {
  void urls;
  void retries;
  // TODO: Chaque URL a ses propres retries
  return undefined;
}

/**
 * Agrège les résultats de plusieurs endpoints
 * @param {Object} endpoints - { key: url }
 * @returns {Promise<Object>} { key: data }
 */
export async function fetchAndAggregate(endpoints) {
  void endpoints;
  // TODO: Retourner un objet avec les mêmes clés
  return undefined;
}
