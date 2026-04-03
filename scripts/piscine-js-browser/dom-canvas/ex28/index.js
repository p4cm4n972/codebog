/**
 * Ex28 - Paths & Text
 * Dessiner des chemins complexes et du texte
 */

/**
 * Dessine un triangle
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x1 - Premier sommet X
 * @param {number} y1 - Premier sommet Y
 * @param {number} x2 - Deuxième sommet X
 * @param {number} y2 - Deuxième sommet Y
 * @param {number} x3 - Troisième sommet X
 * @param {number} y3 - Troisième sommet Y
 * @param {string} color - Couleur
 */
export function drawTriangle(ctx, x1, y1, x2, y2, x3, y3, color) {
  void ctx;
  void x1; void y1; void x2; void y2; void x3; void y3;
  void color;
  // TODO: beginPath + moveTo + lineTo + closePath + fill
}

/**
 * Dessine un polygone régulier
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} centerX - Centre X
 * @param {number} centerY - Centre Y
 * @param {number} radius - Rayon
 * @param {number} sides - Nombre de côtés
 * @param {string} color - Couleur
 */
export function drawPolygon(ctx, centerX, centerY, radius, sides, color) {
  void ctx;
  void centerX;
  void centerY;
  void radius;
  void sides;
  void color;
  // TODO: Boucle avec calcul des points
}

/**
 * Dessine un arc de cercle
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Centre X
 * @param {number} y - Centre Y
 * @param {number} radius - Rayon
 * @param {number} startAngle - Angle de début (radians)
 * @param {number} endAngle - Angle de fin (radians)
 * @param {string} color - Couleur
 */
export function drawArc(ctx, x, y, radius, startAngle, endAngle, color) {
  void ctx;
  void x;
  void y;
  void radius;
  void startAngle;
  void endAngle;
  void color;
  // TODO: arc + stroke
}

/**
 * Dessine une courbe de Bézier quadratique
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x1 - Début X
 * @param {number} y1 - Début Y
 * @param {number} cpX - Point de contrôle X
 * @param {number} cpY - Point de contrôle Y
 * @param {number} x2 - Fin X
 * @param {number} y2 - Fin Y
 * @param {string} color - Couleur
 */
export function drawQuadraticCurve(ctx, x1, y1, cpX, cpY, x2, y2, color) {
  void ctx;
  void x1; void y1; void cpX; void cpY; void x2; void y2;
  void color;
  // TODO: moveTo + quadraticCurveTo + stroke
}

/**
 * Dessine du texte plein
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {string} text - Texte à dessiner
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {Object} options - { font, color, align, baseline }
 */
export function drawText(ctx, text, x, y, options = {}) {
  void ctx;
  void text;
  void x;
  void y;
  void options;
  // TODO: Configurer font, textAlign, textBaseline + fillText
}

/**
 * Dessine du texte avec contour
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {string} text - Texte à dessiner
 * @param {number} x - Position X
 * @param {number} y - Position Y
 * @param {Object} options - { font, color, lineWidth }
 */
export function drawStrokedText(ctx, text, x, y, options = {}) {
  void ctx;
  void text;
  void x;
  void y;
  void options;
  // TODO: strokeText
}

/**
 * Mesure la largeur d'un texte
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {string} text - Texte à mesurer
 * @param {string} font - Police (ex: '16px Arial')
 * @returns {number} Largeur en pixels
 */
export function measureTextWidth(ctx, text, font) {
  void ctx;
  void text;
  void font;
  // TODO: ctx.measureText(text).width
  return undefined;
}

/**
 * Dessine un chemin personnalisé
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {Array} points - [{ x, y }, ...]
 * @param {boolean} closed - Fermer le chemin ?
 * @param {string} fillColor - Couleur de remplissage (ou null)
 * @param {string} strokeColor - Couleur de contour (ou null)
 */
export function drawPath(ctx, points, closed, fillColor, strokeColor) {
  void ctx;
  void points;
  void closed;
  void fillColor;
  void strokeColor;
  // TODO: Parcourir les points avec moveTo/lineTo
}

/**
 * Dessine une étoile
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {number} x - Centre X
 * @param {number} y - Centre Y
 * @param {number} outerRadius - Rayon externe
 * @param {number} innerRadius - Rayon interne
 * @param {number} points - Nombre de pointes
 * @param {string} color - Couleur
 */
export function drawStar(ctx, x, y, outerRadius, innerRadius, points, color) {
  void ctx;
  void x;
  void y;
  void outerRadius;
  void innerRadius;
  void points;
  void color;
  // TODO: Alterner entre rayon externe et interne
}
