import React from 'react';
import { useTodos } from '../context/TodoContext';
import { useToast } from '../context/ToastContext';
import { getDueDateStatus } from '../utils/dateUtils';
import styles from './TodoItem.module.css';

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * TodoItem component for individual todo display
 * @param {Object} props
 * @param {import('../../context/TodoContext').Todo} props.todo
 * @returns {JSX.Element}
 */
const TodoItem = React.memo(({ todo }) => {
  const { updateTodo, deleteTodo, undoDeleteTodo } = useTodos();
  const { addToast } = useToast();

  const handleToggle = React.useCallback(() => {
    updateTodo(todo.id, { completed: !todo.completed });
  }, [todo.id, todo.completed, updateTodo]);

  const handleDelete = React.useCallback(() => {
    // Move to temporary deleted state
    deleteTodo(todo.id);

    // Show undo toast
    addToast(
      `"${todo.text.length > 30 ? todo.text.substring(0, 30) + '...' : todo.text}" was deleted`,
      'Undo',
      () => undoDeleteTodo(todo.id)
    );
  }, [todo.id, todo.text, deleteTodo, undoDeleteTodo, addToast]);

  const dueDateStatus = getDueDateStatus(todo.dueDate);
  const formattedDate = formatDate(todo.dueDate);

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className={styles.checkbox}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <div className={styles.content}>
        <span className={`${styles.text} ${todo.completed ? styles.completed : ''}`}>
          {todo.text}
        </span>
        {formattedDate && (
          <span className={`${styles.dueDate} ${styles[dueDateStatus] || ''}`}>
            Due: {formattedDate}
          </span>
        )}
      </div>
      <button
        onClick={handleDelete}
        className={styles.deleteBtn}
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </li>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;