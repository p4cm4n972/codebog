/**
 * Ex01 - Event Loop Basics
 * setTimeout(fn, 0), macrotasks
 */

/**
 * setTimeout(fn, 0)
 * @returns {Promise<string[]>}
 */
export async function loop1() {
  const result = [];

  result.push("1");
  setTimeout(() => result.push("2"), 0);
  result.push("3");

  await new Promise(r => setTimeout(r, 10));
  // TODO: Retourne result
  return undefined;
}

/**
 * Plusieurs setTimeout
 * @returns {Promise<string[]>}
 */
export async function loop2() {
  const result = [];

  setTimeout(() => result.push("a"), 0);
  setTimeout(() => result.push("b"), 0);
  setTimeout(() => result.push("c"), 0);

  result.push("sync");

  await new Promise(r => setTimeout(r, 10));
  // TODO: Retourne result
  return undefined;
}

/**
 * Ordre par délai
 * @returns {Promise<string[]>}
 */
export async function loop3() {
  const result = [];

  setTimeout(() => result.push("timeout 100"), 100);
  setTimeout(() => result.push("timeout 0"), 0);
  setTimeout(() => result.push("timeout 50"), 50);

  result.push("sync");

  await new Promise(r => setTimeout(r, 150));
  // TODO: Retourne result
  return undefined;
}
