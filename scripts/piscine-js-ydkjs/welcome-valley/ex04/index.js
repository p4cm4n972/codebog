/**
 * Ex04 - Objects Introduction
 * Les objets en JavaScript
 */

/**
 * Crée un objet et accède à une propriété
 * @returns {string}
 */
export function createObject() {
  // TODO: Crée person = { name: "Alice", age: 30, city: "Paris" }
  // Retourne person.name
  return undefined;
}

/**
 * Deux façons d'accéder aux propriétés
 * @returns {[string, string]}
 */
export function accessProperty() {
  // TODO: Crée car = { brand: "Tesla", model: "Model 3" }
  // Retourne [car.brand, car["model"]]
  return undefined;
}

/**
 * Ajouter, modifier, supprimer des propriétés
 * @returns {object}
 */
export function modifyObject() {
  // TODO: Crée user = { name: "Bob" }
  // Ajoute user.age = 25
  // Modifie user.name = "Robert"
  // Supprime delete user.age
  // Retourne user
  return undefined;
}

/**
 * Property shorthand ES6
 * @returns {object}
 */
export function objectShorthand() {
  const name = "Charlie";
  const age = 35;
  // TODO: Crée un objet avec shorthand { name, age }
  // Retourne cet objet
  return undefined;
}

/**
 * Accès aux propriétés imbriquées
 * @returns {string}
 */
export function nestedObject() {
  // TODO: Crée company = { name: "TechCorp", address: { city: "Lyon", zip: "69000" } }
  // Retourne company.address.city
  return undefined;
}

/**
 * Méthodes Object.keys, values, entries
 * @returns {[string[], number[], [string, number][]]}
 */
export function objectMethods() {
  // TODO: Crée obj = { a: 1, b: 2, c: 3 }
  // Retourne [Object.keys(obj), Object.values(obj), Object.entries(obj)]
  return undefined;
}
