// Centralized constants for the Todo application
// Extracted magic numbers and configuration values for better maintainability

export const DATABASE = {
  NAME: 'TodoDB',
  VERSION: 1,
  STORE_NAME: 'todos'
};

export const STORAGE_KEYS = {
  TODOS: 'todos'
};

export const FORM_VALIDATION = {
  TODO_MAX_LENGTH: 200,
  TODO_MIN_LENGTH: 1
};

export const TOAST = {
  DEFAULT_DURATION: 8000, // 8 seconds
  ANIMATION_BUFFER: 300, // 300ms for animation completion
  POSITION: 'top-right'
};

export const TODO_DELETION = {
  UNDO_TIMEOUT: 10000, // 10 seconds to undo deletion
  CLEANUP_INTERVAL: 1000 // 1 second cleanup check interval
};

export const SEARCH = {
  DEBOUNCE_DELAY: 300 // 300ms debounce for search input
};

export const FILTERS = {
  DATE_CALCULATION: {
    DAYS_IN_WEEK: 7
  }
};

export const ERROR_BOUNDARY_STYLES = {
  CONTAINER: {
    padding: '2rem',
    textAlign: 'center',
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    margin: '2rem'
  },
  DETAILS: {
    marginTop: '1rem',
    textAlign: 'left'
  },
  ERROR_TEXT: {
    whiteSpace: 'pre-wrap',
    fontSize: '0.875rem'
  }
};

export const DEFAULT_FILTERS = {
  search: '',
  status: 'all', // 'all', 'active', 'completed'
  dueDate: 'all', // 'all', 'noDueDate', 'overdue', 'dueToday', 'dueThisWeek', 'upcoming'
  sortBy: 'created', // 'created', 'name', 'dueDate'
  sortOrder: 'asc' // 'asc', 'desc'
};