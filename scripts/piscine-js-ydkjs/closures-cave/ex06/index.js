/**
 * Ex06 - Partial Application
 * Fixer certains arguments d'une fonction
 */

/**
 * Partial application simple
 * @param {function} fn
 * @param {...*} fixedArgs
 * @returns {function}
 */
export function partial(fn, ...fixedArgs) {
  // TODO: Retourne une fonction qui accepte remainingArgs
  // et appelle fn(...fixedArgs, ...remainingArgs)
  return function(...remainingArgs) {
    return undefined;
  };
}

/**
 * Teste partial application
 * @returns {[string, string]}
 */
export function testPartial() {
  const greet = (greeting, punctuation, name) => {
    return `${greeting}, ${name}${punctuation}`;
  };

  const sayHello = partial(greet, "Hello", "!");
  const sayHi = partial(greet, "Hi");

  // TODO: Retourne [sayHello("Alice"), sayHi("?", "Bob")]
  return undefined;
}

/**
 * Partial avec placeholder
 * @param {function} fn
 * @param {...*} args
 * @returns {function}
 */
export function partialWithPlaceholder(fn, ...args) {
  const placeholder = partialWithPlaceholder._;

  // TODO: Retourne une fonction qui:
  // 1. Remplace les placeholders par les args fournis
  // 2. Ajoute les args restants à la fin
  return function(...supplied) {
    return undefined;
  };
}
partialWithPlaceholder._ = Symbol("placeholder");

/**
 * Teste partial avec placeholder
 * @returns {string}
 */
export function testPartialPlaceholder() {
  const _ = partialWithPlaceholder._;
  const greet = (a, b, c) => `${a}-${b}-${c}`;
  const fn = partialWithPlaceholder(greet, _, "middle", _);
  // TODO: Retourne fn("first", "last")
  return undefined;
}
