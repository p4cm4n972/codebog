/**
 * Ex05 - WeakMap & WeakSet
 * Références faibles, garbage collection
 */

/**
 * WeakMap basique
 * @returns {string}
 */
export function weak1() {
  const wm = new WeakMap();
  const obj = { name: "test" };
  wm.set(obj, "secret data");

  const result = wm.get(obj);
  void result;
  // TODO: Retourne result
  return undefined;
}

/**
 * Clés doivent être des objets
 * @returns {string}
 */
export function weak2() {
  const wm = new WeakMap();
  try {
    wm.set("string key", "value");
    return "ok";
  } catch (e) {
    // TODO: Retourne "TypeError"
    return undefined;
  }
}

/**
 * Pas d'itération
 * @returns {[string, string, string]}
 */
export function weak3() {
  const wm = new WeakMap();
  const obj = { id: 1 };
  wm.set(obj, { privateData: "secret" });

  void wm; void obj;
  // TODO: Retourne [typeof wm.keys, typeof wm.values, typeof wm.entries]
  return undefined;
}

/**
 * Use case: données privées
 * @returns {[string, number, undefined]}
 */
export function weak4() {
  const privateData = new WeakMap();

  class Person {
    constructor(name, age) {
      privateData.set(this, { name, age });
    }
    getName() {
      return privateData.get(this).name;
    }
    getAge() {
      return privateData.get(this).age;
    }
  }

  const p = new Person("Alice", 30);
  void p;
  // TODO: Retourne [p.getName(), p.getAge(), p.name]
  return undefined;
}

/**
 * WeakSet
 * @returns {[boolean, boolean]}
 */
export function weak5() {
  const ws = new WeakSet();
  const obj = { id: 1 };
  ws.add(obj);

  void ws; void obj;
  // TODO: Retourne [ws.has(obj), ws.has({ id: 1 })]
  return undefined;
}
