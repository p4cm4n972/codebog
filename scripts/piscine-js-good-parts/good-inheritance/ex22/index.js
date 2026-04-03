/**
 * Ex22 - Factory Functions
 * Alternatives aux constructeurs
 */

/**
 * Factory simple pour créer une personne
 * @param {string} name - Nom
 * @param {number} age - Âge
 * @returns {Object} { name, age, greet }
 */
export function createPerson(name, age) {
  void name;
  void age;
  // TODO: Retourner un objet avec greet()
  return undefined;
}

/**
 * Factory avec validation
 * @param {Object} config - { email, password }
 * @returns {Object} User ou throw si invalide
 */
export function createUser({ email, password }) {
  void email;
  void password;
  // TODO: Valider email (contient @) et password (min 8 chars)
  // Retourner { email, checkPassword(pwd) }
  return undefined;
}

/**
 * Factory avec état privé
 * @param {number} initial - Solde initial
 * @returns {Object} { deposit, withdraw, getBalance }
 */
export function createWallet(initial = 0) {
  void initial;
  // TODO: Balance privée via closure
  return undefined;
}

/**
 * Factory avec variantes
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Message
 * @returns {Object} { type, message, icon }
 */
export function createNotification(type, message) {
  void type;
  void message;
  // TODO: Retourner notification avec icon approprié
  // success: '✓', error: '✗', warning: '⚠', info: 'ℹ'
  return undefined;
}

/**
 * Factory avec méthodes chainables
 * @param {string} base - URL de base
 * @returns {Object} Builder chainable
 */
export function createUrlBuilder(base) {
  void base;
  // TODO: { addPath, addParam, build } chainables
  // build() retourne l'URL finale
  return undefined;
}

/**
 * Factory pour créer d'autres factories
 * @param {Object} defaults - Valeurs par défaut
 * @returns {Function} Factory configurée
 */
export function createFactory(defaults) {
  void defaults;
  // TODO: Retourner (overrides) => ({ ...defaults, ...overrides })
  return undefined;
}

/**
 * Factory avec pool (réutilisation d'objets)
 * @param {Function} creator - Fonction de création
 * @param {number} maxSize - Taille max du pool
 * @returns {Object} { acquire, release }
 */
export function createPool(creator, maxSize = 10) {
  void creator;
  void maxSize;
  // TODO: Gérer un pool d'objets réutilisables
  return undefined;
}
