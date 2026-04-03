/**
 * Ex02 - Symbols
 * Well-known symbols, Symbol.iterator
 */

/**
 * Création et type
 * @returns {[string, string]}
 */
export function symbol1() {
  const sym = Symbol("description");
  void sym;
  // TODO: Retourne [typeof sym, sym.toString()]
  return undefined;
}

/**
 * Symbol.toStringTag
 * @returns {string}
 */
export function symbol2() {
  const obj = {
    [Symbol.toStringTag]: "MyObject"
  };
  void obj;
  // TODO: Retourne Object.prototype.toString.call(obj)
  return undefined;
}

/**
 * Symbol.iterator
 * @returns {number[]}
 */
export function symbol3() {
  const obj = {
    data: [1, 2, 3],
    [Symbol.iterator]() {
      let index = 0;
      const data = this.data;
      return {
        next() {
          if (index < data.length) {
            return { value: data[index++], done: false };
          }
          return { done: true };
        }
      };
    }
  };
  void obj;
  // TODO: Retourne [...obj]
  return undefined;
}

/**
 * Symbol.for (global registry)
 * @returns {[boolean, boolean]}
 */
export function symbol4() {
  const sym1 = Symbol.for("shared");
  const sym2 = Symbol.for("shared");
  const sym3 = Symbol("shared");
  void sym1; void sym2; void sym3;
  // TODO: Retourne [sym1 === sym2, sym1 === sym3]
  return undefined;
}

/**
 * Symbol.keyFor
 * @returns {string}
 */
export function symbol5() {
  const sym = Symbol.for("test");
  void sym;
  // TODO: Retourne Symbol.keyFor(sym)
  return undefined;
}
