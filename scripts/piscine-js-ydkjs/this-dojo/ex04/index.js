/**
 * Ex04 - Arrow Functions
 * this lexical, pas de binding propre
 */

/**
 * Arrow vs Regular method
 * @returns {[string, undefined]}
 */
export function arrow1() {
  const obj = {
    name: "obj",
    regular() {
      return this.name;
    },
    arrow: () => this.name
  };
  // TODO: Retourne [obj.regular(), obj.arrow()]
  return undefined;
}

/**
 * Arrow dans une méthode capture this
 * @returns {string}
 */
export function arrow2() {
  const obj = {
    name: "obj",
    getGreeter() {
      return () => `Hello, ${this.name}`;
    }
  };
  const greeter = obj.getGreeter();
  // TODO: Retourne greeter()
  return undefined;
}

/**
 * call n'affecte pas arrow
 * @returns {string}
 */
export function arrow3() {
  const obj = {
    name: "obj",
    getGreeter() {
      return () => `Hello, ${this.name}`;
    }
  };
  const greeter = obj.getGreeter();
  // TODO: Retourne greeter.call({ name: "other" })
  return undefined;
}

/**
 * Arrow dans objet imbriqué
 * @returns {string}
 */
export function arrow4() {
  const obj = {
    name: "obj",
    nested: {
      name: "nested",
      getArrow() {
        return () => this.name;
      }
    }
  };
  // TODO: Retourne obj.nested.getArrow()()
  return undefined;
}
