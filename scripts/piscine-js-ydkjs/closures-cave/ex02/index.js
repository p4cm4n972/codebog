/**
 * Ex02 - Module Pattern
 * Créer des modules avec variables privées
 */

/**
 * Crée un module avec état privé
 * @returns {object}
 */
export function createModule() {
  // Variables privées
  let privateData = 0;
  const privateSecret = "hidden";

  // Fonction privée
  function privateIncrement() {
    privateData++;
  }

  // TODO: Retourne un objet avec:
  // - increment(): appelle privateIncrement()
  // - getCount(): retourne privateData
  return undefined;
}

/**
 * Teste le module pattern
 * @returns {[number, undefined, undefined]}
 */
export function testModule() {
  const mod = createModule();
  mod.increment();
  mod.increment();
  const count = mod.getCount();
  const secret = mod.privateSecret;  // devrait être undefined
  const data = mod.privateData;      // devrait être undefined
  // TODO: Retourne [count, secret, data]
  return undefined;
}
