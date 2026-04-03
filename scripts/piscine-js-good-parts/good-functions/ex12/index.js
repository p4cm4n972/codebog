/**
 * Ex12 - Invocation Patterns
 * Les 4 patterns d'appel de fonctions
 */

/**
 * Crée un objet avec une méthode qui utilise this
 * @param {string} name - Nom de la personne
 * @returns {Object} Objet avec méthode greet
 */
export function createPerson(name) {
  void name;
  // TODO: Retourner { name, greet() { return `Hello, ${this.name}` } }
  return undefined;
}

/**
 * Appelle une fonction avec un contexte spécifique (call)
 * @param {Function} fn - Fonction à appeler
 * @param {Object} context - Contexte this
 * @param {...any} args - Arguments
 * @returns {any} Résultat de l'appel
 */
export function callWith(fn, context, ...args) {
  void fn;
  void context;
  void args;
  // TODO: Utiliser fn.call(context, ...args)
  return undefined;
}

/**
 * Appelle une fonction avec un contexte et un tableau d'arguments (apply)
 * @param {Function} fn - Fonction à appeler
 * @param {Object} context - Contexte this
 * @param {Array} args - Tableau d'arguments
 * @returns {any} Résultat de l'appel
 */
export function applyWith(fn, context, args) {
  void fn;
  void context;
  void args;
  // TODO: Utiliser fn.apply(context, args)
  return undefined;
}

/**
 * Lie une fonction à un contexte (bind)
 * @param {Function} fn - Fonction à lier
 * @param {Object} context - Contexte this
 * @returns {Function} Fonction liée
 */
export function bindTo(fn, context) {
  void fn;
  void context;
  // TODO: Utiliser fn.bind(context)
  return undefined;
}

/**
 * Extrait une méthode d'un objet en conservant le contexte
 * @param {Object} obj - Objet source
 * @param {string} methodName - Nom de la méthode
 * @returns {Function} Méthode liée
 */
export function extractMethod(obj, methodName) {
  void obj;
  void methodName;
  // TODO: Retourner obj[methodName] lié à obj
  return undefined;
}

/**
 * Crée un emprunteur de méthode
 * @param {Function} method - Méthode à emprunter
 * @returns {Function} Fonction (obj, ...args) => result
 */
export function borrowMethod(method) {
  void method;
  // TODO: Retourner (obj, ...args) => method.call(obj, ...args)
  return undefined;
}

/**
 * Appelle une méthode sur un objet temporaire
 * @param {Object} obj - Objet temporaire
 * @param {Function} method - Méthode à exécuter
 * @param {...any} args - Arguments
 * @returns {any} Résultat
 */
export function callOnTemporary(obj, method, ...args) {
  void obj;
  void method;
  void args;
  // TODO: Exécuter method avec obj comme contexte
  return undefined;
}
