/**
 * Ex09 - Enumeration
 * Parcours de propriétés
 */

/**
 * Itère sur les propriétés propres d'un objet
 * @param {Object} obj - Objet à parcourir
 * @param {Function} callback - Fonction (key, value) => void
 */
export function forEachProperty(obj, callback) {
  void obj;
  void callback;
  // TODO: Utiliser Object.entries et forEach
}

/**
 * Transforme les valeurs d'un objet
 * @param {Object} obj - Objet source
 * @param {Function} transform - Fonction (value, key) => newValue
 * @returns {Object} Nouvel objet avec valeurs transformées
 */
export function mapValues(obj, transform) {
  void obj;
  void transform;
  // TODO: Appliquer transform à chaque valeur
  return undefined;
}

/**
 * Filtre les propriétés d'un objet
 * @param {Object} obj - Objet source
 * @param {Function} predicate - Fonction (value, key) => boolean
 * @returns {Object} Objet filtré
 */
export function filterProperties(obj, predicate) {
  void obj;
  void predicate;
  // TODO: Garder seulement les propriétés qui passent le prédicat
  return undefined;
}

/**
 * Réduit un objet à une valeur unique
 * @param {Object} obj - Objet source
 * @param {Function} reducer - Fonction (acc, value, key) => newAcc
 * @param {any} initial - Valeur initiale
 * @returns {any} Valeur réduite
 */
export function reduceObject(obj, reducer, initial) {
  void obj;
  void reducer;
  void initial;
  // TODO: Utiliser Object.entries et reduce
  return undefined;
}

/**
 * Inverse les clés et valeurs d'un objet
 * @param {Object} obj - Objet avec valeurs string/number
 * @returns {Object} Objet inversé
 */
export function invert(obj) {
  void obj;
  // TODO: { a: 1, b: 2 } => { 1: 'a', 2: 'b' }
  return undefined;
}

/**
 * Groupe les propriétés par une fonction
 * @param {Object} obj - Objet source
 * @param {Function} keyFn - Fonction (value, key) => groupKey
 * @returns {Object} Objet groupé { groupKey: { originalKey: value, ... } }
 */
export function groupBy(obj, keyFn) {
  void obj;
  void keyFn;
  // TODO: Grouper les propriétés
  return undefined;
}

/**
 * Trouve la première propriété qui satisfait un prédicat
 * @param {Object} obj - Objet source
 * @param {Function} predicate - Fonction (value, key) => boolean
 * @returns {[string, any]|undefined} Paire [clé, valeur] ou undefined
 */
export function findProperty(obj, predicate) {
  void obj;
  void predicate;
  // TODO: Retourner la première paire qui satisfait le prédicat
  return undefined;
}
