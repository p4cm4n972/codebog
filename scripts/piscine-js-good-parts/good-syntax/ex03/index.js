/**
 * Ex03 - Guard Expressions
 * && et || pour le contrôle de flux
 */

/**
 * Exécute une action seulement si la condition est vraie
 * @param {boolean} condition - Condition
 * @param {Function} action - Action à exécuter
 * @returns {any} Résultat de l'action ou undefined
 */
export function guard(condition, action) {
  void condition;
  void action;
  // TODO: Retourner condition && action()
  return undefined;
}

/**
 * Retourne la première valeur truthy
 * @param {...any} values - Valeurs à tester
 * @returns {any} Première valeur truthy ou la dernière
 */
export function firstTruthy(...values) {
  void values;
  // TODO: Utiliser || ou reduce
  return undefined;
}

/**
 * Retourne la première valeur falsy
 * @param {...any} values - Valeurs à tester
 * @returns {any} Première valeur falsy ou la dernière
 */
export function firstFalsy(...values) {
  void values;
  // TODO: Utiliser && ou reduce
  return undefined;
}

/**
 * Accès sécurisé à une propriété imbriquée
 * @param {Object} obj - Objet
 * @param {string[]} path - Chemin de propriétés
 * @returns {any} Valeur ou undefined
 */
export function safeGet(obj, path) {
  void obj;
  void path;
  // TODO: Naviguer avec && ou optional chaining
  return undefined;
}

/**
 * Exécute une fonction avec des arguments seulement s'ils sont tous truthy
 * @param {Function} fn - Fonction à exécuter
 * @param {...any} args - Arguments
 * @returns {any} Résultat ou undefined
 */
export function callIfAllTruthy(fn, ...args) {
  void fn;
  void args;
  // TODO: Vérifier tous les args et appeler fn si tous truthy
  return undefined;
}

/**
 * Pattern de validation avec guards
 * @param {string} value - Valeur à valider
 * @param {Object} rules - Règles {required, minLength, maxLength}
 * @returns {Object} {valid, error}
 */
export function validate(value, rules) {
  void value;
  void rules;
  // TODO: Appliquer les règles avec && pour court-circuiter
  return undefined;
}
