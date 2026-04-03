/**
 * Ex03 - Private State
 * Créer des objets avec état vraiment privé
 */

/**
 * Crée une personne avec état privé
 * @param {string} name
 * @param {number} age
 * @returns {object}
 */
export function createPerson(name, age) {
  let _name = name;
  let _age = age;

  // TODO: Retourne un objet avec:
  // - getName(): retourne _name
  // - getAge(): retourne _age
  // - birthday(): incrémente _age
  // - rename(newName): change _name si newName est une string non-vide
  return undefined;
}

/**
 * Teste l'encapsulation privée
 * @returns {[string, number]}
 */
export function testPrivate() {
  const person = createPerson("Alice", 25);
  person.birthday();
  person._age = 100;  // Tentative de modification directe
  person.rename("Bob");
  // TODO: Retourne [person.getName(), person.getAge()]
  return undefined;
}
