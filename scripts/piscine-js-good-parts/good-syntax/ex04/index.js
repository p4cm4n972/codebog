/**
 * Ex04 - Object & Array Literals
 * Création idiomatique de structures de données
 */

/**
 * Crée un objet personne avec littéral
 * @param {string} name - Nom
 * @param {number} age - Âge
 * @param {string} city - Ville
 * @returns {Object} Personne
 */
export function createPerson(name, age, city) {
  void name;
  void age;
  void city;
  // TODO: Retourner { name, age, city } avec shorthand
  return undefined;
}

/**
 * Crée un objet avec propriété calculée
 * @param {string} key - Nom de la propriété
 * @param {any} value - Valeur
 * @returns {Object} Objet avec propriété dynamique
 */
export function createDynamic(key, value) {
  void key;
  void value;
  // TODO: Retourner { [key]: value }
  return undefined;
}

/**
 * Fusionne plusieurs objets
 * @param {...Object} objects - Objets à fusionner
 * @returns {Object} Objet fusionné
 */
export function merge(...objects) {
  void objects;
  // TODO: Utiliser spread { ...obj1, ...obj2 }
  return undefined;
}

/**
 * Clone superficiellement un objet
 * @param {Object} obj - Objet à cloner
 * @returns {Object} Clone
 */
export function shallowClone(obj) {
  void obj;
  // TODO: Retourner { ...obj }
  return undefined;
}

/**
 * Crée un tableau de nombres
 * @param {number} start - Début
 * @param {number} end - Fin (inclus)
 * @returns {number[]} Tableau
 */
export function range(start, end) {
  void start;
  void end;
  // TODO: Créer avec Array.from ou spread
  return undefined;
}

/**
 * Concatène plusieurs tableaux
 * @param {...Array} arrays - Tableaux à concaténer
 * @returns {Array} Tableau concaténé
 */
export function concat(...arrays) {
  void arrays;
  // TODO: Utiliser spread [...arr1, ...arr2]
  return undefined;
}

/**
 * Extrait une partie d'un objet
 * @param {Object} obj - Objet source
 * @param {string[]} keys - Clés à extraire
 * @returns {Object} Objet partiel
 */
export function pick(obj, keys) {
  void obj;
  void keys;
  // TODO: Créer un nouvel objet avec seulement les clés spécifiées
  return undefined;
}

/**
 * Omet certaines propriétés d'un objet
 * @param {Object} obj - Objet source
 * @param {string[]} keys - Clés à omettre
 * @returns {Object} Objet sans les clés omises
 */
export function omit(obj, keys) {
  void obj;
  void keys;
  // TODO: Créer un nouvel objet sans les clés spécifiées
  return undefined;
}
