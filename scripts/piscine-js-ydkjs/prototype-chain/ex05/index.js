/**
 * Ex05 - Class Sugar
 * class est du sucre syntaxique sur prototype
 */

/**
 * Class est une fonction
 * @returns {[string, boolean]}
 */
export function class1() {
  class Dog {
    constructor(name) {
      this.name = name;
    }
    bark() {
      return `${this.name} barks`;
    }
  }

  const d = new Dog("Rex");
  // TODO: Retourne [typeof Dog, Object.getPrototypeOf(d) === Dog.prototype]
  return undefined;
}

/**
 * extends et la chaîne prototype
 * @returns {[string, boolean]}
 */
export function class2() {
  class Animal {
    speak() {
      return `${this.name} speaks`;
    }
  }

  class Dog extends Animal {
    constructor(name) {
      super();
      this.name = name;
    }
    bark() {
      return `${this.name} barks`;
    }
  }

  const d = new Dog("Rex");
  // TODO: Retourne [d.speak(), Object.getPrototypeOf(Dog.prototype) === Animal.prototype]
  return undefined;
}

/**
 * Classes ne sont pas hoisted
 * @returns {string}
 */
export function class3() {
  try {
    // eslint-disable-next-line no-use-before-define
    const d = new Dog("Rex");
    void d;
    return "ok";
  } catch (e) {
    return "ReferenceError";
  }

  class Dog {
    constructor(name) {
      this.name = name;
    }
  }
}
