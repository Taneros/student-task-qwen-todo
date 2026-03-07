import React from 'react';
import { useTodos } from '../context/TodoContext';
import styles from './TodoItem.module.css';

/**
 * TodoItem component for individual todo display
 * @param {Object} props
 * @param {import('../../context/TodoContext').Todo} props.todo
 * @returns {JSX.Element}
 */
const TodoItem = React.memo(({ todo }) => {
  const { updateTodo, deleteTodo } = useTodos();

  const handleToggle = React.useCallback(() => {
    updateTodo(todo.id, { completed: !todo.completed });
  }, [todo.id, todo.completed, updateTodo]);

  const handleDelete = React.useCallback(() => {
    deleteTodo(todo.id);
  }, [todo.id, deleteTodo]);

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        className={styles.checkbox}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span className={`${styles.text} ${todo.completed ? styles.completed : ''}`}>
        {todo.text}
      </span>
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