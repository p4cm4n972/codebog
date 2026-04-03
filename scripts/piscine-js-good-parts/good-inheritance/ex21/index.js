/**
 * Ex21 - Object Composition
 * Mixins et composition d'objets
 */

/**
 * Mixin: capacité de nager
 * @param {Object} state - { name }
 * @returns {Object} { swim }
 */
export function withSwimming(state) {
  void state;
  // TODO: Retourner { swim() { return `${state.name} swims` } }
  return undefined;
}

/**
 * Mixin: capacité de voler
 * @param {Object} state - { name }
 * @returns {Object} { fly }
 */
export function withFlying(state) {
  void state;
  // TODO: Retourner { fly() { return `${state.name} flies` } }
  return undefined;
}

/**
 * Mixin: capacité de marcher
 * @param {Object} state - { name }
 * @returns {Object} { walk }
 */
export function withWalking(state) {
  void state;
  // TODO: Retourner { walk() { return `${state.name} walks` } }
  return undefined;
}

/**
 * Crée un canard (swim + fly + walk)
 * @param {string} name - Nom du canard
 * @returns {Object} Canard avec toutes les capacités
 */
export function createDuck(name) {
  void name;
  // TODO: Composer avec les mixins
  return undefined;
}

/**
 * Crée un pingouin (swim + walk, pas fly)
 * @param {string} name - Nom
 * @returns {Object} Pingouin
 */
export function createPenguin(name) {
  void name;
  // TODO: Composer seulement swim et walk
  return undefined;
}

/**
 * Compose plusieurs mixins
 * @param {Object} state - État partagé
 * @param {...Function} mixins - Fonctions mixin
 * @returns {Object} Objet composé
 */
export function compose(state, ...mixins) {
  void state;
  void mixins;
  // TODO: Appliquer chaque mixin et fusionner
  return undefined;
}

/**
 * Crée un mixin dynamiquement
 * @param {string} action - Nom de l'action
 * @param {string} verb - Verbe conjugué
 * @returns {Function} Fonction mixin
 */
export function createMixin(action, verb) {
  void action;
  void verb;
  // TODO: Retourner state => ({ [action]() { return `${state.name} ${verb}` } })
  return undefined;
}

/**
 * Compose des objets avec résolution de conflits
 * @param {Function} resolver - (key, val1, val2) => resolved
 * @param {...Object} objects - Objets à composer
 * @returns {Object} Objet composé
 */
export function composeWithResolver(resolver, ...objects) {
  void resolver;
  void objects;
  // TODO: Fusionner avec résolution de conflits
  return undefined;
}
