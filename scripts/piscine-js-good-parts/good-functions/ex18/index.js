/**
 * Ex18 - Curry & Compose
 * Composition fonctionnelle
 */

/**
 * Currifie une fonction à 2 arguments
 * @param {Function} fn - Fonction (a, b) => result
 * @returns {Function} a => b => result
 */
export function curry2(fn) {
  void fn;
  // TODO: Retourner a => b => fn(a, b)
  return undefined;
}

/**
 * Currifie une fonction à 3 arguments
 * @param {Function} fn - Fonction (a, b, c) => result
 * @returns {Function} a => b => c => result
 */
export function curry3(fn) {
  void fn;
  // TODO: Retourner a => b => c => fn(a, b, c)
  return undefined;
}

/**
 * Currifie automatiquement une fonction
 * @param {Function} fn - Fonction à currifier
 * @returns {Function} Fonction curriée
 */
export function curry(fn) {
  void fn;
  // TODO: Currifier selon fn.length
  return undefined;
}

/**
 * Compose deux fonctions (droite à gauche)
 * @param {Function} f - Fonction externe
 * @param {Function} g - Fonction interne
 * @returns {Function} x => f(g(x))
 */
export function compose2(f, g) {
  void f;
  void g;
  // TODO: Retourner x => f(g(x))
  return undefined;
}

/**
 * Compose plusieurs fonctions (droite à gauche)
 * @param {...Function} fns - Fonctions à composer
 * @returns {Function} Fonction composée
 */
export function compose(...fns) {
  void fns;
  // TODO: Composer toutes les fonctions
  return undefined;
}

/**
 * Pipe plusieurs fonctions (gauche à droite)
 * @param {...Function} fns - Fonctions à chaîner
 * @returns {Function} Fonction pipée
 */
export function pipe(...fns) {
  void fns;
  // TODO: Comme compose mais dans l'autre sens
  return undefined;
}

/**
 * Application partielle (fige les premiers arguments)
 * @param {Function} fn - Fonction originale
 * @param {...any} presetArgs - Arguments à figer
 * @returns {Function} Fonction partielle
 */
export function partial(fn, ...presetArgs) {
  void fn;
  void presetArgs;
  // TODO: Retourner (...args) => fn(...presetArgs, ...args)
  return undefined;
}

/**
 * Application partielle à droite (fige les derniers arguments)
 * @param {Function} fn - Fonction originale
 * @param {...any} presetArgs - Arguments à figer (à droite)
 * @returns {Function} Fonction partielle
 */
export function partialRight(fn, ...presetArgs) {
  void fn;
  void presetArgs;
  // TODO: Retourner (...args) => fn(...args, ...presetArgs)
  return undefined;
}

/**
 * Flip: inverse les deux premiers arguments
 * @param {Function} fn - Fonction originale
 * @returns {Function} Fonction avec arguments inversés
 */
export function flip(fn) {
  void fn;
  // TODO: Retourner (a, b, ...rest) => fn(b, a, ...rest)
  return undefined;
}
