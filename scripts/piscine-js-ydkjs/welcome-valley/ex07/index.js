/**
 * Ex07 - Loops
 * Les différentes boucles en JavaScript
 */

/**
 * Somme de 1 à n avec for
 * @param {number} n
 * @returns {number}
 */
export function sumWithFor(n) {
  // TODO: Utilise for (let i = 1; i <= n; i++)
  // Additionne tous les nombres et retourne le total
  return undefined;
}

/**
 * Somme de 1 à n avec while
 * @param {number} n
 * @returns {number}
 */
export function sumWithWhile(n) {
  // TODO: Utilise while (i <= n)
  // Même résultat que sumWithFor
  return undefined;
}

/**
 * Somme des éléments d'un array avec for...of
 * @param {number[]} arr
 * @returns {number}
 */
export function iterateArray(arr) {
  // TODO: Utilise for (const num of arr)
  // Retourne la somme de tous les éléments
  return undefined;
}

/**
 * Récupère les clés d'un objet avec for...in
 * @param {object} obj
 * @returns {string[]}
 */
export function getObjectKeys(obj) {
  // TODO: Utilise for (const key in obj)
  // Retourne un array de toutes les clés
  return undefined;
}

/**
 * Double chaque élément avec forEach
 * @param {number[]} arr
 * @returns {number[]}
 */
export function doubleWithForEach(arr) {
  // TODO: Crée un array result = []
  // Utilise arr.forEach(num => result.push(num * 2))
  // Retourne result
  return undefined;
}

/**
 * Trouve le premier multiple de 7 avec break
 * @returns {number}
 */
export function breakExample() {
  // TODO: Boucle de 1 à 100
  // Quand i % 7 === 0, utilise break et retourne i
  return undefined;
}

/**
 * Retourne les nombres de 1 à 10 non divisibles par 3
 * @returns {number[]}
 */
export function continueExample() {
  // TODO: Boucle de 1 à 10
  // Si i % 3 === 0, utilise continue pour sauter
  // Sinon, ajoute i au résultat
  return undefined;
}
