import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFromStorage, saveToStorage } from '../services/storageService';

/**
 * Custom hook for async local storage with IndexedDB
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {[*, function, {isLoading: boolean, error: Object|null}]}
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);
  const storedValueRef = useRef(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const value = await loadFromStorage(key, initialValue);
        setStoredValue(value);
        storedValueRef.current = value;
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

    loadData();
  }, [key, initialValue]);

  // Save to storage when value changes
  const setValue = useCallback(
    async (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValueRef.current) : value;
        setStoredValue(valueToStore);
        storedValueRef.current = valueToStore;
        await saveToStorage(key, valueToStore);
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to save to storage',
          code: 'SAVE_ERROR',
          originalError: err
        });
        console.error('Storage save error:', err);
        // Revert local state on save failure
        setStoredValue(storedValueRef.current);
      }
    },
    [key]
  );

  return [storedValue, setValue, { isLoading, error }];
};