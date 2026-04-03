/**
 * Ex03 - Strings & Unicode
 * Comprendre UTF-16 et les strings en JavaScript
 */

/**
 * "café".length
 * @returns {number}
 */
export function str1() {
  // TODO: Retourne "café".length
  return undefined;
}

/**
 * "👨‍👩‍👧".length
 * @returns {number}
 */
export function str2() {
  // TODO: Retourne "👨‍👩‍👧".length
  return undefined;
}

/**
 * "👨‍👩‍👧".split("").length
 * @returns {number}
 */
export function str3() {
  // TODO: Retourne "👨‍👩‍👧".split("").length
  return undefined;
}

/**
 * [...'👨‍👩‍👧'].length
 * @returns {number}
 */
export function str4() {
  // TODO: Retourne [...'👨‍👩‍👧'].length
  return undefined;
}

/**
 * Comparaison de deux représentations de "é"
 * @returns {boolean}
 */
export function str5() {
  const a = "é";       // \u00E9 (caractère précomposé)
  const b = "e\u0301"; // e + combining acute accent
  // TODO: Retourne a === b
  return undefined;
}

/**
 * Comparaison après normalisation
 * @returns {boolean}
 */
export function str6() {
  const a = "é".normalize();
  const b = "e\u0301".normalize();
  // TODO: Retourne a === b
  return undefined;
}
