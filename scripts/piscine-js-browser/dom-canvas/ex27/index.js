/**
 * Ex27 - Canvas Basics
 * Comprendre les bases du dessin avec Canvas 2D
 */

/**
 * Crée un canvas avec dimensions
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @returns {HTMLCanvasElement} Canvas créé
 */
export function createCanvas(width, height) {
  void width;
  void height;
  // TODO: document.createElement('canvas')
  return undefined;
}

/**
 * Récupère le contexte 2D
 * @param {HTMLCanvasElement} canvas - Canvas
 * @returns {CanvasRenderingContext2D} Contexte 2D
 */
export function getContext(canvas) {
  void canvas;
  // TODO: canvas.getContext('2d')
  return undefined;
}

/**
 * Dessine un rectangle plein
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {string} color - Couleur de remplissage
 */
export function drawFilledRect(ctx, x, y, width, height, color) {
  void ctx;
  void x;
  void y;
  void width;
  void height;
  void color;
  // TODO: fillStyle + fillRect
}

/**
 * Dessine un rectangle avec contour
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {number} width - Largeur
 * @param {number} height - Hauteur
 * @param {string} color - Couleur du contour
 * @param {number} lineWidth - Épaisseur
 */
export function drawStrokedRect(ctx, x, y, width, height, color, lineWidth = 1) {
  void ctx;
  void x;
  void y;
  void width;
  void height;
  void color;
  void lineWidth;
  // TODO: strokeStyle + lineWidth + strokeRect
}

/**
 * Dessine un cercle plein
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Centre X
 * @param {number} y - Centre Y
 * @param {number} radius - Rayon
 * @param {string} color - Couleur
 */
export function drawFilledCircle(ctx, x, y, radius, color) {
  void ctx;
  void x;
  void y;
  void radius;
  void color;
  // TODO: beginPath + arc + fill
}

/**
 * Dessine un cercle avec contour
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Centre X
 * @param {number} y - Centre Y
 * @param {number} radius - Rayon
 * @param {string} color - Couleur
 * @param {number} lineWidth - Épaisseur
 */
export function drawStrokedCircle(ctx, x, y, radius, color, lineWidth = 1) {
  void ctx;
  void x;
  void y;
  void radius;
  void color;
  void lineWidth;
  // TODO: beginPath + arc + stroke
}

/**
 * Efface le canvas
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLCanvasElement} canvas - Canvas
 */
export function clearCanvas(ctx, canvas) {
  void ctx;
  void canvas;
  // TODO: clearRect(0, 0, width, height)
}

/**
 * Dessine une ligne
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x1 - Début X
 * @param {number} y1 - Début Y
 * @param {number} x2 - Fin X
 * @param {number} y2 - Fin Y
 * @param {string} color - Couleur
 * @param {number} lineWidth - Épaisseur
 */
export function drawLine(ctx, x1, y1, x2, y2, color, lineWidth = 1) {
  void ctx;
  void x1;
  void y1;
  void x2;
  void y2;
  void color;
  void lineWidth;
  // TODO: beginPath + moveTo + lineTo + stroke
}

/**
 * Remplit le canvas avec une couleur
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {string} color - Couleur
 */
export function fillBackground(ctx, canvas, color) {
  void ctx;
  void canvas;
  void color;
  // TODO: fillRect sur tout le canvas
}
