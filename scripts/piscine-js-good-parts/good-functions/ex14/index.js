/**
 * Ex14 - Return
 * Valeurs de retour et patterns
 */

/**
 * Division sécurisée avec early return
 * @param {number} a - Dividende
 * @param {number} b - Diviseur
 * @returns {number|null} Résultat ou null si division par 0
 */
export function safeDivide(a, b) {
  void a;
  void b;
  // TODO: Retourner null si b === 0, sinon a / b
  return undefined;
}

/**
 * Retourne le premier élément valide ou undefined
 * @param {Array} arr - Tableau
 * @param {Function} predicate - Fonction de test
 * @returns {any} Premier élément valide
 */
export function findFirst(arr, predicate) {
  void arr;
  void predicate;
  // TODO: Early return dès qu'un élément satisfait le prédicat
  return undefined;
}

/**
 * Crée une fonction qui retourne toujours la même valeur
 * @param {any} value - Valeur à retourner
 * @returns {Function} Fonction constante
 */
export function constant(value) {
  void value;
  // TODO: Retourner () => value
  return undefined;
}

/**
 * Crée une fonction d'identité
 * @returns {Function} Fonction qui retourne son argument
 */
export function identity() {
  // TODO: Retourner x => x
  return undefined;
}

/**
 * Retourne une valeur ou exécute une fonction par défaut
 * @param {any} value - Valeur potentielle
 * @param {Function} defaultFn - Fonction à exécuter si value est null/undefined
 * @returns {any} Valeur ou résultat de defaultFn
 */
export function getOrElse(value, defaultFn) {
  void value;
  void defaultFn;
  // TODO: Retourner value si non-null, sinon appeler defaultFn()
  return undefined;
}

/**
 * Crée un créateur de créateurs (triple nested)
 * @param {Function} transform - Transformation à appliquer
 * @returns {Function} factor => value => transform(value * factor)
 */
export function createTransformer(transform) {
  void transform;
  // TODO: Retourner factor => value => transform(value * factor)
  return undefined;
}

/**
 * Retourne un tuple [succès, résultat/erreur]
 * @param {Function} fn - Fonction à exécuter
 * @param {...any} args - Arguments
 * @returns {[boolean, any]} [true, result] ou [false, error]
 */
export function tryCatch(fn, ...args) {
  void fn;
  void args;
  // TODO: Essayer d'exécuter fn et retourner le tuple approprié
  return undefined;
}
