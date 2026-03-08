import React from 'react';
import { useTodos } from '../../context/TodoContext';
import { validateTodoText, sanitizeInput } from '../../utils/validation';
import styles from './TodoForm.module.css';

/**
 * TodoForm component for adding new todos
 * @returns {JSX.Element}
 */
const TodoForm = () => {
  const { addTodo } = useTodos();
  const [input, setInput] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [validationError, setValidationError] = React.useState(null);

  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();
    const error = validateTodoText(input);
    if (error) {
      setValidationError(error);
      return;
    }
    addTodo(sanitizeInput(input), dueDate || null);
    setInput('');
    setDueDate('');
    setValidationError(null);
  }, [input, dueDate, addTodo]);

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {validationError && (
        <div className={styles.error} role="alert">
          {validationError}
        </div>
      )}
      <label htmlFor="todo-input" className={styles.label}>
        Add a new todo:
      </label>
      <div className={styles.inputGroup}>
        <div className={styles.inputWrapper}>
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
        </div>
        <div className={styles.inputWrapper}>
          <label htmlFor="due-date" className={styles.label}>
            Due date (optional):
          </label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
      <button type="submit" className={styles.button}>
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;