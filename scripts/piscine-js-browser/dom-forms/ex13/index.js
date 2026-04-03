/**
 * Ex13 - Input Events
 * Gérer les événements des champs de formulaire
 */

/**
 * Écoute les changements en temps réel
 * @param {HTMLInputElement} input - Champ input
 * @param {Function} callback - Callback(value)
 */
export function onInput(input, callback) {
  void input;
  void callback;
  // TODO: addEventListener('input', ...)
}

/**
 * Écoute le changement final (blur/enter)
 * @param {HTMLInputElement} input - Champ input
 * @param {Function} callback - Callback(value)
 */
export function onChange(input, callback) {
  void input;
  void callback;
  // TODO: addEventListener('change', ...)
}

/**
 * Gère le focus et blur
 * @param {HTMLInputElement} input - Champ input
 * @param {Function} onFocus - Callback au focus
 * @param {Function} onBlur - Callback au blur
 */
export function onFocusBlur(input, onFocus, onBlur) {
  void input;
  void onFocus;
  void onBlur;
  // TODO: focus et blur events
}

/**
 * Donne le focus à un élément
 * @param {HTMLElement} element - Élément cible
 * @param {Object} options - { preventScroll: boolean }
 */
export function focusElement(element, options = {}) {
  void element;
  void options;
  // TODO: element.focus(options)
}

/**
 * Sélectionne tout le contenu d'un input
 * @param {HTMLInputElement} input - Champ input
 */
export function selectAll(input) {
  void input;
  // TODO: input.select()
}

/**
 * Sélectionne une partie du texte
 * @param {HTMLInputElement} input - Champ input
 * @param {number} start - Position de début
 * @param {number} end - Position de fin
 */
export function selectRange(input, start, end) {
  void input;
  void start;
  void end;
  // TODO: setSelectionRange
}

/**
 * Crée un compteur de caractères
 * @param {HTMLInputElement} input - Champ input
 * @param {HTMLElement} display - Élément d'affichage
 * @param {number} maxLength - Longueur maximale
 */
export function createCharCounter(input, display, maxLength) {
  void input;
  void display;
  void maxLength;
  // TODO: Mettre à jour display sur input event
}

/**
 * Gère les fichiers uploadés
 * @param {HTMLInputElement} fileInput - Input de type file
 * @param {Function} callback - Callback(files)
 */
export function onFileSelect(fileInput, callback) {
  void fileInput;
  void callback;
  // TODO: change event + e.target.files
}

/**
 * Crée un input avec preview en temps réel
 * @param {HTMLInputElement} input - Champ input
 * @param {HTMLElement} preview - Élément preview
 * @param {Function} transform - Fonction de transformation (optionnel)
 */
export function createLivePreview(input, preview, transform = v => v) {
  void input;
  void preview;
  void transform;
  // TODO: Mettre à jour preview sur input event
}

/**
 * Surveille les changements de sélection dans un select
 * @param {HTMLSelectElement} select - Élément select
 * @param {Function} callback - Callback(value, previousValue)
 */
export function onSelectChange(select, callback) {
  void select;
  void callback;
  // TODO: Stocker la valeur précédente et appeler callback sur change
}
