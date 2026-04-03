/**
 * Ex13 - Arguments
 * Paramètres et arguments de fonctions
 */

/**
 * Calcule la somme de tous les arguments
 * @param {...number} numbers - Nombres à additionner
 * @returns {number} Somme
 */
export function sum(...numbers) {
  void numbers;
  // TODO: Utiliser reduce pour sommer
  return undefined;
}

/**
 * Retourne le premier argument ou une valeur par défaut
 * @param {any} value - Valeur
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} value ou defaultValue si undefined
 */
export function withDefault(value, defaultValue = null) {
  void value;
  void defaultValue;
  // TODO: Retourner value si défini, sinon defaultValue
  return undefined;
}

/**
 * Crée un utilisateur à partir d'options
 * @param {Object} options - { name, age?, email? }
 * @returns {Object} Utilisateur avec valeurs par défaut
 */
export function createUser({ name, age = 18, email = null }) {
  void name;
  void age;
  void email;
  // TODO: Retourner { name, age, email }
  return undefined;
}

/**
 * Extrait les propriétés spécifiées d'un objet
 * @param {Object} obj - Objet source
 * @param {string[]} keys - Clés à extraire
 * @returns {Object} Objet extrait
 */
export function pluck(obj, keys) {
  void obj;
  void keys;
  // TODO: Créer un objet avec seulement les clés spécifiées
  return undefined;
}

/**
 * Combine plusieurs fonctions en une seule
 * @param {...Function} fns - Fonctions à combiner
 * @returns {Function} Fonction qui appelle toutes les fonctions
 */
export function combineCallbacks(...fns) {
  void fns;
  // TODO: Retourner (...args) => fns.forEach(fn => fn(...args))
  return undefined;
}

/**
 * Crée une fonction qui accepte au plus N arguments
 * @param {Function} fn - Fonction originale
 * @param {number} n - Nombre max d'arguments
 * @returns {Function} Fonction limitée
 */
export function arity(fn, n) {
  void fn;
  void n;
  // TODO: Retourner (...args) => fn(...args.slice(0, n))
  return undefined;
}

/**
 * Retourne un objet avec les arguments nommés
 * @param {Array} names - Noms des paramètres
 * @param {Array} values - Valeurs des arguments
 * @returns {Object} Arguments nommés
 */
export function namedArgs(names, values) {
  void names;
  void values;
  // TODO: Créer { [name]: value } pour chaque paire
  return undefined;
}
