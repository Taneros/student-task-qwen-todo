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

/**
 * @typedef {Object} TodoState
 * @property {Todo[]} todos - Array of todos
 * @property {Object} filters - Current filters
 * @property {string} filters.search - Search query
 * @property {'all'|'active'|'completed'} filters.status - Status filter
 * @property {'created'|'name'|'dueDate'} filters.sortBy - Sort field
 * @property {'asc'|'desc'} filters.sortOrder - Sort order
 */

/**
 * @typedef {Object} TodoActions
 * @property {(text: string, dueDate?: string|null) => void} addTodo - Add new todo
 * @property {(id: number) => void} deleteTodo - Delete todo by id
 * @property {(id: number, updates: Partial<Todo>) => void} updateTodo - Update todo
 * @property {(filters: Partial<TodoState['filters']>) => void} setFilters - Update filters
 */

const TodoContext = React.createContext(null);

/**
 * Singleton TodoProvider component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const TodoProvider = ({ children }) => {
  const initialTodos = React.useMemo(() => [], []);
  const [todos, setTodos, { isLoading: todosLoading, error: todosError }] = useLocalStorage('todos', initialTodos);
  const [filters, setFilters] = React.useState({
    search: '',
    status: 'all', // 'all', 'active', 'completed'
    sortBy: 'created', // 'created', 'name', 'dueDate'
    sortOrder: 'asc'
  });

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
    updateTodo(id, { completed: !todos.find(t => t.id === id)?.completed });
  }, [todos, updateTodo]);

  const value = React.useMemo(() => ({
    todos,
    filters,
    setFilters,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleComplete,
    isLoading: todosLoading,
    error: todosError,
  }), [todos, filters, addTodo, deleteTodo, updateTodo, toggleComplete, todosLoading, todosError]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Custom hook to use TodoContext
 * @returns {TodoState & TodoActions & {isLoading: boolean, error: Object|null}}
 */
export const useTodos = () => {
  const context = React.useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};