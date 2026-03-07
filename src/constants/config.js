// src/constants/config.js
export const CONSTANTS = {
  UNDO_TIMEOUT_MS: 10000,
  ANIMATION_DELAY_MS: 300,
  TOAST_DURATION_MS: 8000,
  CLEANUP_INTERVAL_MS: 1000,
  PROGRESS_UPDATE_MS: 50,
  TODO_MAX_LENGTH: 200,
  DAYS_IN_WEEK: 7,
  AUTO_DISMISS_BUFFER_MS: 300
};

export const FILTER_OPTIONS = {
  STATUS: ['all', 'active', 'completed'],
  DUE_DATE: ['all', 'noDueDate', 'overdue', 'dueToday', 'dueThisWeek', 'upcoming'],
  SORT_BY: ['created', 'name', 'dueDate'],
  SORT_ORDER: ['asc', 'desc']
};