/**
 * Ex15 - Form Submission
 * Gérer la soumission des formulaires
 */

/**
 * Gère la soumission d'un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @param {Function} onSubmit - Callback(formData)
 */
export function handleSubmit(form, onSubmit) {
  void form;
  void onSubmit;
  // TODO: addEventListener('submit', ...) + preventDefault
}

/**
 * Convertit FormData en objet JSON
 * @param {FormData} formData - Données du formulaire
 * @returns {Object} Objet JavaScript
 */
export function formDataToJson(formData) {
  void formData;
  // TODO: Object.fromEntries(formData)
  return undefined;
}

/**
 * Convertit FormData en URL-encoded string
 * @param {FormData} formData - Données du formulaire
 * @returns {string} Chaîne URL-encoded
 */
export function formDataToUrlEncoded(formData) {
  void formData;
  // TODO: new URLSearchParams(formData).toString()
  return undefined;
}

/**
 * Ajoute des données supplémentaires à FormData
 * @param {FormData} formData - FormData existant
 * @param {Object} extra - Données à ajouter
 * @returns {FormData} FormData modifié
 */
export function appendToFormData(formData, extra) {
  void formData;
  void extra;
  // TODO: formData.append pour chaque propriété
  return undefined;
}

/**
 * Envoie un formulaire en JSON
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} url - URL de destination
 * @returns {Promise<Response>} Réponse fetch
 */
export function submitAsJson(form, url) {
  void form;
  void url;
  // TODO: fetch avec JSON.stringify
  return undefined;
}

/**
 * Envoie un formulaire avec fichiers
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} url - URL de destination
 * @returns {Promise<Response>} Réponse fetch
 */
export function submitWithFiles(form, url) {
  void form;
  void url;
  // TODO: fetch avec FormData (pour les fichiers)
  return undefined;
}

/**
 * Crée un handler de soumission avec état de chargement
 * @param {HTMLFormElement} form - Formulaire
 * @param {Function} submitFn - Fonction d'envoi async
 * @param {Object} options - { loadingText, successText, errorText }
 */
export function createSubmitHandler(form, submitFn, options = {}) {
  void form;
  void submitFn;
  void options;
  // TODO: Gérer disabled et texte du bouton submit
}

/**
 * Soumet le formulaire programmatiquement
 * @param {HTMLFormElement} form - Formulaire
 * @param {boolean} triggerEvent - Déclencher l'event submit?
 */
export function submitForm(form, triggerEvent = true) {
  void form;
  void triggerEvent;
  // TODO: requestSubmit() ou submit()
}

/**
 * Récupère les fichiers d'un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @returns {File[]} Liste des fichiers
 */
export function getFormFiles(form) {
  void form;
  // TODO: Parcourir les input[type="file"]
  return undefined;
}

/**
 * Valide et soumet un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} url - URL
 * @returns {Promise<Object>} { success, data?, error? }
 */
export async function validateAndSubmit(form, url) {
  void form;
  void url;
  // TODO: checkValidity puis fetch
  return undefined;
}
