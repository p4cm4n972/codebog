/**
 * Ex01 - Implicit Binding
 * this = l'objet avant le point
 */

/**
 * Cas simple: obj.method()
 * @returns {string}
 */
export function implicit1() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  // TODO: Retourne obj.getName()
  return undefined;
}

/**
 * Perte du contexte: extraction de méthode
 * @returns {undefined}
 */
export function implicit2() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  const fn = obj.getName;
  // TODO: Retourne fn() - quel est this.name ?
  return "placeholder";
}

/**
 * Objet imbriqué: this = objet immédiat
 * @returns {string}
 */
export function implicit3() {
  const obj = {
    name: "outer",
    inner: {
      name: "inner",
      getName() {
        return this.name;
      }
    }
  };
  // TODO: Retourne obj.inner.getName()
  return undefined;
}

/**
 * Réassignation de méthode
 * @returns {string}
 */
export function implicit4() {
  const obj = {
    name: "obj",
    getName() {
      return this.name;
    }
  };
  const other = { name: "other" };
  other.fn = obj.getName;
  // TODO: Retourne other.fn()
  return undefined;
}
