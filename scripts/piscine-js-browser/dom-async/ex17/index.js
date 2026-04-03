/**
 * Ex17 - Fetch Basics
 * Comprendre l'API Fetch pour les requêtes HTTP
 */

/**
 * Effectue une requête GET et retourne le JSON
 * @param {string} url - URL à requêter
 * @returns {Promise<*>} Données JSON
 */
export async function fetchJson(url) {
  void url;
  // TODO: fetch + response.json()
  return undefined;
}

/**
 * Effectue une requête GET et retourne le texte
 * @param {string} url - URL à requêter
 * @returns {Promise<string>} Texte de la réponse
 */
export async function fetchText(url) {
  void url;
  // TODO: fetch + response.text()
  return undefined;
}

/**
 * Vérifie le status de la réponse
 * @param {string} url - URL à requêter
 * @returns {Promise<Object>} { ok, status, statusText }
 */
export async function checkStatus(url) {
  void url;
  // TODO: Retourner les propriétés de la réponse
  return undefined;
}

/**
 * Effectue une requête et lance une erreur si non ok
 * @param {string} url - URL à requêter
 * @returns {Promise<*>} Données JSON
 * @throws {Error} Si response.ok est false
 */
export async function fetchJsonOrThrow(url) {
  void url;
  // TODO: Vérifier response.ok avant de parser
  return undefined;
}

/**
 * Récupère un header spécifique de la réponse
 * @param {string} url - URL à requêter
 * @param {string} headerName - Nom du header
 * @returns {Promise<string|null>} Valeur du header
 */
export async function getResponseHeader(url, headerName) {
  void url;
  void headerName;
  // TODO: response.headers.get()
  return undefined;
}

/**
 * Construit une URL avec des paramètres de requête
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres { key: value }
 * @returns {string} URL complète
 */
export function buildUrl(baseUrl, params) {
  void baseUrl;
  void params;
  // TODO: URLSearchParams
  return undefined;
}

/**
 * Effectue une requête avec paramètres
 * @param {string} baseUrl - URL de base
 * @param {Object} params - Paramètres
 * @returns {Promise<*>} Données JSON
 */
export async function fetchWithParams(baseUrl, params) {
  void baseUrl;
  void params;
  // TODO: Combiner buildUrl + fetchJson
  return undefined;
}

/**
 * Récupère une image comme Blob
 * @param {string} url - URL de l'image
 * @returns {Promise<Blob>} Blob de l'image
 */
export async function fetchImage(url) {
  void url;
  // TODO: fetch + response.blob()
  return undefined;
}
