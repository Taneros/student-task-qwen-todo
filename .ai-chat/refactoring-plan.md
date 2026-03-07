## Plan: Critical Production Refactoring

Implement high-priority architectural improvements for production readiness.

**TL;DR - Split contexts, add error handling, extract hooks, and create constants for better maintainability and performance.**

### Steps

#### **Phase 1: Context Splitting (HIGH PRIORITY)**
1. **Create TodoDataContext**
   - Extract todos state, CRUD operations (addTodo, deleteTodo, undoDeleteTodo, updateTodo, toggleComplete)
   - Keep loading/error states for data operations
   - Remove filters and UI-related state

2. **Create TodoUIContext**
   - Extract filters state and setFilters function
   - Handle UI-specific loading states if needed
   - Keep search/filter logic separate from data operations

3. **Update Components**
   - Modify TodoForm to use TodoDataContext for addTodo
   - Modify TodoList to use TodoDataContext for todos + TodoUIContext for filters
   - Modify TodoFilters to use TodoUIContext for filters
   - Update all imports and context consumers

#### **Phase 2: Error Handling Strategy (HIGH PRIORITY)**
1. **Create Error Handling Utilities**
   - Define error types and factory functions
   - Create error boundary with error reporting
   - Add retry mechanisms for failed operations

2. **Update Storage Layer**
   - Add retry logic for IndexedDB operations
   - Better error categorization (network, storage, validation)
   - Graceful degradation strategies

3. **Update Components**
   - Add error states to forms and lists
   - Implement retry buttons for failed operations
   - Add user-friendly error messages

#### **Phase 3: Input Validation & Sanitization (HIGH PRIORITY)**
1. **Create Validation Utilities**
   - Input sanitization functions (trim, escape, length limits)
   - Validation schemas for todos and filters
   - Type checking and bounds validation

2. **Update TodoForm**
   - Add real-time validation feedback
   - Sanitize inputs before submission
   - Prevent invalid submissions

3. **Update Filters**
   - Validate filter parameters
   - Sanitize search queries
   - Prevent XSS in search terms

#### **Phase 4: Custom Hooks Extraction (MEDIUM PRIORITY)**
1. **Extract TodoItem Logic**
   - Create useTodoActions hook for delete/undo logic
   - Extract date formatting logic to useTodoDisplay
   - Separate business logic from presentation

2. **Extract Form Logic**
   - Create useTodoForm hook for form state and validation
   - Extract submission logic
   - Add form reset and validation state

3. **Extract Filter Logic**
   - Create useFilterActions hook for filter state management
   - Extract search debouncing logic
   - Separate filter operations from UI

#### **Phase 5: State Selectors (MEDIUM PRIORITY)**
1. **Create Selector Hooks**
   - useTodoData: Select specific todo data without full re-renders
   - useFilterState: Select filter state efficiently
   - useUIState: Select UI-specific state

2. **Optimize Re-renders**
   - Use selector hooks in components
   - Reduce dependency arrays in useMemo/useCallback
   - Implement shallow comparison where possible

#### **Phase 6: Constants Consolidation (LOW PRIORITY)**
1. **Create Constants File**
   - Extract all magic numbers (timeouts, limits, etc.)
   - Define error types and messages
   - Create validation rules constants

2. **Update Imports**
   - Replace magic numbers with constants
   - Update all files to use centralized constants
   - Ensure consistency across the app

### Relevant files
- `src/context/TodoDataContext.jsx` — New context for data operations
- `src/context/TodoUIContext.jsx` — New context for UI state
- `src/utils/errorHandling.js` — Error handling utilities
- `src/utils/validation.js` — Input validation and sanitization
- `src/hooks/useTodoActions.js` — Extracted todo item logic
- `src/hooks/useTodoForm.js` — Extracted form logic
- `src/hooks/useFilterActions.js` — Extracted filter logic
- `src/hooks/useSelectors.js` — State selector hooks
- `src/constants/app.js` — Centralized constants
- `src/components/TodoForm/TodoForm.jsx` — Updated with validation
- `src/components/TodoItem.jsx` — Updated with extracted hooks
- `src/components/TodoFilters/TodoFilters.jsx` — Updated with extracted hooks

### Verification
1. **Context Splitting**: Verify components work with separate contexts, no functionality lost
2. **Error Handling**: Test error scenarios (network failure, storage issues), verify graceful degradation
3. **Validation**: Test invalid inputs, XSS attempts, boundary conditions
4. **Performance**: Check re-render counts reduced, bundle size maintained
5. **Functionality**: All existing features work (CRUD, filtering, undo, etc.)

### Decisions
- **Context Splitting**: TodoDataContext for data, TodoUIContext for filters - clean separation
- **Error Strategy**: Categorize errors (network, storage, validation) with user-friendly messages
- **Validation**: Client-side validation with sanitization, server-ready for future API
- **Selectors**: Custom hooks returning memoized selectors to prevent unnecessary re-renders
- **Constants**: Single file for all app constants, imported as needed

### Success Criteria
- ✅ All existing functionality preserved
- ✅ Improved performance (fewer re-renders)
- ✅ Better error handling and user experience
- ✅ More maintainable and testable code
- ✅ Production-ready input validation