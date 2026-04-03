/**
 * Ex04 - Proxy & Reflect
 * Intercepter les opérations sur les objets
 */

/**
 * Trap get avec valeur par défaut
 * @returns {[number, string]}
 */
export function proxy1() {
  const target = { a: 1, b: 2 };
  const handler = {
    get(target, prop) {
      return prop in target ? target[prop] : "default";
    }
  };
  const proxy = new Proxy(target, handler);
  void proxy;
  // TODO: Retourne [proxy.a, proxy.c]
  return undefined;
}

/**
 * Trap set avec validation
 * @returns {[number, string]}
 */
export function proxy2() {
  const target = { count: 0 };
  const handler = {
    set(target, prop, value) {
      if (prop === "count" && typeof value !== "number") {
        throw new TypeError("count must be a number");
      }
      target[prop] = value;
      return true;
    }
  };
  const proxy = new Proxy(target, handler);
  proxy.count = 5;
  try {
    proxy.count = "invalid";
    return "no error";
  } catch (e) {
    // TODO: Retourne [proxy.count, "TypeError"]
    return undefined;
  }
}

/**
 * Cacher des propriétés
 * @returns {[undefined, string, boolean]}
 */
export function proxy3() {
  const target = { secret: "hidden", public: "visible" };
  const handler = {
    get(target, prop) {
      if (prop === "secret") return undefined;
      return Reflect.get(target, prop);
    },
    has(target, prop) {
      if (prop === "secret") return false;
      return Reflect.has(target, prop);
    }
  };
  const proxy = new Proxy(target, handler);
  void proxy;
  // TODO: Retourne [proxy.secret, proxy.public, "secret" in proxy]
  return undefined;
}

/**
 * Trap apply (fonctions)
 * @returns {[number, number, number[][]]}
 */
export function proxy4() {
  const calls = [];
  const handler = {
    apply(target, thisArg, args) {
      calls.push(args);
      return Reflect.apply(target, thisArg, args);
    }
  };

  const sum = (a, b) => a + b;
  const proxy = new Proxy(sum, handler);

  const r1 = proxy(1, 2);
  const r2 = proxy(3, 4);
  void r1; void r2; void calls;

  // TODO: Retourne [r1, r2, calls]
  return undefined;
}
