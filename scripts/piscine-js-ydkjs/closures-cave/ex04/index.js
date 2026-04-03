/**
 * Ex04 - Factory Functions
 * Créer des objets avec état via factories
 */

/**
 * Crée une stack (pile) avec API fluent
 * @returns {object}
 */
export function createStack() {
  const items = [];

  // TODO: Retourne un objet avec:
  // - push(item): ajoute item et retourne this
  // - pop(): retire et retourne le dernier élément
  // - peek(): retourne le dernier élément sans le retirer
  // - size(): retourne items.length
  // - isEmpty(): retourne items.length === 0
  return undefined;
}

/**
 * Teste la stack
 * @returns {[number, number, number, undefined]}
 */
export function testStack() {
  const stack = createStack();
  stack.push(1).push(2).push(3);
  const popped = stack.pop();
  const peeked = stack.peek();
  const size = stack.size();
  const directItems = stack.items;  // devrait être undefined
  // TODO: Retourne [popped, peeked, size, directItems]
  return undefined;
}
