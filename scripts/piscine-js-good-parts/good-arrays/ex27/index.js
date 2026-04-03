/**
 * Ex27 - Array Mutation
 * Méthodes mutantes vs immutables
 */

/**
 * Ajoute un élément à la fin (immutable)
 * @param {any[]} arr - Tableau
 * @param {any} item - Élément à ajouter
 * @returns {any[]} Nouveau tableau
 */
export function append(arr, item) {
  void arr;
  void item;
  // TODO: Retourner [...arr, item]
  return undefined;
}

/**
 * Ajoute un élément au début (immutable)
 * @param {any[]} arr - Tableau
 * @param {any} item - Élément à ajouter
 * @returns {any[]} Nouveau tableau
 */
export function prepend(arr, item) {
  void arr;
  void item;
  // TODO: Retourner [item, ...arr]
  return undefined;
}

/**
 * Retire le dernier élément (immutable)
 * @param {any[]} arr - Tableau
 * @returns {any[]} Nouveau tableau sans le dernier
 */
export function removeLast(arr) {
  void arr;
  // TODO: Utiliser slice
  return undefined;
}

/**
 * Retire le premier élément (immutable)
 * @param {any[]} arr - Tableau
 * @returns {any[]} Nouveau tableau sans le premier
 */
export function removeFirst(arr) {
  void arr;
  // TODO: Utiliser slice
  return undefined;
}

/**
 * Retire un élément à un index (immutable)
 * @param {any[]} arr - Tableau
 * @param {number} index - Index à retirer
 * @returns {any[]} Nouveau tableau
 */
export function removeAt(arr, index) {
  void arr;
  void index;
  // TODO: Combiner slice ou filter
  return undefined;
}

/**
 * Insère un élément à un index (immutable)
 * @param {any[]} arr - Tableau
 * @param {number} index - Index d'insertion
 * @param {any} item - Élément à insérer
 * @returns {any[]} Nouveau tableau
 */
export function insertAt(arr, index, item) {
  void arr;
  void index;
  void item;
  // TODO: Combiner slice et spread
  return undefined;
}

/**
 * Met à jour un élément à un index (immutable)
 * @param {any[]} arr - Tableau
 * @param {number} index - Index à modifier
 * @param {any} newValue - Nouvelle valeur
 * @returns {any[]} Nouveau tableau
 */
export function updateAt(arr, index, newValue) {
  void arr;
  void index;
  void newValue;
  // TODO: Utiliser map ou spread
  return undefined;
}

/**
 * Déplace un élément d'un index à un autre (immutable)
 * @param {any[]} arr - Tableau
 * @param {number} fromIndex - Index source
 * @param {number} toIndex - Index destination
 * @returns {any[]} Nouveau tableau
 */
export function move(arr, fromIndex, toIndex) {
  void arr;
  void fromIndex;
  void toIndex;
  // TODO: Retirer puis insérer
  return undefined;
}
