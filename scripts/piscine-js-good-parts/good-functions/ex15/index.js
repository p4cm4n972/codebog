/**
 * Ex15 - Closure
 * Fermetures lexicales
 */

/**
 * Crée un compteur avec état privé
 * @param {number} initial - Valeur initiale
 * @returns {Object} { increment, decrement, getCount, reset }
 */
export function createCounter(initial = 0) {
  void initial;
  // TODO: Utiliser une closure pour l'état privé
  return undefined;
}

/**
 * Crée une fonction avec mémoire (memoization)
 * @param {Function} fn - Fonction à mémoriser
 * @returns {Function} Fonction mémorisée
 */
export function memoize(fn) {
  void fn;
  // TODO: Utiliser une closure pour stocker le cache
  // Le cache associe les arguments stringifiés au résultat
  return undefined;
}

/**
 * Crée un accumulateur
 * @param {number} initial - Valeur initiale
 * @returns {Function} Fonction (n) => nouveau total
 */
export function createAccumulator(initial = 0) {
  void initial;
  // TODO: Retourner une fonction qui ajoute n au total
  return undefined;
}

/**
 * Crée une séquence privée
 * @returns {Function} Fonction qui retourne le prochain ID
 */
export function createIdGenerator() {
  // TODO: Retourner une fonction qui incrémente et retourne un ID
  return undefined;
}

/**
 * Crée une fonction limitée (rate limiter simple)
 * @param {Function} fn - Fonction à limiter
 * @param {number} limit - Nombre max d'appels
 * @returns {Function} Fonction limitée
 */
export function limitCalls(fn, limit) {
  void fn;
  void limit;
  // TODO: Utiliser une closure pour compter les appels
  // Retourner undefined après la limite
  return undefined;
}

/**
 * Crée un toggle (alterne entre deux valeurs)
 * @param {any} a - Première valeur
 * @param {any} b - Deuxième valeur
 * @returns {Function} Fonction qui alterne entre a et b
 */
export function createToggle(a, b) {
  void a;
  void b;
  // TODO: Utiliser une closure pour l'état
  return undefined;
}

/**
 * Crée une fonction qui suit l'historique de ses appels
 * @param {Function} fn - Fonction à tracer
 * @returns {Object} { call: Function, history: Function }
 */
export function withHistory(fn) {
  void fn;
  // TODO: Stocker l'historique des { args, result } dans une closure
  return undefined;
}
