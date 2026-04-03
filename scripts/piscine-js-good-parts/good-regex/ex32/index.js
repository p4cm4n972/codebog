/**
 * Ex32 - Practical Patterns
 * Patterns regex courants
 */

/**
 * Valide un email (format basique)
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
export function isValidEmail(email) {
  void email;
  // TODO: Pattern email basique
  return undefined;
}

/**
 * Valide un numéro de téléphone français
 * @param {string} phone - Numéro (0612345678 ou +33612345678)
 * @returns {boolean} True si valide
 */
export function isValidFrenchPhone(phone) {
  void phone;
  // TODO: Accepter 0X ou +33X suivi de 9 chiffres
  return undefined;
}

/**
 * Valide un mot de passe fort
 * Au moins 8 caractères, une majuscule, une minuscule, un chiffre
 * @param {string} password - Mot de passe
 * @returns {boolean} True si fort
 */
export function isStrongPassword(password) {
  void password;
  // TODO: Lookaheads pour vérifier les critères
  return undefined;
}

/**
 * Valide un code postal français (5 chiffres)
 * @param {string} code - Code postal
 * @returns {boolean} True si valide
 */
export function isValidPostalCode(code) {
  void code;
  // TODO: 5 chiffres, commence par 0-9
  return undefined;
}

/**
 * Extrait toutes les adresses email d'un texte
 * @param {string} text - Texte contenant des emails
 * @returns {string[]} Emails trouvés
 */
export function extractEmails(text) {
  void text;
  // TODO: Trouver tous les emails
  return undefined;
}

/**
 * Formate un numéro de téléphone
 * "0612345678" -> "06 12 34 56 78"
 * @param {string} phone - Numéro non formaté
 * @returns {string} Numéro formaté
 */
export function formatPhone(phone) {
  void phone;
  // TODO: Insérer des espaces tous les 2 chiffres
  return undefined;
}

/**
 * Valide un nom d'utilisateur
 * 3-16 caractères, lettres, chiffres, underscores
 * @param {string} username - Nom d'utilisateur
 * @returns {boolean} True si valide
 */
export function isValidUsername(username) {
  void username;
  // TODO: Pattern ^[a-zA-Z0-9_]{3,16}$
  return undefined;
}

/**
 * Nettoie et valide un slug
 * Minuscules, chiffres et tirets seulement
 * @param {string} text - Texte à convertir
 * @returns {string} Slug valide
 */
export function toSlug(text) {
  void text;
  // TODO: Lowercase, remplacer espaces par tirets, retirer caractères invalides
  return undefined;
}
