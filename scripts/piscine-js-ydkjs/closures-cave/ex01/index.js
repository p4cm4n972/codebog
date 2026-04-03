/**
 * Ex01 - Loop Closure Trap
 * Le piège classique des closures dans les boucles
 */

/**
 * Le piège : var dans une boucle
 * @returns {number[]}
 */
export function loopTrap1() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    funcs.push(function() {
      return i;
    });
  }
  // TODO: Retourne funcs.map(f => f())
  return undefined;
}

/**
 * Solution avec let
 * @returns {number[]}
 */
export function loopFixed1() {
  const funcs = [];
  for (let i = 0; i < 3; i++) {
    funcs.push(function() {
      return i;
    });
  }
  // TODO: Retourne funcs.map(f => f())
  return undefined;
}

/**
 * Solution IIFE (pre-ES6)
 * @returns {number[]}
 */
export function loopFixed2() {
  const funcs = [];
  for (var i = 0; i < 3; i++) {
    (function(j) {
      funcs.push(function() {
        return j;
      });
    })(i);
  }
  // TODO: Retourne funcs.map(f => f())
  return undefined;
}

/**
 * Cas particulier avec this.index
 * @returns {number[]}
 */
export function loopTrap2() {
  const buttons = [];
  for (var i = 0; i < 3; i++) {
    buttons.push({
      index: i,
      click: function() {
        return this.index;
      }
    });
  }
  // TODO: Retourne buttons.map(b => b.click())
  return undefined;
}
