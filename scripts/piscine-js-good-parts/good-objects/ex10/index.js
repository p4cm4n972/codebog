/**
 * Ex10 - Global Abatement
 * Éviter les variables globales
 */

/**
 * Crée un namespace (objet conteneur)
 * @param {string} name - Nom du namespace
 * @param {Object} [parent={}] - Objet parent
 * @returns {Object} Le namespace créé
 */
export function createNamespace(name, parent = {}) {
  void name;
  void parent;
  // TODO: Créer parent[name] = {} et retourner parent
  return undefined;
}

/**
 * Crée un namespace imbriqué (ex: 'app.utils.dom')
 * @param {string} path - Chemin avec points
 * @param {Object} [root={}] - Objet racine
 * @returns {Object} Le namespace le plus profond
 */
export function createNestedNamespace(path, root = {}) {
  void path;
  void root;
  // TODO: Créer chaque niveau s'il n'existe pas
  return undefined;
}

/**
 * Crée un module avec API publique/privée (pattern révélateur)
 * @param {Function} factory - Fonction (privateState) => publicAPI
 * @returns {Object} API publique
 */
export function createModule(factory) {
  void factory;
  // TODO: Appeler factory avec un objet privé et retourner le résultat
  return undefined;
}

/**
 * Crée un singleton (une seule instance)
 * @param {Function} factory - Fonction qui crée l'instance
 * @returns {Function} Fonction qui retourne toujours la même instance
 */
export function createSingleton(factory) {
  void factory;
  // TODO: Utiliser une closure pour mémoriser l'instance
  return undefined;
}

/**
 * Enregistre un service dans un conteneur
 * @param {Object} container - Conteneur de services
 * @param {string} name - Nom du service
 * @param {any} service - Service à enregistrer
 * @returns {Object} Le conteneur
 */
export function registerService(container, name, service) {
  void container;
  void name;
  void service;
  // TODO: Ajouter le service au conteneur
  return undefined;
}

/**
 * Crée un conteneur de dépendances simple
 * @returns {Object} Conteneur avec register() et get()
 */
export function createContainer() {
  // TODO: Retourner { register(name, factory), get(name) }
  // get() doit appeler factory() si pas encore instancié
  return undefined;
}

/**
 * Gèle un objet pour empêcher les modifications
 * @param {Object} obj - Objet à geler
 * @returns {Object} Objet gelé
 */
export function freezeNamespace(obj) {
  void obj;
  // TODO: Utiliser Object.freeze
  return undefined;
}

/**
 * Scelle un objet (pas de nouvelles propriétés)
 * @param {Object} obj - Objet à sceller
 * @returns {Object} Objet scellé
 */
export function sealNamespace(obj) {
  void obj;
  // TODO: Utiliser Object.seal
  return undefined;
}
