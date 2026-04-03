/**
 * Ex30 - Animation
 * Créer des animations fluides avec requestAnimationFrame
 */

/**
 * Crée une boucle d'animation simple
 * @param {Function} callback - Fonction appelée à chaque frame
 * @returns {Object} { start(), stop() }
 */
export function createAnimationLoop(callback) {
  void callback;
  // TODO: requestAnimationFrame + cancelAnimationFrame
  return undefined;
}

/**
 * Crée une boucle avec delta time
 * @param {Function} callback - (deltaTime) => void
 * @returns {Object} { start(), stop() }
 */
export function createDeltaTimeLoop(callback) {
  void callback;
  // TODO: Calculer dt entre frames
  return undefined;
}

/**
 * Crée une animation d'objet qui se déplace
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Object} object - { x, y, vx, vy, radius, color }
 * @returns {Object} { start(), stop() }
 */
export function createMovingObject(ctx, canvas, object) {
  void ctx;
  void canvas;
  void object;
  // TODO: Animer l'objet avec rebond sur les bords
  return undefined;
}

/**
 * Anime une valeur de start vers end
 * @param {number} start - Valeur de départ
 * @param {number} end - Valeur finale
 * @param {number} duration - Durée en ms
 * @param {Function} onUpdate - (currentValue) => void
 * @param {Function} [easing] - Fonction d'easing
 * @returns {Promise} Résolu quand terminé
 */
export function animate(start, end, duration, onUpdate, easing = t => t) {
  void start;
  void end;
  void duration;
  void onUpdate;
  void easing;
  // TODO: Animation avec interpolation
  return undefined;
}

/**
 * Crée un compteur de FPS
 * @returns {Object} { update(currentTime), getFps() }
 */
export function createFpsCounter() {
  // TODO: Compter les frames par seconde
  return undefined;
}

/**
 * Crée un gestionnaire de plusieurs animations
 * @returns {Object} { add(animation), remove(id), update(dt), start(), stop() }
 */
export function createAnimationManager() {
  // TODO: Gérer plusieurs animations simultanées
  return undefined;
}

/**
 * Crée une animation de particules
 * @param {CanvasRenderingContext2D} ctx - Contexte
 * @param {HTMLCanvasElement} canvas - Canvas
 * @param {Object} config - { count, speed, size, color }
 * @returns {Object} { start(), stop(), emit(x, y) }
 */
export function createParticleSystem(ctx, canvas, config) {
  void ctx;
  void canvas;
  void config;
  // TODO: Système de particules animées
  return undefined;
}

/**
 * Fonctions d'easing courantes
 */
export const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1
};

/**
 * Interpole entre deux valeurs
 * @param {number} a - Valeur de départ
 * @param {number} b - Valeur d'arrivée
 * @param {number} t - Progression (0-1)
 * @returns {number} Valeur interpolée
 */
export function lerp(a, b, t) {
  void a;
  void b;
  void t;
  // TODO: a + (b - a) * t
  return undefined;
}
