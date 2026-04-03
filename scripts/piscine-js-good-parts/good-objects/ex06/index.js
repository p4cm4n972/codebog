/**
 * Ex06 - Object Update
 * Modification et passage par référence
 */

/**
 * Met à jour une propriété d'un objet (mutation)
 * @param {Object} obj - Objet à modifier
 * @param {string} key - Clé
 * @param {any} value - Nouvelle valeur
 * @returns {Object} Le même objet modifié
 */
export function updateProperty(obj, key, value) {
  void obj;
  void key;
  void value;
  // TODO: Modifier obj[key] et retourner obj
  return undefined;
}

/**
 * Met à jour sans muter l'original
 * @param {Object} obj - Objet source
 * @param {string} key - Clé
 * @param {any} value - Nouvelle valeur
 * @returns {Object} Nouvel objet avec la modification
 */
export function updateImmutable(obj, key, value) {
  void obj;
  void key;
  void value;
  // TODO: Retourner { ...obj, [key]: value }
  return undefined;
}

/**
 * Fusionne plusieurs objets sans muter
 * @param {Object} target - Objet cible
 * @param {...Object} sources - Objets sources
 * @returns {Object} Nouvel objet fusionné
 */
export function mergeObjects(target, ...sources) {
  void target;
  void sources;
  // TODO: Utiliser spread pour fusionner
  return undefined;
}

/**
 * Vérifie si deux objets sont la même référence
 * @param {Object} a - Premier objet
 * @param {Object} b - Deuxième objet
 * @returns {boolean} True si même référence
 */
export function isSameReference(a, b) {
  void a;
  void b;
  // TODO: Comparer avec ===
  return undefined;
}

/**
 * Clone superficiellement un objet
 * @param {Object} obj - Objet à cloner
 * @returns {Object} Clone superficiel
 */
export function shallowClone(obj) {
  void obj;
  // TODO: Utiliser spread ou Object.assign
  return undefined;
}

/**
 * Clone profondément un objet
 * @param {Object} obj - Objet à cloner
 * @returns {Object} Clone profond
 */
export function deepClone(obj) {
  void obj;
  // TODO: Utiliser structuredClone ou JSON.parse/stringify
  return undefined;
}

/**
 * Applique plusieurs mises à jour à un objet (immuable)
 * @param {Object} obj - Objet source
 * @param {Object} updates - Mises à jour à appliquer
 * @returns {Object} Nouvel objet avec les mises à jour
 */
export function applyUpdates(obj, updates) {
  void obj;
  void updates;
  // TODO: Fusionner obj et updates sans muter
  return undefined;
}
