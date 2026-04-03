/**
 * Ex05 - Binding Priority
 * new > explicit > implicit > default
 */

/**
 * new vs implicit
 * @returns {string}
 */
export function priority1() {
  function Person(name) {
    this.name = name;
  }
  const obj = {
    name: "obj",
    Person: Person
  };
  const p = new obj.Person("Alice");
  // TODO: Retourne p.name
  return undefined;
}

/**
 * bind vs implicit
 * @returns {string}
 */
export function priority2() {
  function greet() {
    return `Hello, ${this.name}`;
  }
  const obj = { name: "obj" };
  const other = { name: "other" };
  const bound = greet.bind(other);
  obj.greet = bound;
  // TODO: Retourne obj.greet()
  return undefined;
}

/**
 * new vs bind
 * @returns {string}
 */
export function priority3() {
  function Person(name) {
    this.name = name;
  }
  const bound = Person.bind({ name: "bound" });
  const p = new bound("Alice");
  // TODO: Retourne p.name
  return undefined;
}

/**
 * explicit vs implicit
 * @returns {string}
 */
export function priority4() {
  function greet() {
    return `Hello, ${this.name}`;
  }
  const obj = {
    name: "obj",
    greet: greet
  };
  // TODO: Retourne obj.greet.call({ name: "call" })
  return undefined;
}
