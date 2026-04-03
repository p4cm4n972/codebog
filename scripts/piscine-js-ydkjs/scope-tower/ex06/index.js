/**
 * Ex06 - Scope Chain
 * Comprendre la chaîne de scope et la résolution multi-niveaux
 */

const globalVar = "global";

/**
 * Résolution sur plusieurs niveaux de scope
 * @returns {string[]}
 */
export function chain1() {
  const level1 = "level1";

  function outer() {
    const level2 = "level2";

    function inner() {
      const level3 = "level3";
      return [globalVar, level1, level2, level3];
    }

    return inner();
  }

  // TODO: Retourne outer()
  return undefined;
}

/**
 * Scope lexical vs dynamique
 * @returns {number}
 */
export function chain2() {
  const x = 1;

  function a() {
    const x = 2;
    return b();
  }

  function b() {
    return x;  // Quel x ? Scope lexical = où b est définie
  }

  // TODO: Retourne a()
  return undefined;
}

/**
 * Closure qui capture une variable privée
 * @returns {string}
 */
export function chain3() {
  function outer() {
    const secret = "hidden";

    return {
      getSecret: () => secret
    };
  }

  const obj = outer();
  // TODO: Retourne obj.getSecret()
  return undefined;
}
