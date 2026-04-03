/**
 * Ex36 - Refactoring
 * Amélioration du code existant
 */

// ============ CODE À REFACTORER ============

/**
 * Refactorer: Extraire la validation dans une fonction séparée
 * @param {Object} order - { items, customer, paymentMethod }
 * @returns {Object} Résultat de la commande
 */
export function processOrderV1(order) {
  // Cette fonction fait trop de choses - à refactorer en plusieurs
  void order;
  // TODO: Séparer en validateOrder, calculateTotal, formatResult
  return undefined;
}

/**
 * Refactorer: Remplacer les magic numbers par des constantes
 * @param {Object} user - Utilisateur
 * @returns {Object} Statut de l'utilisateur
 */
export function getUserStatusV1(user) {
  void user;
  // TODO: Extraire 18, 65, 100 en constantes nommées
  return undefined;
}

/**
 * Refactorer: Simplifier les conditions
 * @param {Object} user - Utilisateur avec role et permissions
 * @param {string} action - Action demandée
 * @returns {boolean} Autorisation
 */
export function canPerformActionV1(user, action) {
  void user;
  void action;
  // TODO: Extraire les vérifications dans des fonctions helper
  return undefined;
}

// ============ EXERCICES DE REFACTORING ============

/**
 * Crée un validateur de commande
 * @returns {Object} { validate, getErrors }
 */
export function createOrderValidator() {
  // TODO: Implémenter un validateur réutilisable
  return undefined;
}

/**
 * Constantes pour les seuils d'âge
 */
export const AGE_CONSTANTS = {
  // TODO: Définir LEGAL_AGE, SENIOR_AGE, MAX_AGE
};

/**
 * Fonctions helper pour les permissions
 */
export const PermissionHelpers = {
  // TODO: isAdmin(user), hasPermission(user, perm), canManage(user)
};

/**
 * Calcule les totaux d'une commande de façon modulaire
 * @param {Object[]} items - Articles { price, quantity, discount? }
 * @param {Object} options - { taxRate, shippingCost }
 * @returns {Object} { subtotal, tax, shipping, total }
 */
export function calculateOrderTotals(items, options = {}) {
  void items;
  void options;
  // TODO: Implémenter avec fonctions pures séparées
  return undefined;
}

/**
 * Pipeline de transformation de données
 * @param {any} data - Données initiales
 * @param {...Function} transforms - Fonctions de transformation
 * @returns {any} Données transformées
 */
export function pipeline(data, ...transforms) {
  void data;
  void transforms;
  // TODO: Appliquer chaque transformation en séquence
  return undefined;
}
