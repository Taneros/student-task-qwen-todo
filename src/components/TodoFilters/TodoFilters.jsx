import React from 'react';
import { useTodos } from '../../context/TodoContext';
import styles from './TodoFilters.module.css';

/**
 * TodoFilters component for filtering, searching, and sorting
 * @returns {JSX.Element}
 */
const TodoFilters = () => {
  const { filters, setFilters } = useTodos();

  const handleSearchChange = React.useCallback((e) => {
    setFilters({ search: e.target.value });
  }, [setFilters]);

  const handleStatusChange = React.useCallback((e) => {
    setFilters({ status: e.target.value });
  }, [setFilters]);

  const handleSortByChange = React.useCallback((e) => {
    setFilters({ sortBy: e.target.value });
  }, [setFilters]);

  const handleDueDateChange = React.useCallback((e) => {
    setFilters({ dueDate: e.target.value });
  }, [setFilters]);

  const handleSortOrderChange = React.useCallback((e) => {
    setFilters({ sortOrder: e.target.value });
  }, [setFilters]);

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="search" className={styles.label}>
          Search:
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search todos..."
          value={filters.search}
          onChange={handleSearchChange}
          className={styles.input}
        />
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="status" className={styles.label}>
          Status:
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={handleStatusChange}
          className={styles.select}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      <div className={styles.filterGroup}>
        <label htmlFor="dueDate" className={styles.label}>
          Due Date:
        </label>
        <select
          id="dueDate"
          value={filters.dueDate}
          onChange={handleDueDateChange}
          className={styles.select}
        >
          <option value="all">All</option>
          <option value="noDueDate">No Due Date</option>
          <option value="overdue">Overdue</option>
          <option value="dueToday">Due Today</option>
          <option value="dueThisWeek">Due This Week</option>
          <option value="upcoming">Upcoming</option>
        </select>
      </div>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={handleSortByChange}
          className={styles.select}
        >
          <option value="created">Created</option>
          <option value="name">Name</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="sortOrder" className={styles.label}>
          Order:
        </label>
        <select
          id="sortOrder"
          value={filters.sortOrder}
          onChange={handleSortOrderChange}
          className={styles.select}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default TodoFilters;