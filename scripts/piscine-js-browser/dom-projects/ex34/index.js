/**
 * Ex34 - Timer & Stopwatch
 * Créer un chronomètre et un minuteur
 */

/**
 * Formate des millisecondes en MM:SS.CC
 * @param {number} ms - Millisecondes
 * @returns {string} Temps formaté
 */
export function formatTime(ms) {
  void ms;
  // TODO: Formatter en MM:SS.CC
  return undefined;
}

/**
 * Parse une chaîne de temps en millisecondes
 * @param {string} timeStr - Temps au format MM:SS
 * @returns {number} Millisecondes
 */
export function parseTime(timeStr) {
  void timeStr;
  // TODO: Parser MM:SS vers ms
  return undefined;
}

/**
 * Crée un chronomètre (Stopwatch)
 * @returns {Object} { start, pause, reset, lap, getElapsed, getLaps, isRunning }
 */
export function createStopwatch() {
  // TODO: Chronomètre avec laps
  return undefined;
}

/**
 * Crée un minuteur (Timer)
 * @param {number} duration - Durée initiale en ms
 * @param {Function} onComplete - Callback quand terminé
 * @returns {Object} { start, pause, reset, setDuration, getRemaining, isRunning }
 */
export function createTimer(duration, onComplete) {
  void duration;
  void onComplete;
  // TODO: Compte à rebours
  return undefined;
}

/**
 * Crée l'affichage du chronomètre
 * @param {HTMLElement} container - Conteneur
 * @param {Object} stopwatch - Instance de stopwatch
 * @returns {Object} { update, destroy }
 */
export function createStopwatchDisplay(container, stopwatch) {
  void container;
  void stopwatch;
  // TODO: Affichage avec boutons
  return undefined;
}

/**
 * Crée l'affichage du minuteur
 * @param {HTMLElement} container - Conteneur
 * @param {Object} timer - Instance de timer
 * @returns {Object} { update, destroy }
 */
export function createTimerDisplay(container, timer) {
  void container;
  void timer;
  // TODO: Affichage avec input durée et boutons
  return undefined;
}

/**
 * Crée un affichage de temps avec mise à jour automatique
 * @param {HTMLElement} display - Élément d'affichage
 * @param {Function} getTime - Fonction retournant le temps actuel
 * @returns {Object} { start, stop }
 */
export function createAutoUpdatingDisplay(display, getTime) {
  void display;
  void getTime;
  // TODO: setInterval ou requestAnimationFrame
  return undefined;
}

/**
 * Joue un son de notification
 * @param {number} frequency - Fréquence Hz
 * @param {number} duration - Durée ms
 */
export function playBeep(frequency = 440, duration = 200) {
  void frequency;
  void duration;
  // TODO: AudioContext pour jouer un son
}

/**
 * Formate une liste de laps
 * @param {number[]} laps - Temps des laps en ms
 * @returns {string[]} Laps formatés avec différences
 */
export function formatLaps(laps) {
  void laps;
  // TODO: Formatter chaque lap avec temps total et différence
  return undefined;
}

/**
 * Initialise l'application Timer/Stopwatch
 * @param {HTMLElement} rootElement - Élément racine
 * @returns {Object} { stopwatch, timer, destroy }
 */
export function initTimerApp(rootElement) {
  void rootElement;
  // TODO: Initialiser l'app complète
  return undefined;
}
