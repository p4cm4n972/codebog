/**
 * Ex03 - Iterators & Generators
 * Protocole d'itération, yield
 */

/**
 * Générateur simple
 * @returns {number[]}
 */
export function gen1() {
  function* simple() {
    yield 1;
    yield 2;
    yield 3;
  }
  void simple;
  // TODO: Retourne [...simple()]
  return undefined;
}

/**
 * return vs yield
 * @returns {number[]}
 */
export function gen2() {
  function* withReturn() {
    yield 1;
    yield 2;
    return 3;
  }
  void withReturn;
  // TODO: Retourne [...withReturn()]
  return undefined;
}

/**
 * Générateur range
 * @returns {number[]}
 */
export function gen3() {
  function* range(start, end) {
    for (let i = start; i <= end; i++) {
      yield i;
    }
  }
  void range;
  // TODO: Retourne [...range(5, 8)]
  return undefined;
}

/**
 * yield* (délégation)
 * @returns {number[]}
 */
export function gen4() {
  function* delegating() {
    yield 1;
    yield* [2, 3];
    yield 4;
  }
  void delegating;
  // TODO: Retourne [...delegating()]
  return undefined;
}

/**
 * Communication bidirectionnelle
 * @returns {[string, string, string]}
 */
export function gen5() {
  function* twoWay() {
    const x = yield "first";
    const y = yield x + " second";
    return y;
  }

  const gen = twoWay();
  const r1 = gen.next();
  const r2 = gen.next("received");
  const r3 = gen.next("final");
  void r1; void r2; void r3;

  // TODO: Retourne [r1.value, r2.value, r3.value]
  return undefined;
}
