import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for async local storage with IndexedDB
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {[*, function, {isLoading: boolean, error: Object|null}]}
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadFromStorage = async () => {
      try {
        setIsLoading(true);
        const db = await openDB();
        const value = await getFromDB(db, key);
        if (value !== undefined) {
          setStoredValue(value);
        }
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to load from storage',
          code: 'LOAD_ERROR',
          originalError: err
        });
        console.error('Storage load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromStorage();
  }, [key]);

  // Save to IndexedDB when value changes
  const setValue = useCallback(
    async (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        const db = await openDB();
        await putInDB(db, key, valueToStore);
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to save to storage',
          code: 'SAVE_ERROR',
          originalError: err
        });
        console.error('Storage save error:', err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, { isLoading, error }];
};

// IndexedDB helpers
const DB_NAME = 'TodoDB';
const DB_VERSION = 1;
const STORE_NAME = 'todos';

const openDB = () => {
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

const getFromDB = (db, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const putInDB = (db, key, value) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};