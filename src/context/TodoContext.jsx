import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * @typedef {Object} Todo
 * @property {number} id - Unique identifier
 * @property {string} text - Todo text
 * @property {boolean} completed - Completion status
 * @property {string|null} dueDate - ISO date string or null
 * @property {string} createdAt - ISO creation timestamp
 */

const TodoContext = React.createContext(null);

/**
 * TodoProvider component for CRUD operations only
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const TodoProvider = ({ children }) => {
  const initialTodos = React.useMemo(() => [], []);
  const [todos, setTodos, { isLoading: todosLoading, error: todosError }] = useLocalStorage('todos', initialTodos);

  const addTodo = React.useCallback((text, dueDate = null) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [newTodo, ...prev]);
  }, [setTodos]);

  const deleteTodo = React.useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  const updateTodo = React.useCallback((id, updates) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  }, [setTodos]);

  const toggleComplete = React.useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);

  const value = React.useMemo(() => ({
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleComplete,
    isLoading: todosLoading,
    error: todosError,
  }), [todos, addTodo, deleteTodo, updateTodo, toggleComplete, todosLoading, todosError]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Custom hook to use TodoContext
 * @returns {{todos: Todo[], addTodo: Function, deleteTodo: Function, updateTodo: Function, toggleComplete: Function, isLoading: boolean, error: Object|null}}
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTodos = () => {
  const context = React.useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};