import React from 'react';
import { TodoProvider } from './context/TodoContext';
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
      <TodoProvider>
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
      </TodoProvider>
    </ErrorBoundary>
  );
}

export default App;
