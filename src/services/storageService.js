// IndexedDB service for storage abstraction
import { DATABASE } from '../constants/constants';

const DB_NAME = DATABASE.NAME;
const DB_VERSION = DATABASE.VERSION;
const STORE_NAME = DATABASE.STORE_NAME;

/**
 * Open IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get value from IndexedDB
 * @param {IDBDatabase} db
 * @param {string} key
 * @returns {Promise<*>}
 */
export const getFromDB = (db, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Put value in IndexedDB
 * @param {IDBDatabase} db
 * @param {string} key
 * @param {*} value
 * @returns {Promise<void>}
 */
export const putInDB = (db, key, value) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Load data from storage
 * @param {string} key
 * @param {*} defaultValue
 * @returns {Promise<*>}
 */
export const loadFromStorage = async (key, defaultValue) => {
  try {
    const db = await openDB();
    const value = await getFromDB(db, key);
    return value !== undefined ? value : defaultValue;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    throw error;
  }
};

/**
 * Save data to storage
 * @param {string} key
 * @param {*} value
 * @returns {Promise<void>}
 */
export const saveToStorage = async (key, value) => {
  try {
    const db = await openDB();
    await putInDB(db, key, value);
  } catch (error) {
    console.error('Failed to save to storage:', error);
    throw error;
  }
};