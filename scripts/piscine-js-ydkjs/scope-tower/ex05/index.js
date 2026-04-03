/**
 * Ex05 - Dynamic Scope Dangers (Legacy)
 * Comprendre les dangers et les alternatives sûres
 */

/**
 * Liste les dangers de l'exécution dynamique de code
 * @returns {string[]}
 */
export function explainDynamicScopeDangers() {
  // TODO: Retourne un array avec les 5 dangers :
  // 1. "Injection de code malveillant possible"
  // 2. "Modification imprévue du scope parent"
  // 3. "Performance dégradée (pas d'optimisation par le moteur)"
  // 4. "Code difficile à analyser et débugger"
  // 5. "Impossible à typer statiquement"
  return undefined;
}

/**
 * Alternatives sûres aux patterns dangereux
 * @returns {object}
 */
export function safeAlternatives() {
  // TODO: Retourne un objet avec les alternatives sûres :
  // {
  //   "parser JSON": "JSON.parse()",
  //   "templates": "Template literals ou moteur de template",
  //   "configuration": "Objets/Maps avec clés prédéfinies",
  //   "dispatch dynamique": "Pattern Strategy avec Map de fonctions"
  // }
  return undefined;
}

/**
 * Pattern Strategy - alternative sûre au code dynamique
 * @returns {number}
 */
export function safeDispatch() {
  // TODO: Implémente le pattern Strategy avec une Map de handlers
  // const handlers = new Map([
  //   ["add", (a, b) => a + b],
  //   ["multiply", (a, b) => a * b],
  //   ["subtract", (a, b) => a - b]
  // ]);
  //
  // function execute(operation, a, b) {
  //   const handler = handlers.get(operation);
  //   if (!handler) throw new Error(`Unknown operation: ${operation}`);
  //   return handler(a, b);
  // }
  //
  // return execute("add", 5, 3); // Doit retourner 8
  return undefined;
}
