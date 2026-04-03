/**
 * Ex07 - Prototype
 * Chaîne de prototypes et délégation
 */

/**
 * Crée un objet avec un prototype donné
 * @param {Object} proto - Prototype
 * @param {Object} props - Propriétés à ajouter
 * @returns {Object} Nouvel objet
 */
export function createWithProto(proto, props) {
  void proto;
  void props;
  // TODO: Utiliser Object.create et ajouter les props
  return undefined;
}

/**
 * Récupère le prototype d'un objet
 * @param {Object} obj - Objet
 * @returns {Object|null} Prototype
 */
export function getProto(obj) {
  void obj;
  // TODO: Utiliser Object.getPrototypeOf
  return undefined;
}

/**
 * Vérifie si un objet est prototype d'un autre
 * @param {Object} proto - Prototype potentiel
 * @param {Object} obj - Objet à vérifier
 * @returns {boolean} True si proto est dans la chaîne
 */
export function isInPrototypeChain(proto, obj) {
  void proto;
  void obj;
  // TODO: Utiliser isPrototypeOf
  return undefined;
}

/**
 * Crée une hiérarchie simple : animal -> dog
 * @param {string} name - Nom du chien
 * @returns {Object} Objet dog avec méthodes héritées
 */
export function createDog(name) {
  void name;
  // TODO: Créer un animal avec speak(), puis un dog qui en hérite
  // animal.speak() retourne `${this.name} makes a sound`
  // dog.bark() retourne `${this.name} barks`
  return undefined;
}

/**
 * Compte le nombre de niveaux dans la chaîne de prototypes
 * @param {Object} obj - Objet de départ
 * @returns {number} Nombre de niveaux (0 si pas de prototype)
 */
export function countPrototypeLevels(obj) {
  void obj;
  // TODO: Parcourir la chaîne jusqu'à null
  return undefined;
}

/**
 * Récupère toutes les méthodes héritées (pas les propres)
 * @param {Object} obj - Objet
 * @returns {string[]} Noms des méthodes héritées
 */
export function getInheritedMethods(obj) {
  void obj;
  // TODO: Parcourir la chaîne de prototypes
  return undefined;
}
