/**
 * Ex31 - Interactive Canvas
 * Rendre le canvas interactif avec les événements souris
 */

/**
 * Récupère la position de la souris relative au canvas
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {MouseEvent} event - Événement souris
 * @returns {Object} { x, y }
 */
export function getMousePos(canvas, event) {
  void canvas;
  void event;
  // TODO: getBoundingClientRect + clientX/Y
  return undefined;
}

/**
 * Vérifie si un point est dans un cercle
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} cx - Centre X
 * @param {number} cy - Centre Y
 * @param {number} radius - Rayon
 * @returns {boolean}
 */
export function isPointInCircle(px, py, cx, cy, radius) {
  void px; void py; void cx; void cy; void radius;
  // TODO: Distance <= radius
  return undefined;
}

/**
 * Vérifie si un point est dans un rectangle
 * @param {number} px - Point X
 * @param {number} py - Point Y
 * @param {number} rx - Rectangle X
 * @param {number} ry - Rectangle Y
 * @param {number} rw - Largeur
 * @param {number} rh - Hauteur
 * @returns {boolean}
 */
export function isPointInRect(px, py, rx, ry, rw, rh) {
  void px; void py; void rx; void ry; void rw; void rh;
  // TODO: Vérifier les bornes
  return undefined;
}

/**
 * Crée un gestionnaire de suivi souris
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Function} onMove - (x, y) => void
 * @returns {Function} Cleanup function
 */
export function trackMouse(canvas, onMove) {
  void canvas;
  void onMove;
  // TODO: addEventListener + retourner cleanup
  return undefined;
}

/**
 * Crée un gestionnaire de dessin libre
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {Object} options - { color, lineWidth }
 * @returns {Object} { clear(), getHistory() }
 */
export function createDrawingHandler(canvas, ctx, options = {}) {
  void canvas;
  void ctx;
  void options;
  // TODO: Gérer mousedown/move/up pour dessiner
  return undefined;
}

/**
 * Crée un objet draggable
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Object} object - { x, y, width, height } ou { x, y, radius }
 * @param {Function} onDrag - (x, y) => void
 * @returns {Function} Cleanup function
 */
export function makeDraggable(canvas, object, onDrag) {
  void canvas;
  void object;
  void onDrag;
  // TODO: Gérer le drag and drop
  return undefined;
}

/**
 * Crée un gestionnaire de clics sur des objets
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Array} objects - [{ x, y, width, height, id }]
 * @param {Function} onClick - (object) => void
 * @returns {Function} Cleanup function
 */
export function createClickHandler(canvas, objects, onClick) {
  void canvas;
  void objects;
  void onClick;
  // TODO: Détecter l'objet cliqué
  return undefined;
}

/**
 * Crée un gestionnaire de hover sur des objets
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Array} objects - [{ x, y, width, height, id }]
 * @param {Function} onEnter - (object) => void
 * @param {Function} onLeave - (object) => void
 * @returns {Function} Cleanup function
 */
export function createHoverHandler(canvas, objects, onEnter, onLeave) {
  void canvas;
  void objects;
  void onEnter;
  void onLeave;
  // TODO: Tracker l'objet sous la souris
  return undefined;
}

/**
 * Crée un canvas avec sélection rectangulaire
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Function} onSelect - (rect) => void
 * @returns {Function} Cleanup function
 */
export function createSelectionBox(canvas, onSelect) {
  void canvas;
  void onSelect;
  // TODO: Dessiner un rectangle de sélection
  return undefined;
}

/**
 * Convertit les touches tactiles en événements souris équivalents
 * @param {HTMLCanvasElement} canvas - Canvas
 * @returns {Function} Cleanup function
 */
export function enableTouchSupport(canvas) {
  void canvas;
  // TODO: touchstart/move/end vers mousedown/move/up
  return undefined;
}
