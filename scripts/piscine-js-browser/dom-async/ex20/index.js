/**
 * Ex20 - Request Headers
 * Configurer les headers des requêtes HTTP
 */

/**
 * Crée un objet Headers
 * @param {Object} headers - { name: value }
 * @returns {Headers} Objet Headers
 */
export function createHeaders(headers) {
  void headers;
  // TODO: new Headers() + append
  return undefined;
}

/**
 * Fetch avec headers personnalisés
 * @param {string} url - URL à requêter
 * @param {Object} headers - Headers à ajouter
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithHeaders(url, headers) {
  void url;
  void headers;
  // TODO: fetch avec headers dans les options
  return undefined;
}

/**
 * Fetch avec Bearer token
 * @param {string} url - URL à requêter
 * @param {string} token - Token d'authentification
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithBearerToken(url, token) {
  void url;
  void token;
  // TODO: Header Authorization: Bearer {token}
  return undefined;
}

/**
 * Fetch avec Basic Auth
 * @param {string} url - URL à requêter
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithBasicAuth(url, username, password) {
  void url;
  void username;
  void password;
  // TODO: btoa + Header Authorization: Basic {credentials}
  return undefined;
}

/**
 * Fetch avec API Key
 * @param {string} url - URL à requêter
 * @param {string} apiKey - Clé API
 * @param {string} headerName - Nom du header (défaut: X-API-Key)
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithApiKey(url, apiKey, headerName = 'X-API-Key') {
  void url;
  void apiKey;
  void headerName;
  // TODO: Header personnalisé avec la clé
  return undefined;
}

/**
 * Fetch avec credentials (cookies)
 * @param {string} url - URL à requêter
 * @param {string} credentialsMode - 'include', 'same-origin', 'omit'
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithCredentials(url, credentialsMode) {
  void url;
  void credentialsMode;
  // TODO: fetch avec credentials dans les options
  return undefined;
}

/**
 * Fetch sans cache
 * @param {string} url - URL à requêter
 * @returns {Promise<*>} Données JSON
 */
export async function fetchNoCache(url) {
  void url;
  // TODO: fetch avec cache: 'no-store'
  return undefined;
}

/**
 * Crée un client API avec headers par défaut
 * @param {string} baseUrl - URL de base
 * @param {Object} defaultHeaders - Headers par défaut
 * @returns {Object} { get, post }
 */
export function createAuthenticatedClient(baseUrl, defaultHeaders) {
  void baseUrl;
  void defaultHeaders;
  // TODO: Client qui ajoute les headers par défaut à chaque requête
  return undefined;
}

/**
 * Clone et modifie des headers
 * @param {Headers} original - Headers originaux
 * @param {Object} modifications - Headers à ajouter/modifier
 * @returns {Headers} Nouveaux headers
 */
export function modifyHeaders(original, modifications) {
  void original;
  void modifications;
  // TODO: Créer une copie et appliquer les modifications
  return undefined;
}
