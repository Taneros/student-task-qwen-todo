// src/utils/validation.js
import { CONSTANTS } from '../constants/config';

export const validateTodoText = (text) => {
  if (!text?.trim()) return 'Todo text cannot be empty';
  if (text.length > CONSTANTS.TODO_MAX_LENGTH) return 'Todo text too long';
  return null;
};

export const sanitizeInput = (input) => input?.trim() || '';