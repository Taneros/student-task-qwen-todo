import React from 'react';
import { TodoProvider, useTodos } from './context/TodoContext';
import { FilterProvider } from './context/FilterContext';
import { UndoProvider } from './context/UndoContext';
import { ToastProvider } from './context/ToastContext';
import TodoForm from './components/TodoForm/TodoForm';
import TodoList from './components/TodoList/TodoList';
import TodoFilters from './components/TodoFilters/TodoFilters';
import ErrorBoundary from './utils/ErrorBoundary';
import './App.css';

/**
 * Main App component
 * @returns {JSX.Element}
 */
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <TodoProvider>
          <FilterProvider>
            <UndoProvider>
              <AppContent />
            </UndoProvider>
          </FilterProvider>
        </TodoProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

/**
 * App content with loading and error handling
 * @returns {JSX.Element}
 */
function AppContent() {
  const { isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Todo App</h1>
        </header>
        <main className="App-main">
          <div className="loading">Loading todos...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>My Todo App</h1>
        </header>
        <main className="App-main">
          <div className="error">
            <h2>Failed to load todos</h2>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Todo App</h1>
      </header>
      <main className="App-main">
        <TodoForm />
        <TodoFilters />
        <TodoList />
      </main>
    </div>
  );
}

export default App;
