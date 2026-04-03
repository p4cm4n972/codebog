/**
 * Ex00 - Default Binding
 * Comprendre le binding par défaut de this
 */

/**
 * Mode sloppy: this === globalThis
 * @returns {boolean}
 */
export function default1() {
  function showThis() {
    return this;
  }
  // TODO: Retourne showThis() === globalThis
  return undefined;
}

/**
 * Mode strict: this === undefined
 * @returns {undefined}
 */
export function default2() {
  "use strict";
  function showThis() {
    return this;
  }
  // TODO: Retourne showThis()
  return "placeholder";
}

/**
 * Arrow function hérite this du scope parent
 * @returns {boolean}
 */
export function default3() {
  const arrow = () => this;
  // TODO: Retourne arrow() === globalThis
  return undefined;
}
