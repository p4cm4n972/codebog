/**
 * Ex06 - Conditionals
 * Structures conditionnelles en JavaScript
 */

/**
 * Vérifie si une personne est majeure ou mineure
 * @param {number} age
 * @returns {string} "minor" ou "adult"
 */
export function checkAge(age) {
  // TODO: Utilise if/else
  // Si age < 18, retourne "minor"
  // Sinon retourne "adult"
  return undefined;
}

/**
 * Convertit un score en note lettrée
 * @param {number} score
 * @returns {string} "A", "B", "C", "D" ou "F"
 */
export function checkScore(score) {
  // TODO: Utilise if/else if/else
  // >= 90 → "A", >= 80 → "B", >= 70 → "C", >= 60 → "D", sinon → "F"
  return undefined;
}

/**
 * Exemple d'opérateur ternaire
 * @param {boolean} isRaining
 * @returns {string} "umbrella" ou "sunglasses"
 */
export function ternaryExample(isRaining) {
  // TODO: Utilise l'opérateur ternaire
  // isRaining ? "umbrella" : "sunglasses"
  return undefined;
}

/**
 * Retourne le nom du jour selon son numéro
 * @param {number} day - 1 à 7
 * @returns {string} Nom du jour ou "Invalid day"
 */
export function getDayName(day) {
  // TODO: Utilise switch/case
  // 1 → "Monday", 2 → "Tuesday", 3 → "Wednesday",
  // 4 → "Thursday", 5 → "Friday", 6 → "Saturday", 7 → "Sunday"
  // default → "Invalid day"
  return undefined;
}

/**
 * Vérifie si une valeur est truthy
 * @param {*} value
 * @returns {boolean}
 */
export function isTruthy(value) {
  // TODO: Retourne true si value est truthy, false sinon
  // Astuce: Boolean(value) ou !!value
  return undefined;
}

/**
 * Teste plusieurs valeurs pour truthy/falsy
 * @returns {boolean[]}
 */
export function testTruthyFalsy() {
  // TODO: Retourne [isTruthy(0), isTruthy(1), isTruthy(""),
  //                 isTruthy("hello"), isTruthy(null),
  //                 isTruthy(undefined), isTruthy([]), isTruthy({})]
  return undefined;
}
