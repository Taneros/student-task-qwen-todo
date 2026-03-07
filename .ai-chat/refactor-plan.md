## Plan: Production Code Quality Improvements

Implement critical refactoring items to improve code maintainability, performance, and scalability.

**TL;DR - Split monolithic context, add error handling, create constants, and extract custom hooks for better architecture.**

### Steps

1. **Create Constants File**
   - Extract all magic numbers and configuration values
   - Centralize timeouts, limits, and app constants
   - Make values easily configurable and testable

2. **Add Comprehensive Error Handling Strategy**
   - Create standardized error types and handling utilities
   - Add input validation and sanitization functions
   - Implement consistent error reporting across the app

3. **Split TodoContext into TodoDataContext + TodoUIContext**
   - Separate data operations from UI state management
   - Reduce unnecessary re-renders by splitting concerns
   - Create proper state selectors for optimized rendering

4. **Extract Custom Hooks for Complex Component Logic**
   - Create useTodoActions hook for TodoItem delete logic
   - Extract form validation logic into reusable hooks
   - Simplify component code by moving business logic to hooks

5. **Implement Proper State Selectors**
   - Add selector functions to prevent unnecessary re-renders
   - Optimize context consumers with memoized selectors
   - Reduce component coupling to context changes

### Relevant files
- `src/constants/app.js` — New constants file
- `src/utils/errorHandling.js` — New error handling utilities
- `src/utils/validation.js` — New input validation utilities
- `src/context/TodoDataContext.jsx` — New data context
- `src/context/TodoUIContext.jsx` — New UI context
- `src/hooks/useTodoActions.js` — New custom hook for actions
- `src/hooks/useFormValidation.js` — New validation hook
- `src/hooks/useSelectors.js` — New selector hooks

### Verification
1. Constants file created with all magic numbers extracted
2. Error handling utilities working across components
3. Input validation preventing invalid data entry
4. Contexts split without breaking functionality
5. Custom hooks reducing component complexity
6. State selectors reducing unnecessary re-renders
7. All existing functionality preserved
8. Build and lint passing

### Decisions
- Constants: Centralized in single file with clear naming
- Error handling: Standardized error objects with types and messages
- Validation: Client-side validation with user-friendly messages
- Context split: Data operations vs UI state separation
- Selectors: Memoized selectors to prevent over-rendering
- Hooks: Extract complex logic while maintaining simplicity