import React from 'react';
import { useTodos } from '../../context/TodoContext';
import styles from './TodoForm.module.css';

/**
 * TodoForm component for adding new todos
 * @returns {JSX.Element}
 */
const TodoForm = () => {
  const { addTodo } = useTodos();
  const [input, setInput] = React.useState('');

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim());
      setInput('');
    }
  }, [input, addTodo]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label htmlFor="todo-input" className={styles.label}>
        Add a new todo:
      </label>
      <input
        id="todo-input"
        type="text"
        placeholder="Enter todo text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={styles.input}
        maxLength={200}
        aria-describedby="todo-help"
      />
      <span id="todo-help" className={styles.help}>
        Max 200 characters
      </span>
      <button type="submit" className={styles.button}>
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;