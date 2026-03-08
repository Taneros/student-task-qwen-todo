// src/hooks/useUndoStack.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing undo stack with automatic cleanup
 * @param {number} timeoutMs - Timeout in milliseconds before items expire
 * @returns {Object} Stack operations
 */
export const useUndoStack = (timeoutMs = 10000) => {
  const [stack, setStack] = useState(new Map());

  const add = useCallback((id, item) => {
    setStack(prev => new Map(prev).set(id, {
      ...item,
      expiresAt: Date.now() + timeoutMs
    }));
  }, [timeoutMs]);

  const remove = useCallback((id) => {
    setStack(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  }, []);

  // Auto-cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setStack(prev => {
        const now = Date.now();
        const newMap = new Map();
        for (const [id, item] of prev) {
          if (item.expiresAt > now) newMap.set(id, item);
        }
        return newMap;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return { stack, add, remove };
};