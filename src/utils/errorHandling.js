// src/utils/errorHandling.js
export class TodoError extends Error {
  constructor(message, type = 'general', retryable = false) {
    super(message);
    this.type = type; // 'network', 'storage', 'validation'
    this.retryable = retryable;
  }
}

export const createStorageError = (message) =>
  new TodoError(message, 'storage', true);
export const createValidationError = (message) =>
  new TodoError(message, 'validation', false);