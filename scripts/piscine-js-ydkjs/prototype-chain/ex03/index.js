/**
 * Ex03 - Object.create
 * Création avec prototype spécifique
 */

/**
 * Méthode partagée via prototype
 * @returns {string}
 */
export function create1() {
  const proto = {
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const obj = Object.create(proto);
  obj.name = "Alice";
  // TODO: Retourne obj.greet()
  return undefined;
}

/**
 * Property descriptors
 * @returns {[number, number]}
 */
export function create2() {
  const proto = { x: 1 };
  const obj = Object.create(proto, {
    y: { value: 2, writable: true, enumerable: true }
  });
  // TODO: Retourne [obj.x, obj.y]
  return undefined;
}

/**
 * Simuler l'héritage
 * @returns {[string, string]}
 */
export function create3() {
  const Animal = {
    speak() {
      return `${this.name} makes a sound`;
    }
  };

  const Dog = Object.create(Animal);
  Dog.bark = function() {
    return `${this.name} barks`;
  };

  const myDog = Object.create(Dog);
  myDog.name = "Rex";

  // TODO: Retourne [myDog.speak(), myDog.bark()]
  return undefined;
}
