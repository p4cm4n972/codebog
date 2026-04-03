/**
 * Ex02 - Explicit Binding
 * call, apply et bind
 */

/**
 * call: fn.call(thisArg, arg1, arg2)
 * @returns {string}
 */
export function explicit1() {
  function greet(greeting) {
    return `${greeting}, ${this.name}`;
  }
  const person = { name: "Alice" };
  // TODO: Retourne greet.call(person, "Hello")
  return undefined;
}

/**
 * apply: fn.apply(thisArg, [args])
 * @returns {string}
 */
export function explicit2() {
  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }
  const person = { name: "Bob" };
  // TODO: Retourne greet.apply(person, ["Hi", "!"])
  return undefined;
}

/**
 * bind gagne sur call
 * @returns {string}
 */
export function explicit3() {
  function greet() {
    return `Hello, ${this.name}`;
  }
  const person = { name: "Charlie" };
  const bound = greet.bind(person);
  const otherPerson = { name: "Dave" };
  // TODO: Retourne bound.call(otherPerson)
  return undefined;
}

/**
 * bind ne peut pas être re-bind
 * @returns {string}
 */
export function explicit4() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const bound = obj.greet.bind({ name: "bound" });
  const reBound = bound.bind({ name: "rebound" });
  // TODO: Retourne reBound()
  return undefined;
}
