/**
 * Ex06 - Lost this
 * Perte du contexte dans les callbacks
 */

/**
 * Méthode passée en callback (this perdu)
 * @returns {string}
 */
export function lost1() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const fn = obj.greet;
  // TODO: Retourne fn()
  return undefined;
}

/**
 * Fix avec bind
 * @returns {string}
 */
export function lost2() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const fn = obj.greet.bind(obj);
  // TODO: Retourne fn()
  return undefined;
}

/**
 * Fix avec arrow function wrapper
 * @returns {string}
 */
export function lost3() {
  const obj = {
    name: "obj",
    greet() {
      return `Hello, ${this.name}`;
    }
  };
  const fn = () => obj.greet();
  // TODO: Retourne fn()
  return undefined;
}

/**
 * setTimeout perd this
 * @returns {string}
 */
export function lost4() {
  const obj = {
    name: "obj",
    delayedGreet() {
      // Simule setTimeout synchrone
      const callback = function() {
        return `Hello, ${this.name}`;
      };
      return callback();
    }
  };
  // TODO: Retourne obj.delayedGreet()
  return undefined;
}

/**
 * Fix setTimeout avec arrow
 * @returns {string}
 */
export function lost5() {
  const obj = {
    name: "obj",
    delayedGreet() {
      // Arrow capture this de delayedGreet
      const callback = () => {
        return `Hello, ${this.name}`;
      };
      return callback();
    }
  };
  // TODO: Retourne obj.delayedGreet()
  return undefined;
}
