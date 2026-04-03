/**
 * Ex11 - Function Literals
 * Expressions de fonctions
 */

/**
 * Crée une fonction qui additionne deux nombres
 * @returns {Function} Fonction d'addition
 */
export function createAdder() {
  // TODO: Retourner une arrow function (a, b) => a + b
  return undefined;
}

/**
 * Crée une fonction qui multiplie par un facteur
 * @param {number} factor - Facteur de multiplication
 * @returns {Function} Fonction de multiplication
 */
export function createMultiplier(factor) {
  void factor;
  // TODO: Retourner n => n * factor
  return undefined;
}

/**
 * Crée une fonction qui compose un message de salutation
 * @param {string} greeting - Salutation (ex: 'Hello')
 * @returns {Function} Fonction (name) => message
 */
export function createGreeter(greeting) {
  void greeting;
  // TODO: Retourner name => `${greeting}, ${name}!`
  return undefined;
}

/**
 * Transforme une fonction pour qu'elle log ses arguments
 * @param {Function} fn - Fonction originale
 * @returns {Function} Fonction wrappée
 */
export function withLogging(fn) {
  void fn;
  // TODO: Retourner une fonction qui:
  // 1. Collecte les arguments
  // 2. Appelle fn avec ces arguments
  // 3. Retourne le résultat
  return undefined;
}

/**
 * Crée une fonction qui n'exécute qu'une fois
 * @param {Function} fn - Fonction à exécuter une fois
 * @returns {Function} Fonction wrappée
 */
export function once(fn) {
  void fn;
  // TODO: Retourner une fonction qui:
  // - Appelle fn la première fois
  // - Retourne undefined les fois suivantes
  return undefined;
}

/**
 * Crée une fonction avec des arguments pré-remplis
 * @param {Function} fn - Fonction originale
 * @param {...any} presetArgs - Arguments à pré-remplir
 * @returns {Function} Fonction partielle
 */
export function partial(fn, ...presetArgs) {
  void fn;
  void presetArgs;
  // TODO: Retourner (...args) => fn(...presetArgs, ...args)
  return undefined;
}
