/**
 * Ex31 - Groups & Capturing
 * Groupes capturants et non-capturants
 */

/**
 * Extrait le prénom et nom d'un format "Prénom Nom"
 * @param {string} fullName - Nom complet
 * @returns {Object} { firstName, lastName }
 */
export function parseName(fullName) {
  void fullName;
  // TODO: Utiliser des groupes capturants
  return undefined;
}

/**
 * Inverse le format "Prénom Nom" en "Nom, Prénom"
 * @param {string} name - Nom au format "Prénom Nom"
 * @returns {string} Nom au format "Nom, Prénom"
 */
export function reverseName(name) {
  void name;
  // TODO: Utiliser replace avec références
  return undefined;
}

/**
 * Parse une date au format "DD/MM/YYYY"
 * @param {string} dateStr - Date
 * @returns {Object} { day, month, year } en nombres
 */
export function parseDate(dateStr) {
  void dateStr;
  // TODO: Utiliser des groupes nommés
  return undefined;
}

/**
 * Convertit une date "DD/MM/YYYY" en "YYYY-MM-DD"
 * @param {string} dateStr - Date originale
 * @returns {string} Date au format ISO
 */
export function toISODate(dateStr) {
  void dateStr;
  // TODO: Utiliser replace avec groupes
  return undefined;
}

/**
 * Extrait le protocole et domaine d'une URL
 * @param {string} url - URL complète
 * @returns {Object} { protocol, domain }
 */
export function parseUrl(url) {
  void url;
  // TODO: Utiliser des groupes nommés
  return undefined;
}

/**
 * Trouve tous les hashtags dans un texte
 * @param {string} text - Texte avec hashtags
 * @returns {string[]} Hashtags sans le #
 */
export function extractHashtags(text) {
  void text;
  // TODO: Pattern #(\w+) et extraire le groupe
  return undefined;
}

/**
 * Remplace les tags HTML par leur contenu
 * @param {string} html - HTML avec tags
 * @returns {string} Texte sans tags
 */
export function stripHtmlTags(html) {
  void html;
  // TODO: Remplacer <...> par rien
  return undefined;
}

/**
 * Extrait le contenu entre balises
 * @param {string} html - HTML
 * @param {string} tag - Nom de la balise
 * @returns {string[]} Contenus trouvés
 */
export function extractTagContent(html, tag) {
  void html;
  void tag;
  // TODO: Pattern <tag>(...)</tag>
  return undefined;
}
