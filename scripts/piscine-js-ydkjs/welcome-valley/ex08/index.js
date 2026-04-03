/**
 * Ex08 - Template Literals
 * Les littéraux de gabarits ES6
 */

/**
 * Interpolation simple de variables
 * @param {string} name
 * @param {number} age
 * @returns {string}
 */
export function simpleInterpolation(name, age) {
  // TODO: Retourne `My name is ${name} and I am ${age} years old.`
  return undefined;
}

/**
 * Expression dans un template
 * @param {number} a
 * @param {number} b
 * @returns {string}
 */
export function expressionInterpolation(a, b) {
  // TODO: Retourne `${a} + ${b} = ${a + b}`
  return undefined;
}

/**
 * Chaîne multiligne
 * @returns {string}
 */
export function multilineString() {
  // TODO: Retourne une chaîne sur 3 lignes:
  // Line 1
  // Line 2
  // Line 3
  // Utilise les backticks pour le multiligne
  return undefined;
}

/**
 * Template imbriqué pour générer du HTML
 * @param {string[]} items
 * @returns {string}
 */
export function nestedTemplate(items) {
  // TODO: Retourne une liste HTML:
  // `<ul>\n  ${items.map(item => `<li>${item}</li>`).join('\n  ')}\n</ul>`
  return undefined;
}

/**
 * Template conditionnel
 * @param {boolean} isLoggedIn
 * @param {string} username
 * @returns {string}
 */
export function conditionalTemplate(isLoggedIn, username) {
  // TODO: Si isLoggedIn, retourne `Welcome back, ${username}!`
  // Sinon retourne "Please log in."
  return undefined;
}

/**
 * Template avec propriétés d'objet
 * @param {{ name: string, age: number, city: string }} person
 * @returns {string}
 */
export function objectTemplate(person) {
  // TODO: Retourne `${person.name}, ${person.age} ans, habite à ${person.city}.`
  return undefined;
}
