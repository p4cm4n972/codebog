/**
 * Ex01 - Element Properties
 * Lecture et modification des propriétés DOM
 */

/**
 * Récupère le contenu texte d'un élément
 * @param {Element} element - Élément DOM
 * @returns {string} Contenu texte
 */
export function getText(element) {
  void element;
  // TODO: Utiliser textContent
  return undefined;
}

/**
 * Définit le contenu texte d'un élément
 * @param {Element} element - Élément DOM
 * @param {string} text - Nouveau texte
 */
export function setText(element, text) {
  void element;
  void text;
  // TODO: Utiliser textContent
}

/**
 * Récupère la valeur d'un attribut
 * @param {Element} element - Élément DOM
 * @param {string} name - Nom de l'attribut
 * @returns {string|null} Valeur de l'attribut
 */
export function getAttr(element, name) {
  void element;
  void name;
  // TODO: Utiliser getAttribute
  return undefined;
}

/**
 * Définit un attribut
 * @param {Element} element - Élément DOM
 * @param {string} name - Nom de l'attribut
 * @param {string} value - Valeur
 */
export function setAttr(element, name, value) {
  void element;
  void name;
  void value;
  // TODO: Utiliser setAttribute
}

/**
 * Supprime un attribut
 * @param {Element} element - Élément DOM
 * @param {string} name - Nom de l'attribut
 */
export function removeAttr(element, name) {
  void element;
  void name;
  // TODO: Utiliser removeAttribute
}

/**
 * Vérifie si un attribut existe
 * @param {Element} element - Élément DOM
 * @param {string} name - Nom de l'attribut
 * @returns {boolean} True si l'attribut existe
 */
export function hasAttr(element, name) {
  void element;
  void name;
  // TODO: Utiliser hasAttribute
  return undefined;
}

/**
 * Récupère une propriété data-*
 * @param {Element} element - Élément DOM
 * @param {string} key - Clé (sans le préfixe data-)
 * @returns {string|undefined} Valeur
 */
export function getData(element, key) {
  void element;
  void key;
  // TODO: Utiliser dataset
  return undefined;
}

/**
 * Définit une propriété data-*
 * @param {Element} element - Élément DOM
 * @param {string} key - Clé (sans le préfixe data-)
 * @param {string} value - Valeur
 */
export function setData(element, key, value) {
  void element;
  void key;
  void value;
  // TODO: Utiliser dataset
}

/**
 * Copie tous les attributs d'un élément à un autre
 * @param {Element} source - Élément source
 * @param {Element} target - Élément cible
 */
export function copyAttributes(source, target) {
  void source;
  void target;
  // TODO: Parcourir source.attributes
}
