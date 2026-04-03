/**
 * Ex05 - Object Literals
 * Création et accès aux objets
 */

/**
 * Crée un objet livre
 * @param {string} title - Titre
 * @param {string} author - Auteur
 * @param {number} year - Année
 * @returns {Object} Livre
 */
export function createBook(title, author, year) {
  void title;
  void author;
  void year;
  // TODO: Retourner un objet { title, author, year }
  return undefined;
}

/**
 * Récupère une propriété avec valeur par défaut
 * @param {Object} obj - Objet source
 * @param {string} key - Clé à récupérer
 * @param {any} defaultValue - Valeur par défaut
 * @returns {any} Valeur ou défaut
 */
export function getWithDefault(obj, key, defaultValue) {
  void obj;
  void key;
  void defaultValue;
  // TODO: Retourner obj[key] ou defaultValue si undefined/null
  return undefined;
}

/**
 * Récupère une propriété imbriquée de façon sécurisée
 * @param {Object} obj - Objet source
 * @param {string} path - Chemin séparé par des points (ex: 'user.address.city')
 * @returns {any} Valeur ou undefined
 */
export function getNestedProperty(obj, path) {
  void obj;
  void path;
  // TODO: Naviguer dans l'objet avec optional chaining ou boucle
  return undefined;
}

/**
 * Vérifie si une propriété existe (propre, pas héritée)
 * @param {Object} obj - Objet à vérifier
 * @param {string} key - Clé à chercher
 * @returns {boolean} True si la propriété existe
 */
export function hasOwnProperty(obj, key) {
  void obj;
  void key;
  // TODO: Utiliser Object.hasOwn() ou hasOwnProperty
  return undefined;
}

/**
 * Crée un objet à partir de paires clé-valeur
 * @param {Array<[string, any]>} pairs - Tableau de paires [clé, valeur]
 * @returns {Object} Objet créé
 */
export function fromPairs(pairs) {
  void pairs;
  // TODO: Construire un objet à partir des paires
  return undefined;
}

/**
 * Convertit un objet en paires clé-valeur
 * @param {Object} obj - Objet source
 * @returns {Array<[string, any]>} Tableau de paires
 */
export function toPairs(obj) {
  void obj;
  // TODO: Utiliser Object.entries()
  return undefined;
}
