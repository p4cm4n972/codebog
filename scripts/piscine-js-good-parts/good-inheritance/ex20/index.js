/**
 * Ex20 - Functional Inheritance
 * Pattern d'héritage fonctionnel de Crockford
 */

/**
 * Crée un objet base avec état privé
 * @param {Object} spec - { name }
 * @returns {Object} { getName, setName }
 */
export function createBase(spec) {
  void spec;
  // TODO: Créer un objet avec état privé via closure
  return undefined;
}

/**
 * Crée un animal avec héritage fonctionnel
 * @param {Object} spec - { name, sound }
 * @returns {Object} { getName, speak }
 */
export function createAnimal(spec) {
  void spec;
  // TODO: Créer animal avec speak() qui utilise sound
  return undefined;
}

/**
 * Crée un chien qui hérite d'animal
 * @param {Object} spec - { name, breed }
 * @returns {Object} Animal + { bark, getBreed }
 */
export function createDog(spec) {
  void spec;
  // TODO: Étendre createAnimal avec bark et getBreed
  return undefined;
}

/**
 * Crée un compte bancaire avec état privé
 * @param {Object} spec - { owner, initialBalance }
 * @returns {Object} { getOwner, getBalance, deposit, withdraw }
 */
export function createBankAccount(spec) {
  void spec;
  // TODO: Balance vraiment privée, withdraw retourne false si insuffisant
  return undefined;
}

/**
 * Crée un compte épargne (hérite de bankAccount)
 * @param {Object} spec - { owner, initialBalance, interestRate }
 * @returns {Object} BankAccount + { applyInterest, getInterestRate }
 */
export function createSavingsAccount(spec) {
  void spec;
  // TODO: Étendre createBankAccount avec intérêts
  return undefined;
}

/**
 * Crée un objet observable (peut être observé)
 * @returns {Object} { subscribe, notify, getValue, setValue }
 */
export function createObservable(initialValue) {
  void initialValue;
  // TODO: État privé avec liste d'observateurs
  return undefined;
}
