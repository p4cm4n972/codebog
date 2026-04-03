/**
 * Ex35 - Color Picker
 * Créer un sélecteur de couleur interactif avec Canvas
 */

/**
 * Convertit HSL vers RGB
 * @param {number} h - Teinte (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Luminosité (0-100)
 * @returns {number[]} [r, g, b] (0-255)
 */
export function hslToRgb(h, s, l) {
  void h;
  void s;
  void l;
  // TODO: Conversion HSL -> RGB
  return undefined;
}

/**
 * Convertit RGB vers HSL
 * @param {number} r - Rouge (0-255)
 * @param {number} g - Vert (0-255)
 * @param {number} b - Bleu (0-255)
 * @returns {number[]} [h, s, l]
 */
export function rgbToHsl(r, g, b) {
  void r;
  void g;
  void b;
  // TODO: Conversion RGB -> HSL
  return undefined;
}

/**
 * Convertit RGB vers HEX
 * @param {number} r - Rouge (0-255)
 * @param {number} g - Vert (0-255)
 * @param {number} b - Bleu (0-255)
 * @returns {string} Code HEX (#RRGGBB)
 */
export function rgbToHex(r, g, b) {
  void r;
  void g;
  void b;
  // TODO: Conversion RGB -> HEX
  return undefined;
}

/**
 * Convertit HEX vers RGB
 * @param {string} hex - Code HEX (#RRGGBB ou RRGGBB)
 * @returns {number[]|null} [r, g, b] ou null si invalide
 */
export function hexToRgb(hex) {
  void hex;
  // TODO: Conversion HEX -> RGB
  return undefined;
}

/**
 * Dessine la palette de couleurs
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {number} hue - Teinte (0-360)
 */
export function drawColorPalette(ctx, width, height, hue) {
  void ctx;
  void width;
  void height;
  void hue;
  // TODO: Dessiner avec gradients
}

/**
 * Dessine le slider de teinte
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 */
export function drawHueSlider(ctx, width, height) {
  void ctx;
  void width;
  void height;
  // TODO: Gradient de toutes les teintes
}

/**
 * Récupère la couleur à une position sur la palette
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @returns {Object} { r, g, b, hex }
 */
export function getColorAt(ctx, x, y) {
  void ctx;
  void x;
  void y;
  // TODO: getImageData pour le pixel
  return undefined;
}

/**
 * Crée le color picker complet
 * @param {HTMLElement} container - Conteneur
 * @param {Object} options - { initialColor, onChange }
 * @returns {Object} { getColor, setColor, destroy }
 */
export function createColorPicker(container, options = {}) {
  void container;
  void options;
  // TODO: Créer le color picker complet
  return undefined;
}

/**
 * Valide un code couleur HEX
 * @param {string} hex - Code à valider
 * @returns {boolean} True si valide
 */
export function isValidHex(hex) {
  void hex;
  // TODO: Regex pour valider le format HEX
  return undefined;
}

/**
 * Formate une couleur pour affichage
 * @param {Object} color - { r, g, b }
 * @returns {Object} { hex, rgb, hsl }
 */
export function formatColor(color) {
  void color;
  // TODO: Retourner tous les formats
  return undefined;
}

/**
 * Calcule la couleur complémentaire
 * @param {number} h - Teinte (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Luminosité (0-100)
 * @returns {number[]} [h, s, l] complémentaire
 */
export function getComplementary(h, s, l) {
  void h;
  void s;
  void l;
  // TODO: Teinte + 180
  return undefined;
}

/**
 * Détermine si une couleur est claire ou foncée
 * @param {number} r - Rouge
 * @param {number} g - Vert
 * @param {number} b - Bleu
 * @returns {boolean} True si couleur claire
 */
export function isLightColor(r, g, b) {
  void r;
  void g;
  void b;
  // TODO: Calculer la luminance
  return undefined;
}
