/**
 * Ex08 - Reflection
 * Introspection d'objets
 */

/**
 * Liste toutes les clés propres d'un objet
 * @param {Object} obj - Objet
 * @returns {string[]} Clés
 */
export function getOwnKeys(obj) {
  void obj;
  // TODO: Utiliser Object.keys
  return undefined;
}

/**
 * Liste toutes les valeurs propres d'un objet
 * @param {Object} obj - Objet
 * @returns {any[]} Valeurs
 */
export function getOwnValues(obj) {
  void obj;
  // TODO: Utiliser Object.values
  return undefined;
}

/**
 * Compte les propriétés d'un objet par type
 * @param {Object} obj - Objet à analyser
 * @returns {Object} { string: n, number: n, boolean: n, ... }
 */
export function countByType(obj) {
  void obj;
  // TODO: Compter les propriétés par typeof de leur valeur
  return undefined;
}

/**
 * Filtre les propriétés d'un type donné
 * @param {Object} obj - Objet source
 * @param {string} type - Type à garder ('string', 'number', etc.)
 * @returns {Object} Objet filtré
 */
export function filterByType(obj, type) {
  void obj;
  void type;
  // TODO: Garder seulement les propriétés du type donné
  return undefined;
}

/**
 * Vérifie si une propriété est énumérable
 * @param {Object} obj - Objet
 * @param {string} key - Clé à vérifier
 * @returns {boolean} True si énumérable
 */
export function isEnumerable(obj, key) {
  void obj;
  void key;
  // TODO: Utiliser propertyIsEnumerable
  return undefined;
}

/**
 * Crée un objet avec une propriété non-énumérable
 * @param {Object} obj - Objet de base
 * @param {string} key - Clé de la propriété cachée
 * @param {any} value - Valeur
 * @returns {Object} Objet avec propriété non-énumérable
 */
export function addHiddenProperty(obj, key, value) {
  void obj;
  void key;
  void value;
  // TODO: Utiliser Object.defineProperty avec enumerable: false
  return undefined;
}

/**
 * Récupère le descripteur complet d'une propriété
 * @param {Object} obj - Objet
 * @param {string} key - Clé
 * @returns {Object} Descripteur { value, writable, enumerable, configurable }
 */
export function getPropertyDescriptor(obj, key) {
  void obj;
  void key;
  // TODO: Utiliser Object.getOwnPropertyDescriptor
  return undefined;
}

/**
 * Compare la structure de deux objets (mêmes clés)
 * @param {Object} a - Premier objet
 * @param {Object} b - Deuxième objet
 * @returns {boolean} True si mêmes clés
 */
export function hasSameStructure(a, b) {
  void a;
  void b;
  // TODO: Comparer les clés des deux objets
  return undefined;
}
