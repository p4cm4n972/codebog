/**
 * Ex02 - Microtasks vs Macrotasks
 * Promise.resolve vs setTimeout
 */

/**
 * Promise vs setTimeout
 * @returns {Promise<string[]>}
 */
export async function micro1() {
  const result = [];

  result.push("1");
  setTimeout(() => result.push("timeout"), 0);
  Promise.resolve().then(() => result.push("promise"));
  result.push("2");

  await new Promise(r => setTimeout(r, 10));
  // TODO: Retourne result
  return undefined;
}

/**
 * Chaîne de microtasks
 * @returns {Promise<string[]>}
 */
export async function micro2() {
  const result = [];

  setTimeout(() => result.push("timeout 1"), 0);

  Promise.resolve()
    .then(() => result.push("promise 1"))
    .then(() => result.push("promise 2"));

  setTimeout(() => result.push("timeout 2"), 0);

  Promise.resolve().then(() => result.push("promise 3"));

  result.push("sync");

  await new Promise(r => setTimeout(r, 10));
  // TODO: Retourne result
  return undefined;
}

/**
 * async/await et microtasks
 * @returns {Promise<string[]>}
 */
export async function micro3() {
  const result = [];

  async function async1() {
    result.push("async1 start");
    await async2();
    result.push("async1 end");
  }

  async function async2() {
    result.push("async2");
  }

  result.push("script start");
  setTimeout(() => result.push("timeout"), 0);
  async1();

  new Promise(resolve => {
    result.push("promise1");
    resolve();
  }).then(() => {
    result.push("promise2");
  });

  result.push("script end");

  await new Promise(r => setTimeout(r, 10));
  // TODO: Retourne result
  return undefined;
}
