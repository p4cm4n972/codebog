/**
 * Ex16 - Callbacks
 * Fonctions de rappel
 */

/**
 * Exécute une action sur chaque élément (forEach custom)
 * @param {Array} arr - Tableau
 * @param {Function} callback - (element, index, array) => void
 */
export function forEach(arr, callback) {
  void arr;
  void callback;
  // TODO: Appeler callback pour chaque élément
}

/**
 * Transforme un tableau (map custom)
 * @param {Array} arr - Tableau
 * @param {Function} callback - (element, index) => newElement
 * @returns {Array} Nouveau tableau
 */
export function map(arr, callback) {
  void arr;
  void callback;
  // TODO: Retourner un nouveau tableau avec les résultats
  return undefined;
}

/**
 * Filtre un tableau (filter custom)
 * @param {Array} arr - Tableau
 * @param {Function} predicate - (element, index) => boolean
 * @returns {Array} Tableau filtré
 */
export function filter(arr, predicate) {
  void arr;
  void predicate;
  // TODO: Retourner les éléments qui passent le prédicat
  return undefined;
}

/**
 * Cherche un élément (find custom)
 * @param {Array} arr - Tableau
 * @param {Function} predicate - (element, index) => boolean
 * @returns {any} Élément trouvé ou undefined
 */
export function find(arr, predicate) {
  void arr;
  void predicate;
  // TODO: Retourner le premier élément qui satisfait le prédicat
  return undefined;
}

/**
 * Exécute avec gestion d'erreur (try-catch wrapper)
 * @param {Function} fn - Fonction à exécuter
 * @param {Function} errorHandler - (error) => result
 * @returns {any} Résultat ou résultat du handler
 */
export function safeExecute(fn, errorHandler) {
  void fn;
  void errorHandler;
  // TODO: Exécuter fn, appeler errorHandler en cas d'erreur
  return undefined;
}

/**
 * Chaîne des callbacks (pipeline)
 * @param {any} initial - Valeur initiale
 * @param {...Function} callbacks - Fonctions à chaîner
 * @returns {any} Résultat final
 */
export function pipe(initial, ...callbacks) {
  void initial;
  void callbacks;
  // TODO: Passer le résultat de chaque callback au suivant
  return undefined;
}

/**
 * Exécute des callbacks en parallèle (simulé)
 * @param {...Function} callbacks - Fonctions () => result
 * @returns {Array} Tous les résultats
 */
export function parallel(...callbacks) {
  void callbacks;
  // TODO: Exécuter toutes les fonctions et retourner les résultats
  return undefined;
}

/**
 * Crée un callback conditionnel
 * @param {Function} condition - () => boolean
 * @param {Function} ifTrue - Callback si vrai
 * @param {Function} ifFalse - Callback si faux
 * @returns {Function} Callback conditionnel
 */
export function conditional(condition, ifTrue, ifFalse) {
  void condition;
  void ifTrue;
  void ifFalse;
  // TODO: Retourner une fonction qui exécute ifTrue ou ifFalse
  return undefined;
}
