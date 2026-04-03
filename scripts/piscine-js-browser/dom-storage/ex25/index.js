/**
 * Ex25 - IndexedDB
 * Utiliser IndexedDB pour le stockage structuré
 */

/**
 * Ouvre une base de données IndexedDB
 * @param {string} name - Nom de la base
 * @param {number} version - Version
 * @param {Function} onUpgrade - Callback(db) pour setup
 * @returns {Promise<IDBDatabase>} Base de données
 */
export function openDatabase(name, version, onUpgrade) {
  void name;
  void version;
  void onUpgrade;
  // TODO: indexedDB.open avec Promises
  return undefined;
}

/**
 * Crée un object store si n'existe pas
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @param {Object} options - { keyPath, autoIncrement }
 * @returns {IDBObjectStore} Store créé
 */
export function createStore(db, storeName, options = {}) {
  void db;
  void storeName;
  void options;
  // TODO: createObjectStore
  return undefined;
}

/**
 * Ajoute ou met à jour un enregistrement
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @param {Object} data - Données à stocker
 * @returns {Promise<*>} Clé de l'enregistrement
 */
export function put(db, storeName, data) {
  void db;
  void storeName;
  void data;
  // TODO: transaction + store.put
  return undefined;
}

/**
 * Récupère un enregistrement par clé
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @param {*} key - Clé de l'enregistrement
 * @returns {Promise<*>} Données
 */
export function get(db, storeName, key) {
  void db;
  void storeName;
  void key;
  // TODO: transaction + store.get
  return undefined;
}

/**
 * Récupère tous les enregistrements
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @returns {Promise<*[]>} Tableau de données
 */
export function getAll(db, storeName) {
  void db;
  void storeName;
  // TODO: store.getAll
  return undefined;
}

/**
 * Supprime un enregistrement
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @param {*} key - Clé à supprimer
 * @returns {Promise<void>}
 */
export function remove(db, storeName, key) {
  void db;
  void storeName;
  void key;
  // TODO: store.delete
  return undefined;
}

/**
 * Vide un store
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @returns {Promise<void>}
 */
export function clearStore(db, storeName) {
  void db;
  void storeName;
  // TODO: store.clear
  return undefined;
}

/**
 * Recherche par index
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @param {string} indexName - Nom de l'index
 * @param {*} value - Valeur à chercher
 * @returns {Promise<*[]>} Résultats
 */
export function findByIndex(db, storeName, indexName, value) {
  void db;
  void storeName;
  void indexName;
  void value;
  // TODO: index.getAll(value)
  return undefined;
}

/**
 * Crée un wrapper pour un store
 * @param {IDBDatabase} db - Base de données
 * @param {string} storeName - Nom du store
 * @returns {Object} { put, get, getAll, delete, clear }
 */
export function createStoreWrapper(db, storeName) {
  void db;
  void storeName;
  // TODO: Retourner un objet avec les méthodes CRUD
  return undefined;
}

/**
 * Supprime une base de données
 * @param {string} name - Nom de la base
 * @returns {Promise<void>}
 */
export function deleteDatabase(name) {
  void name;
  // TODO: indexedDB.deleteDatabase
  return undefined;
}
