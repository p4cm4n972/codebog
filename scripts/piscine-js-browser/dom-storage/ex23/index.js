/**
 * Ex23 - localStorage
 * Stocker des données persistantes dans le navigateur
 */

/**
 * Sauvegarde une valeur simple
 * @param {string} key - Clé
 * @param {string} value - Valeur string
 */
export function saveString(key, value) {
  void key;
  void value;
  // TODO: localStorage.setItem
}

/**
 * Récupère une valeur simple
 * @param {string} key - Clé
 * @param {string} defaultValue - Valeur par défaut
 * @returns {string|null} Valeur ou défaut
 */
export function getString(key, defaultValue = null) {
  void key;
  void defaultValue;
  // TODO: localStorage.getItem avec fallback
  return undefined;
}

/**
 * Sauvegarde un objet (JSON)
 * @param {string} key - Clé
 * @param {*} value - Valeur à sérialiser
 */
export function saveObject(key, value) {
  void key;
  void value;
  // TODO: JSON.stringify + setItem
}

/**
 * Récupère un objet (JSON)
 * @param {string} key - Clé
 * @param {*} defaultValue - Valeur par défaut
 * @returns {*} Objet désérialisé ou défaut
 */
export function getObject(key, defaultValue = null) {
  void key;
  void defaultValue;
  // TODO: getItem + JSON.parse avec try/catch
  return undefined;
}

/**
 * Supprime une clé
 * @param {string} key - Clé à supprimer
 */
export function remove(key) {
  void key;
  // TODO: localStorage.removeItem
}

/**
 * Efface tout le storage
 */
export function clearAll() {
  // TODO: localStorage.clear()
}

/**
 * Vérifie si une clé existe
 * @param {string} key - Clé à vérifier
 * @returns {boolean} True si existe
 */
export function hasKey(key) {
  void key;
  // TODO: getItem !== null
  return undefined;
}

/**
 * Récupère toutes les clés
 * @returns {string[]} Tableau des clés
 */
export function getAllKeys() {
  // TODO: Itérer avec localStorage.key()
  return undefined;
}

/**
 * Crée un wrapper localStorage typé
 * @returns {Object} { get, set, remove, clear, has, keys }
 */
export function createStorage() {
  // TODO: Retourner un objet avec toutes les méthodes
  return undefined;
}

/**
 * Sauvegarde avec expiration
 * @param {string} key - Clé
 * @param {*} value - Valeur
 * @param {number} ttlMs - Durée de vie en ms
 */
export function saveWithExpiry(key, value, ttlMs) {
  void key;
  void value;
  void ttlMs;
  // TODO: Stocker { value, expiry: Date.now() + ttlMs }
}

/**
 * Récupère avec vérification d'expiration
 * @param {string} key - Clé
 * @returns {*|null} Valeur ou null si expiré
 */
export function getWithExpiry(key) {
  void key;
  // TODO: Vérifier expiry, supprimer si expiré
  return undefined;
}
