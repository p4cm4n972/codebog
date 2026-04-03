/**
 * Ex12 - Form Basics
 * Accéder aux éléments et valeurs des formulaires
 */

/**
 * Récupère un formulaire par son ID
 * @param {string} id - ID du formulaire
 * @returns {HTMLFormElement|null} Formulaire
 */
export function getFormById(id) {
  void id;
  // TODO: document.getElementById
  return undefined;
}

/**
 * Récupère un champ par son nom
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} name - Nom du champ
 * @returns {Element|null} Champ
 */
export function getFieldByName(form, name) {
  void form;
  void name;
  // TODO: form.elements[name]
  return undefined;
}

/**
 * Récupère toutes les valeurs d'un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @returns {Object} Objet { name: value }
 */
export function getFormValues(form) {
  void form;
  // TODO: FormData + Object.fromEntries
  return undefined;
}

/**
 * Récupère la valeur d'une checkbox
 * @param {HTMLInputElement} checkbox - Checkbox
 * @returns {boolean} État coché
 */
export function getCheckboxValue(checkbox) {
  void checkbox;
  // TODO: checkbox.checked
  return undefined;
}

/**
 * Récupère la valeur du radio sélectionné
 * @param {HTMLFormElement} form - Formulaire
 * @param {string} name - Nom du groupe radio
 * @returns {string|null} Valeur sélectionnée
 */
export function getSelectedRadio(form, name) {
  void form;
  void name;
  // TODO: querySelector avec :checked
  return undefined;
}

/**
 * Récupère les valeurs d'un select multiple
 * @param {HTMLSelectElement} select - Select multiple
 * @returns {string[]} Valeurs sélectionnées
 */
export function getMultiSelectValues(select) {
  void select;
  // TODO: selectedOptions
  return undefined;
}

/**
 * Définit les valeurs d'un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @param {Object} values - { name: value }
 */
export function setFormValues(form, values) {
  void form;
  void values;
  // TODO: Parcourir values et assigner aux champs
}

/**
 * Réinitialise un formulaire
 * @param {HTMLFormElement} form - Formulaire
 */
export function resetForm(form) {
  void form;
  // TODO: form.reset()
}

/**
 * Compte les champs d'un formulaire
 * @param {HTMLFormElement} form - Formulaire
 * @returns {number} Nombre de champs
 */
export function countFormFields(form) {
  void form;
  // TODO: form.elements.length
  return undefined;
}

/**
 * Convertit FormData en objet avec gestion des multiples
 * @param {HTMLFormElement} form - Formulaire
 * @returns {Object} Objet avec tableaux pour les champs multiples
 */
export function formDataToObject(form) {
  void form;
  // TODO: Gérer getAll pour les champs avec même nom
  return undefined;
}
