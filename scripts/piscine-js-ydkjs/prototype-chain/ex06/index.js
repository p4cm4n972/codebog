/**
 * Ex06 - instanceof
 * Comment instanceof fonctionne vraiment
 */

/**
 * instanceof basique
 * @returns {[boolean, boolean]}
 */
export function instance1() {
  function Dog() {}
  const d = new Dog();
  // TODO: Retourne [d instanceof Dog, d instanceof Object]
  return undefined;
}

/**
 * Prototype changé après création
 * @returns {boolean}
 */
export function instance2() {
  function Dog() {}
  const d = new Dog();

  // Changer le prototype après création
  Dog.prototype = {};

  // TODO: Retourne d instanceof Dog
  return undefined;
}

/**
 * isPrototypeOf
 * @returns {[boolean, boolean]}
 */
export function instance3() {
  function Dog() {}
  const d = new Dog();

  // TODO: Retourne [Dog.prototype.isPrototypeOf(d), Object.prototype.isPrototypeOf(d)]
  return undefined;
}

/**
 * instanceof avec Object.create
 * @returns {boolean}
 */
export function instance4() {
  const proto = { bark() { return "woof"; } };
  const d = Object.create(proto);

  function Dog() {}
  Dog.prototype = proto;

  // TODO: Retourne d instanceof Dog
  return undefined;
}
