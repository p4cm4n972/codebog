/**
 * Ex26 - Cookies & Storage Patterns
 * Comprendre les cookies et choisir le bon stockage
 */

/**
 * Récupère un cookie par nom
 * @param {string} name - Nom du cookie
 * @returns {string|null} Valeur ou null
 */
export function getCookie(name) {
  void name;
  // TODO: Parser document.cookie
  return undefined;
}

/**
 * Définit un cookie
 * @param {string} name - Nom du cookie
 * @param {string} value - Valeur
 * @param {Object} options - { maxAge, path, secure, sameSite }
 */
export function setCookie(name, value, options = {}) {
  void name;
  void value;
  void options;
  // TODO: Construire la chaîne cookie
}

/**
 * Supprime un cookie
 * @param {string} name - Nom du cookie
 */
export function deleteCookie(name) {
  void name;
  // TODO: Mettre max-age=0
}

/**
 * Récupère tous les cookies comme objet
 * @returns {Object} { name: value }
 */
export function getAllCookies() {
  // TODO: Parser et retourner un objet
  return undefined;
}

/**
 * Crée une abstraction de stockage
 * @param {string} type - 'local', 'session', 'memory', 'cookie'
 * @returns {Object} { get, set, remove }
 */
export function createStorage(type) {
  void type;
  // TODO: Factory pour différents types de storage
  return undefined;
}

/**
 * Détecte le storage disponible
 * @returns {Object} { localStorage, sessionStorage, indexedDB, cookies }
 */
export function detectStorageSupport() {
  // TODO: Tester chaque type de storage
  return undefined;
}

/**
 * Calcule la taille utilisée par localStorage
 * @returns {number} Taille en bytes
 */
export function getLocalStorageSize() {
  // TODO: Calculer la taille totale
  return undefined;
}

/**
 * Crée un store avec fallback automatique
 * @param {string[]} fallbackOrder - ['localStorage', 'sessionStorage', 'memory']
 * @returns {Object} { get, set, remove }
 */
export function createStorageWithFallback(fallbackOrder) {
  void fallbackOrder;
  // TODO: Utiliser le premier storage disponible
  return undefined;
}

/**
 * Synchronise entre tabs avec localStorage
 * @param {string} key - Clé à synchroniser
 * @param {Function} onChange - Callback(newValue, oldValue)
 * @returns {Function} Cleanup function
 */
export function syncAcrossTabs(key, onChange) {
  void key;
  void onChange;
  // TODO: window.addEventListener('storage', ...)
  return undefined;
}

/**
 * Crée un store persistant avec versioning
 * @param {string} key - Clé de stockage
 * @param {number} version - Version du schema
 * @param {Function} migrate - (oldData, oldVersion) => newData
 * @returns {Object} { get, set }
 */
export function createVersionedStorage(key, version, migrate) {
  void key;
  void version;
  void migrate;
  // TODO: Stocker avec version et migrer si nécessaire
  return undefined;
}
