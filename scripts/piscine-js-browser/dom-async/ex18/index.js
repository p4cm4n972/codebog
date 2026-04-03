/**
 * Ex18 - POST and Other Methods
 * Envoyer des données avec différentes méthodes HTTP
 */

/**
 * Envoie des données JSON en POST
 * @param {string} url - URL de destination
 * @param {Object} data - Données à envoyer
 * @returns {Promise<*>} Réponse JSON
 */
export async function postJson(url, data) {
  void url;
  void data;
  // TODO: fetch avec method: 'POST' et JSON.stringify
  return undefined;
}

/**
 * Envoie un FormData en POST
 * @param {string} url - URL de destination
 * @param {FormData} formData - Données du formulaire
 * @returns {Promise<*>} Réponse JSON
 */
export async function postFormData(url, formData) {
  void url;
  void formData;
  // TODO: fetch avec FormData (sans Content-Type header)
  return undefined;
}

/**
 * Met à jour une ressource (PUT)
 * @param {string} url - URL de la ressource
 * @param {Object} data - Nouvelles données complètes
 * @returns {Promise<*>} Réponse JSON
 */
export async function putJson(url, data) {
  void url;
  void data;
  // TODO: fetch avec method: 'PUT'
  return undefined;
}

/**
 * Met à jour partiellement une ressource (PATCH)
 * @param {string} url - URL de la ressource
 * @param {Object} data - Données partielles
 * @returns {Promise<*>} Réponse JSON
 */
export async function patchJson(url, data) {
  void url;
  void data;
  // TODO: fetch avec method: 'PATCH'
  return undefined;
}

/**
 * Supprime une ressource (DELETE)
 * @param {string} url - URL de la ressource
 * @returns {Promise<boolean>} True si supprimé
 */
export async function deleteResource(url) {
  void url;
  // TODO: fetch avec method: 'DELETE', retourner response.ok
  return undefined;
}

/**
 * Vérifie si une ressource existe (HEAD)
 * @param {string} url - URL de la ressource
 * @returns {Promise<boolean>} True si existe
 */
export async function resourceExists(url) {
  void url;
  // TODO: fetch avec method: 'HEAD'
  return undefined;
}

/**
 * Crée un client API simple
 * @param {string} baseUrl - URL de base de l'API
 * @returns {Object} { get, post, put, patch, delete }
 */
export function createApiClient(baseUrl) {
  void baseUrl;
  // TODO: Retourner un objet avec les méthodes HTTP
  return undefined;
}

/**
 * Upload un fichier avec progression (via XMLHttpRequest)
 * @param {string} url - URL d'upload
 * @param {File} file - Fichier à uploader
 * @param {Function} onProgress - Callback(percentage)
 * @returns {Promise<*>} Réponse JSON
 */
export function uploadWithProgress(url, file, onProgress) {
  void url;
  void file;
  void onProgress;
  // TODO: XMLHttpRequest avec upload.onprogress
  return undefined;
}
