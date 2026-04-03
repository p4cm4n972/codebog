/**
 * Ex28 - Advanced Patterns
 * Patterns avancés avec les tableaux
 */

/**
 * Combine deux tableaux élément par élément
 * @param {any[]} a - Premier tableau
 * @param {any[]} b - Deuxième tableau
 * @returns {[any, any][]} Tableau de paires
 */
export function zip(a, b) {
  void a;
  void b;
  // TODO: Retourner [[a[0], b[0]], [a[1], b[1]], ...]
  return undefined;
}

/**
 * Inverse de zip - sépare les paires
 * @param {[any, any][]} pairs - Tableau de paires
 * @returns {[any[], any[]]} Deux tableaux séparés
 */
export function unzip(pairs) {
  void pairs;
  // TODO: Retourner [premiers, seconds]
  return undefined;
}

/**
 * Divise un tableau en morceaux
 * @param {any[]} arr - Tableau
 * @param {number} size - Taille des morceaux
 * @returns {any[][]} Tableau de morceaux
 */
export function chunk(arr, size) {
  void arr;
  void size;
  // TODO: Diviser en sous-tableaux
  return undefined;
}

/**
 * Partitionne un tableau selon un prédicat
 * @param {any[]} arr - Tableau
 * @param {Function} predicate - Fonction de test
 * @returns {[any[], any[]]} [matching, nonMatching]
 */
export function partition(arr, predicate) {
  void arr;
  void predicate;
  // TODO: Séparer en deux groupes
  return undefined;
}

/**
 * Calcule les statistiques d'un tableau de nombres
 * @param {number[]} numbers - Tableau de nombres
 * @returns {Object} { min, max, sum, avg, count }
 */
export function stats(numbers) {
  void numbers;
  // TODO: Calculer toutes les stats en un seul reduce
  return undefined;
}

/**
 * Crée un index à partir d'un tableau d'objets
 * @param {Object[]} items - Tableau d'objets
 * @param {string} key - Propriété clé
 * @returns {Object} { [keyValue]: item }
 */
export function indexBy(items, key) {
  void items;
  void key;
  // TODO: Créer un objet indexé
  return undefined;
}

/**
 * Trie avec plusieurs critères
 * @param {Object[]} items - Tableau d'objets
 * @param {Array<[string, 'asc'|'desc']>} criteria - Critères de tri
 * @returns {Object[]} Tableau trié
 */
export function multiSort(items, criteria) {
  void items;
  void criteria;
  // TODO: Trier par plusieurs propriétés
  return undefined;
}

/**
 * Fenêtre glissante sur un tableau
 * @param {any[]} arr - Tableau
 * @param {number} size - Taille de la fenêtre
 * @returns {any[][]} Fenêtres
 */
export function slidingWindow(arr, size) {
  void arr;
  void size;
  // TODO: Retourner les fenêtres
  // [1,2,3,4] size=2 => [[1,2], [2,3], [3,4]]
  return undefined;
}
