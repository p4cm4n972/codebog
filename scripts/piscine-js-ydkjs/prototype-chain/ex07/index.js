/**
 * Ex07 - Mixins & Composition
 * Alternatives à l'héritage classique
 */

/**
 * Object.assign pour mixer des comportements
 * @returns {[string, string]}
 */
export function mixin1() {
  const canWalk = {
    walk() {
      return `${this.name} walks`;
    }
  };

  const canSwim = {
    swim() {
      return `${this.name} swims`;
    }
  };

  function Duck(name) {
    this.name = name;
  }

  Object.assign(Duck.prototype, canWalk, canSwim);

  const d = new Duck("Donald");
  // TODO: Retourne [d.walk(), d.swim()]
  return undefined;
}

/**
 * Mixin avec état privé (factory)
 * @returns {number}
 */
export function mixin2() {
  const withCounter = (obj) => {
    let count = 0;
    obj.increment = () => ++count;
    obj.getCount = () => count;
    return obj;
  };

  const obj = withCounter({ name: "counter" });
  obj.increment();
  obj.increment();
  // TODO: Retourne obj.getCount()
  return undefined;
}

/**
 * Composition over inheritance
 * @returns {[string, string]}
 */
export function mixin3() {
  const createDog = (name) => {
    const state = { name };

    return {
      getName: () => state.name,
      bark: () => `${state.name} barks`,
      walk: () => `${state.name} walks`
    };
  };

  const dog = createDog("Rex");
  // TODO: Retourne [dog.getName(), dog.bark()]
  return undefined;
}
