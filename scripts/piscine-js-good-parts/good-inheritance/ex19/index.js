/**
 * Ex19 - Prototypal Inheritance
 * Héritage avec Object.create
 */

/**
 * Crée un objet animal de base
 * @returns {Object} Animal avec speak()
 */
export function createAnimalProto() {
  // TODO: Retourner { speak() { return `${this.name} makes a sound` } }
  return undefined;
}

/**
 * Crée un chien qui hérite d'animal
 * @param {string} name - Nom du chien
 * @returns {Object} Chien avec bark() et speak() hérité
 */
export function createDog(name) {
  void name;
  // TODO: Créer avec Object.create(animalProto)
  // Ajouter name et bark() qui retourne `${this.name} barks`
  return undefined;
}

/**
 * Crée une hiérarchie à 3 niveaux
 * @returns {Object} { grandparent, parent, child }
 */
export function createHierarchy() {
  // TODO: Créer grandparent avec methodA
  // parent hérite et ajoute methodB
  // child hérite et ajoute methodC
  return undefined;
}

/**
 * Vérifie si une propriété est propre (pas héritée)
 * @param {Object} obj - Objet
 * @param {string} prop - Propriété
 * @returns {boolean} True si propre
 */
export function isOwnProperty(obj, prop) {
  void obj;
  void prop;
  // TODO: Utiliser hasOwnProperty ou Object.hasOwn
  return undefined;
}

/**
 * Récupère toutes les propriétés propres
 * @param {Object} obj - Objet
 * @returns {string[]} Noms des propriétés propres
 */
export function getOwnProperties(obj) {
  void obj;
  // TODO: Utiliser Object.keys ou Object.getOwnPropertyNames
  return undefined;
}

/**
 * Récupère toutes les propriétés (propres + héritées)
 * @param {Object} obj - Objet
 * @returns {string[]} Toutes les propriétés
 */
export function getAllProperties(obj) {
  void obj;
  // TODO: Parcourir la chaîne de prototypes
  return undefined;
}

/**
 * Override une méthode avec appel au parent
 * @param {Object} parent - Objet parent
 * @param {string} methodName - Nom de la méthode
 * @param {Function} newMethod - Nouvelle implémentation (reçoit parentMethod)
 * @returns {Object} Enfant avec méthode overridée
 */
export function overrideMethod(parent, methodName, newMethod) {
  void parent;
  void methodName;
  void newMethod;
  // TODO: Créer enfant et override la méthode
  return undefined;
}
