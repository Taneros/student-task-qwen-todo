import React from 'react';
import { useTodos } from '../../context/TodoContext';
import { useTodoFilters } from '../../hooks/useTodoFilters';
import TodoItem from '../TodoItem';
import styles from './TodoList.module.css';

/**
 * TodoList component displaying filtered todos
 * @returns {JSX.Element}
 */
const TodoList = () => {
  const { todos, filters } = useTodos();
  const filteredTodos = useTodoFilters(todos, filters);

  if (filteredTodos.length === 0) {
    return (
      <div className={styles.empty}>
        {todos.length === 0 ? 'No todos yet. Add one above!' : 'No todos match your filters.'}
      </div>
    );
  }

  return (
    <ul className={styles.list} role="list">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
};

export default TodoList;