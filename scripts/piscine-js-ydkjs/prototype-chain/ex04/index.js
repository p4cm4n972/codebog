/**
 * Ex04 - Constructor Functions
 * new et .prototype
 */

/**
 * Méthodes partagées via prototype
 * @returns {[string, boolean]}
 */
export function constructor1() {
  function Dog(name) {
    this.name = name;
  }
  Dog.prototype.bark = function() {
    return `${this.name} says woof!`;
  };

  const d1 = new Dog("Rex");
  const d2 = new Dog("Max");

  // TODO: Retourne [d1.bark(), d1.bark === d2.bark]
  return undefined;
}

/**
 * Remplacement de prototype (bug)
 * @returns {boolean}
 */
export function constructor2() {
  function Dog(name) {
    this.name = name;
  }

  Dog.prototype = {
    bark() {
      return "woof";
    }
  };

  const d = new Dog("Rex");
  // TODO: Retourne d.constructor === Dog
  return undefined;
}

/**
 * Fix avec constructor explicite
 * @returns {boolean}
 */
export function constructor3() {
  function Dog(name) {
    this.name = name;
  }

  Dog.prototype = {
    constructor: Dog,
    bark() {
      return "woof";
    }
  };

  const d = new Dog("Rex");
  // TODO: Retourne d.constructor === Dog
  return undefined;
}
