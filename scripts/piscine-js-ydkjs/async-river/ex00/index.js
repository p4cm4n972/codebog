/**
 * Ex00 - Call Stack
 * Exécution synchrone, pile d'appels
 */

/**
 * Ordre d'exécution basique
 * @returns {string[]}
 */
export function stack1() {
  const result = [];

  function first() {
    result.push("first start");
    second();
    result.push("first end");
  }

  function second() {
    result.push("second");
  }

  result.push("main start");
  first();
  result.push("main end");

  // TODO: Retourne result
  return undefined;
}

/**
 * Récursion et call stack
 * @returns {(number|string)[]}
 */
export function stack2() {
  const result = [];

  function recursive(n) {
    if (n <= 0) return;
    result.push(n);
    recursive(n - 1);
    result.push(`done ${n}`);
  }

  recursive(3);
  // TODO: Retourne result
  return undefined;
}
