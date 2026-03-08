// src/context/UndoContext.jsx
import React from 'react';
import { useUndoStack } from '../hooks/useUndoStack';
import { useTodos } from './TodoContext';

const UndoContext = React.createContext(null);

/**
 * UndoProvider component for undo functionality
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const UndoProvider = ({ children }) => {
  const { addTodo } = useTodos();
  const undoStack = useUndoStack();

  const undoDeleteTodo = React.useCallback((id) => {
    const deletedTodo = undoStack.stack.get(id);
    if (deletedTodo) {
      // Restore the todo
      addTodo(deletedTodo.text, deletedTodo.dueDate);
      undoStack.remove(id);
    }
  }, [undoStack, addTodo]);

  const value = React.useMemo(() => ({
    undoDeleteTodo,
    deletedTodos: undoStack.stack,
  }), [undoDeleteTodo, undoStack.stack]);

  return (
    <UndoContext.Provider value={value}>
      {children}
    </UndoContext.Provider>
  );
};

/**
 * Custom hook to use UndoContext
 * @returns {{undoDeleteTodo: Function, deletedTodos: Map}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useUndo = () => {
  const context = React.useContext(UndoContext);
  if (!context) {
    throw new Error('useUndo must be used within an UndoProvider');
  }
  return context;
};