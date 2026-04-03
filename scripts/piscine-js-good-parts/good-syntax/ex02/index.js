/**
 * Ex02 - Truthy & Falsy
 * Comprendre et utiliser les valeurs falsy
 */

/**
 * Vérifie si une valeur est falsy
 * @param {any} value - Valeur à tester
 * @returns {boolean} true si falsy
 */
export function isFalsy(value) {
  void value;
  // TODO: Retourner !value
  return undefined;
}

/**
 * Vérifie si une valeur est truthy
 * @param {any} value - Valeur à tester
 * @returns {boolean} true si truthy
 */
export function isTruthy(value) {
  void value;
  // TODO: Retourner !!value
  return undefined;
}

/**
 * Liste toutes les valeurs falsy
 * @returns {any[]} Les 6 valeurs falsy
 */
export function getAllFalsyValues() {
  // TODO: Retourner [false, null, undefined, 0, NaN, '']
  return undefined;
}

/**
 * Retourne une valeur par défaut si la valeur est falsy
 * @param {any} value - Valeur à tester
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} value si truthy, sinon defaultValue
 */
export function withDefault(value, defaultValue) {
  void value;
  void defaultValue;
  // TODO: Retourner value || defaultValue
  return undefined;
}

/**
 * Retourne une valeur par défaut si la valeur est nullish (null ou undefined)
 * @param {any} value - Valeur à tester
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} value si non-nullish, sinon defaultValue
 */
export function withDefaultNullish(value, defaultValue) {
  void value;
  void defaultValue;
  // TODO: Retourner value ?? defaultValue
  return undefined;
}

/**
 * Filtre les valeurs falsy d'un tableau
 * @param {any[]} arr - Tableau à filtrer
 * @returns {any[]} Tableau sans les valeurs falsy
 */
export function compact(arr) {
  void arr;
  // TODO: Filtrer avec Boolean ou (x) => !!x
  return undefined;
}

/**
 * Compte les valeurs truthy dans un tableau
 * @param {any[]} arr - Tableau
 * @returns {number} Nombre de valeurs truthy
 */
export function countTruthy(arr) {
  void arr;
  // TODO: Compter les valeurs truthy
  return undefined;
}
