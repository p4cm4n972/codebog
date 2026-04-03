/**
 * Ex01 - Spread & Rest
 * Spread operator dans différents contextes
 */

/**
 * Fusion de tableaux
 * @returns {number[]}
 */
export function spread1() {
  const arr1 = [1, 2];
  const arr2 = [3, 4];
  void arr1; void arr2;
  // TODO: Retourne [...arr1, ...arr2]
  return undefined;
}

/**
 * Fusion d'objets
 * @returns {object}
 */
export function spread2() {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { b: 3, c: 4 };
  void obj1; void obj2;
  // TODO: Retourne { ...obj1, ...obj2 }
  return undefined;
}

/**
 * Spread sur string
 * @returns {string[]}
 */
export function spread3() {
  const str = "hello";
  void str;
  // TODO: Retourne [...str]
  return undefined;
}

/**
 * Rest parameters
 * @returns {number}
 */
export function spread4() {
  function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
  }
  // TODO: Retourne sum(1, 2, 3, 4)
  return undefined;
}

/**
 * Shallow copy
 * @returns {number}
 */
export function spread5() {
  const original = { a: 1, nested: { b: 2 } };
  const copy = { ...original };
  copy.nested.b = 999;
  // TODO: Retourne original.nested.b
  return undefined;
}

/**
 * Objet non-iterable
 * @returns {string}
 */
export function spread6() {
  const obj = { length: 3, 0: "a", 1: "b", 2: "c" };
  try {
    return [...obj];
  } catch (e) {
    // TODO: Retourne "TypeError"
    return undefined;
  }
}
