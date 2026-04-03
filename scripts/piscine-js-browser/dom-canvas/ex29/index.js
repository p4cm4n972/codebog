/**
 * Ex29 - Images & Transformations
 * Manipuler des images et appliquer des transformations
 */

/**
 * Charge une image
 * @param {string} src - URL de l'image
 * @returns {Promise<HTMLImageElement>} Image chargée
 */
export function loadImage(src) {
  void src;
  // TODO: new Image() + onload Promise
  return undefined;
}

/**
 * Dessine une image
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLImageElement} img - Image
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} [width] - Largeur (optionnel)
 * @param {number} [height] - Hauteur (optionnel)
 */
export function drawImage(ctx, img, x, y, width, height) {
  void ctx;
  void img;
  void x;
  void y;
  void width;
  void height;
  // TODO: ctx.drawImage avec ou sans dimensions
}

/**
 * Dessine une portion d'image (sprite)
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLImageElement} img - Image source
 * @param {Object} source - { x, y, width, height }
 * @param {Object} dest - { x, y, width, height }
 */
export function drawSprite(ctx, img, source, dest) {
  void ctx;
  void img;
  void source;
  void dest;
  // TODO: drawImage avec 9 paramètres
}

/**
 * Applique une translation
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Décalage X
 * @param {number} y - Décalage Y
 */
export function translate(ctx, x, y) {
  void ctx;
  void x;
  void y;
  // TODO: ctx.translate
}

/**
 * Applique une rotation
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} angle - Angle en radians
 */
export function rotate(ctx, angle) {
  void ctx;
  void angle;
  // TODO: ctx.rotate
}

/**
 * Applique un scale
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} scaleX - Échelle X
 * @param {number} scaleY - Échelle Y
 */
export function scale(ctx, scaleX, scaleY) {
  void ctx;
  void scaleX;
  void scaleY;
  // TODO: ctx.scale
}

/**
 * Réinitialise les transformations
 * @param {CanvasRenderingContext2D} ctx - Contexte
 */
export function resetTransform(ctx) {
  void ctx;
  // TODO: ctx.setTransform(1, 0, 0, 1, 0, 0)
}

/**
 * Dessine un rectangle avec rotation autour de son centre
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {number} angle - Angle en radians
 * @param {string} color - Couleur
 */
export function drawRotatedRect(ctx, x, y, width, height, angle, color) {
  void ctx;
  void x;
  void y;
  void width;
  void height;
  void angle;
  void color;
  // TODO: save + translate + rotate + fillRect + restore
}

/**
 * Dessine une image avec flip horizontal
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLImageElement} img - Image
 * @param {number} x - Position X
 * @param {number} y - Position Y
 */
export function drawFlippedImage(ctx, img, x, y) {
  void ctx;
  void img;
  void x;
  void y;
  // TODO: scale(-1, 1) + drawImage
}

/**
 * Dessine avec une transformation combinée
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {Object} transform - { x, y, rotation, scaleX, scaleY }
 * @param {Function} drawFn - Fonction de dessin
 */
export function drawWithTransform(ctx, transform, drawFn) {
  void ctx;
  void transform;
  void drawFn;
  // TODO: save + transformations + drawFn(ctx) + restore
}
