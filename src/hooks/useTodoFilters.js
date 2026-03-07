import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { SEARCH } from '../constants/constants';

/**
 * Custom hook for optimized filtering, searching, and sorting
 * @param {import('../context/TodoContext').Todo[]} todos - Todos array
 * @param {import('../context/TodoContext').TodoState['filters']} filters - Filters object
 * @returns {import('../context/TodoContext').Todo[]} Filtered and sorted todos
 */
export const useTodoFilters = (todos, filters) => {
  // Debounce search to prevent excessive recalculations
  const debouncedSearch = useDebounce(filters.search, SEARCH.DEBOUNCE_DELAY);

  const filteredTodos = useMemo(() => {
    let result = todos;

    // 1. Status filter
    if (filters.status === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filters.status === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    // 2. Due date filter
    if (filters.dueDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      result = result.filter(todo => {
        if (!todo.dueDate) {
          return filters.dueDate === 'noDueDate';
        }

        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        switch (filters.dueDate) {
          case 'noDueDate':
            return !todo.dueDate;
          case 'overdue':
            return dueDate < today;
          case 'dueToday':
            return dueDate.getTime() === today.getTime();
          case 'dueThisWeek':
            return dueDate >= today && dueDate <= nextWeek;
          case 'upcoming':
            return dueDate > nextWeek;
          default:
            return true;
        }
      });
    }

    // 3. Search filter (case-insensitive)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(searchLower)
      );
    }

    // 4. Sorting
    result = result.sort((a, b) => {
      let compareValue = 0;

      switch (filters.sortBy) {
        case 'name':
          compareValue = a.text.localeCompare(b.text);
          break;
        case 'dueDate':
          compareValue = new Date(a.dueDate || Infinity) -
                         new Date(b.dueDate || Infinity);
          break;
        case 'created':
        default:
          compareValue = new Date(b.createdAt) - new Date(a.createdAt);
      }

      return filters.sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return result;
  }, [todos, filters, debouncedSearch]);

  return filteredTodos;
};