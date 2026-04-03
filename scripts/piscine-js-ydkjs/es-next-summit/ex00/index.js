/**
 * Ex00 - Destructuring Deep
 * Nested, defaults, rest
 */

/**
 * Déstructuration basique
 * @returns {[number, number]}
 */
export function destruct1() {
  const { a, b } = { a: 1, b: 2, c: 3 };
  void a; void b;
  // TODO: Retourne [a, b]
  return undefined;
}

/**
 * Valeur par défaut
 * @returns {[number, number]}
 */
export function destruct2() {
  const { a, b = 10 } = { a: 1 };
  void a; void b;
  // TODO: Retourne [a, b]
  return undefined;
}

/**
 * Renommage
 * @returns {[number, number]}
 */
export function destruct3() {
  const { a: x, b: y } = { a: 1, b: 2 };
  void x; void y;
  // TODO: Retourne [x, y]
  return undefined;
}

/**
 * Imbrication profonde
 * @returns {number}
 */
export function destruct4() {
  const { a: { b: { c } } } = { a: { b: { c: 42 } } };
  void c;
  // TODO: Retourne c
  return undefined;
}

/**
 * Array avec trous
 * @returns {[number, number]}
 */
export function destruct5() {
  const [first, , third] = [1, 2, 3, 4];
  void first; void third;
  // TODO: Retourne [first, third]
  return undefined;
}

/**
 * Array rest
 * @returns {[number, number[]]}
 */
export function destruct6() {
  const [head, ...tail] = [1, 2, 3, 4];
  void head; void tail;
  // TODO: Retourne [head, tail]
  return undefined;
}

/**
 * Object rest
 * @returns {[number, object]}
 */
export function destruct7() {
  const { a, ...rest } = { a: 1, b: 2, c: 3 };
  void a; void rest;
  // TODO: Retourne [a, rest]
  return undefined;
}

/**
 * null vs undefined
 * @returns {[number, null]}
 */
export function destruct8() {
  const { a = 1, b = 2 } = { a: undefined, b: null };
  void a; void b;
  // TODO: Retourne [a, b]
  return undefined;
}
