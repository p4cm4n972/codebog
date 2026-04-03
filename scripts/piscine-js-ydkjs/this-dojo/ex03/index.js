/**
 * Ex03 - new Binding
 * this dans les constructeurs
 */

/**
 * Constructeur basique
 * @returns {string}
 */
export function new1() {
  function Person(name) {
    this.name = name;
  }
  const p = new Person("Alice");
  // TODO: Retourne p.name
  return undefined;
}

/**
 * Return object override
 * @returns {string}
 */
export function new2() {
  function Person(name) {
    this.name = name;
    return { name: "Overridden" };
  }
  const p = new Person("Alice");
  // TODO: Retourne p.name
  return undefined;
}

/**
 * Return primitif ignoré
 * @returns {string}
 */
export function new3() {
  function Person(name) {
    this.name = name;
    return 42;  // ignoré
  }
  const p = new Person("Alice");
  // TODO: Retourne p.name
  return undefined;
}

/**
 * Avec prototype
 * @returns {string}
 */
export function new4() {
  function Person(name) {
    this.name = name;
  }
  Person.prototype.greet = function() {
    return `Hello, ${this.name}`;
  };
  const p = new Person("Bob");
  // TODO: Retourne p.greet()
  return undefined;
}
