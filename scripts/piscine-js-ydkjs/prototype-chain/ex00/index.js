/**
 * Ex00 - [[Prototype]] Link
 * Le lien prototype interne
 */

/**
 * Prototype d'un objet littéral
 * @returns {boolean}
 */
export function proto1() {
  const obj = {};
  // TODO: Retourne Object.getPrototypeOf(obj) === Object.prototype
  return undefined;
}

/**
 * Chaîne de prototype d'un tableau
 * @returns {[boolean, boolean]}
 */
export function proto2() {
  const arr = [];
  // TODO: Retourne [
  //   Object.getPrototypeOf(arr) === Array.prototype,
  //   Object.getPrototypeOf(Array.prototype) === Object.prototype
  // ]
  return undefined;
}

/**
 * Prototype d'une instance
 * @returns {boolean}
 */
export function proto3() {
  function Foo() {}
  const f = new Foo();
  // TODO: Retourne Object.getPrototypeOf(f) === Foo.prototype
  return undefined;
}

/**
 * Objet sans prototype
 * @returns {null}
 */
export function proto4() {
  const obj = Object.create(null);
  // TODO: Retourne Object.getPrototypeOf(obj)
  return undefined;
}
