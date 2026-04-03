/**
 * Ex01 - Declarations
 * const par défaut, let quand nécessaire, jamais var
 */

/**
 * Démontre le scope de bloc avec let
 * @returns {Object} {insideBlock, outsideBlock}
 */
export function blockScope() {
  // TODO: Déclarer une variable avec let dans un bloc if
  // Retourner sa valeur inside et 'not accessible' outside
  return undefined;
}

/**
 * Compte de 1 à n (let pour la variable de boucle)
 * @param {number} n - Limite
 * @returns {number[]} Tableau [1, 2, ..., n]
 */
export function countTo(n) {
  void n;
  // TODO: Utiliser let pour i dans la boucle for
  return undefined;
}

/**
 * Crée un compteur avec closure (const pour la fonction, let pour le count)
 * @returns {Object} {increment, decrement, getValue}
 */
export function createCounter() {
  // TODO: let count = 0, const pour les méthodes
  return undefined;
}

/**
 * Swap deux éléments dans un tableau (let pour temp)
 * @param {Array} arr - Tableau
 * @param {number} i - Premier index
 * @param {number} j - Deuxième index
 * @returns {Array} Tableau modifié
 */
export function swap(arr, i, j) {
  void arr;
  void i;
  void j;
  // TODO: Utiliser let pour la variable temporaire
  return undefined;
}

/**
 * Accumule les valeurs (let pour l'accumulateur)
 * @param {number[]} numbers - Nombres à accumuler
 * @returns {number} Somme
 */
export function sum(numbers) {
  void numbers;
  // TODO: let total = 0, puis boucle avec const pour chaque élément
  return undefined;
}

/**
 * Configuration immutable (const pour tout)
 * @param {Object} overrides - Options à surcharger
 * @returns {Object} Configuration finale
 */
export function createConfig(overrides = {}) {
  const defaults = {
    theme: 'light',
    language: 'en',
    debug: false
  };

  void defaults;
  void overrides;
  // TODO: Retourner la fusion avec const
  return undefined;
}
