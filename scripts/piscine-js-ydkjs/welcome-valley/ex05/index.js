/**
 * Ex05 - Functions Basics
 * Les trois façons de déclarer des fonctions
 */

/**
 * 1. Function Declaration
 * @param {string} name
 * @returns {string}
 */
export function greet(name) {
  // TODO: Retourne `Hello, ${name}!`
  return undefined;
}

/**
 * 2. Function Expression
 * Complète cette fonction
 */
export const multiply = function(a, b) {
  // TODO: Retourne a * b
  return undefined;
};

/**
 * 3. Arrow Function (syntaxe courte)
 * Complète cette fonction
 */
export const divide = (a, b) => {
  // TODO: Retourne a / b
  return undefined;
};

/**
 * Arrow avec un seul paramètre
 * Complète cette fonction
 */
export const double = (x) => {
  // TODO: Retourne x * 2
  return undefined;
};

/**
 * Arrow avec corps de fonction
 * @param {string} name
 * @returns {string}
 */
export const greetFormal = (name) => {
  // TODO: Crée const greeting = `Good morning, ${name}`
  // Retourne greeting
  return undefined;
};

/**
 * Teste toutes les fonctions
 * @returns {[string, number, number, number]}
 */
export function testFunctions() {
  // TODO: Retourne [greet("Alice"), multiply(3, 4), divide(10, 2), double(21)]
  return undefined;
}

/**
 * Default parameters
 * @param {string} name
 * @returns {string}
 */
export function greetWithDefault(name = "Guest") {
  // TODO: Retourne `Welcome, ${name}!`
  return undefined;
}

/**
 * Teste les default parameters
 * @returns {[string, string]}
 */
export function testDefaults() {
  // TODO: Retourne [greetWithDefault(), greetWithDefault("Bob")]
  return undefined;
}
