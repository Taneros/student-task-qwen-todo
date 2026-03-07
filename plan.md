## Plan: Critical Production Refactoring with Modern Best Practices

Implement high-priority architectural improvements for production readiness, focusing on separation of concerns, modularity, scalability, readability, and simplicity. Based on codebase analysis, prioritize context splitting, constants extraction, error handling, and performance optimizations.

**TL;DR - Start with critical fixes (HTML error, constants), then split contexts into TodoContext (CRUD), FilterContext, and UndoContext. Add validation, error handling, and performance improvements.**

### Steps

#### **Phase 0: Critical Fixes (HIGH PRIORITY - Start Here)**
1. **Fix HTML Structure Error in TodoFilters**
   - Add missing closing `</div>` in [TodoFilters.jsx](TodoFilters.jsx#L60)
   ```jsx
   // After status select, add:
   </div>
   <div className={styles.filterGroup}>
   ```

2. **Create Constants File**
   - Extract all magic numbers and hardcoded values
   ```javascript
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
   ```

3. **Extract Date Utilities**
   - Consolidate duplicated date logic
   ```javascript
   // src/utils/dateUtils.js
   export const getDueDateStatus = (dateString) => {
     if (!dateString) return null;
     const dueDate = new Date(dateString);
     const today = getTodayDateAtMidnight();
     // ... logic
   };

   export const getTodayDateAtMidnight = () => {
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     return today;
   };

   export const getNextWeekDate = (fromDate = getTodayDateAtMidnight()) => {
     const nextWeek = new Date(fromDate);
     nextWeek.setDate(fromDate.getDate() + 7);
     return nextWeek;
   };
   ```

#### **Phase 1: Context Splitting (HIGH PRIORITY)**
1. **Refactor TodoContext to TodoContext (CRUD only)**
   - Extract todos state, CRUD operations (addTodo, deleteTodo, updateTodo, toggleComplete)
   - Keep loading/error states for data operations
   - Remove filters and undo functionality
   ```javascript
   // src/context/TodoContext.jsx (refactored)
   export const useTodos = () => ({
     todos,
     addTodo,
     deleteTodo,
     updateTodo,
     toggleComplete,
     isLoading,
     error
   });
   ```

2. **Create FilterContext**
   - Extract filters state and setFilters function
   ```javascript
   // src/context/FilterContext.jsx
   const FilterContext = React.createContext();

   export const FilterProvider = ({ children }) => {
     const [filters, setFilters] = useState({
       search: '',
       status: 'all',
       dueDate: 'all',
       sortBy: 'created',
       sortOrder: 'desc'
     });

     return (
       <FilterContext.Provider value={{ filters, setFilters }}>
         {children}
       </FilterContext.Provider>
     );
   };

   export const useFilters = () => React.useContext(FilterContext);
   ```

3. **Create UndoContext**
   - Extract undo functionality using simplified hook
   ```javascript
   // src/hooks/useUndoStack.js
   export const useUndoStack = (timeoutMs = 10000) => {
     const [stack, setStack] = useState(new Map());
     
     const add = useCallback((id, item) => {
       setStack(prev => new Map(prev).set(id, {
         ...item,
         expiresAt: Date.now() + timeoutMs
       }));
     }, [timeoutMs]);
     
     const remove = useCallback((id) => {
       setStack(prev => {
         const newMap = new Map(prev);
         newMap.delete(id);
         return newMap;
       });
     }, []);
     
     // Auto-cleanup
     useEffect(() => {
       const timer = setInterval(() => {
         setStack(prev => {
           const now = Date.now();
           const newMap = new Map();
           for (const [id, item] of prev) {
             if (item.expiresAt > now) newMap.set(id, item);
           }
           return newMap;
         });
       }, 1000);
       
       return () => clearInterval(timer);
     }, []);
     
     return { stack, add, remove };
   };

   // src/context/UndoContext.jsx
   const UndoContext = React.createContext();

   export const UndoProvider = ({ children }) => {
     const undoStack = useUndoStack();
     
     const undoDeleteTodo = useCallback((id) => {
       const todo = undoStack.stack.get(id);
       if (todo) {
         // Add back to todos
         undoStack.remove(id);
       }
     }, [undoStack]);
     
     return (
       <UndoContext.Provider value={{ undoDeleteTodo, deletedTodos: undoStack.stack }}>
         {children}
       </UndoContext.Provider>
     );
   };

   export const useUndo = () => React.useContext(UndoContext);
   ```

4. **Update Components to Use Split Contexts**
   - Modify TodoForm to use TodoContext for addTodo
   - Modify TodoList to use TodoContext for todos + FilterContext for filters
   - Modify TodoFilters to use FilterContext
   - Update TodoItem to use UndoContext for undo
   - Update all imports and providers in App.jsx

#### **Phase 2: Error Handling Strategy (HIGH PRIORITY)**
1. **Create Error Handling Utilities**
   - Define error types and factory functions
   ```javascript
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
   ```

2. **Update Storage Layer with Retry Logic**
   - Add retry mechanisms for IndexedDB operations
   ```javascript
   // src/services/storageService.js
   export const saveTodos = async (todos, retries = 3) => {
     for (let i = 0; i < retries; i++) {
       try {
         // ... save logic
         return;
       } catch (error) {
         if (i === retries - 1) throw createStorageError('Failed to save todos');
         await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
       }
     }
   };
   ```

3. **Update Components with Error States**
   - Add error display and retry buttons
   ```jsx
   // In TodoForm.jsx
   if (error) {
     return (
       <div className={styles.error}>
         <p>{error.message}</p>
         {error.retryable && <button onClick={retryAddTodo}>Retry</button>}
       </div>
     );
   }
   ```

#### **Phase 3: Input Validation & Sanitization (HIGH PRIORITY)**
1. **Create Validation Utilities**
   ```javascript
   // src/utils/validation.js
   export const validateTodoText = (text) => {
     if (!text?.trim()) return 'Todo text cannot be empty';
     if (text.length > CONSTANTS.TODO_MAX_LENGTH) return 'Todo text too long';
     return null;
   };

   export const sanitizeInput = (input) => input?.trim() || '';
   ```

2. **Update TodoForm with Validation**
   ```jsx
   // src/components/TodoForm/TodoForm.jsx
   const [validationError, setValidationError] = useState(null);

   const handleSubmit = (e) => {
     e.preventDefault();
     const error = validateTodoText(text);
     if (error) {
       setValidationError(error);
       return;
     }
     addTodo(sanitizeInput(text), dueDate);
     setText('');
     setValidationError(null);
   };
   ```

#### **Phase 4: Performance Optimizations (MEDIUM PRIORITY)**
1. **Add Debouncing to Storage**
   ```javascript
   // src/hooks/useLocalStorage.js
   export const useLocalStorage = (key, initialValue, debounceMs = 500) => {
     // ... existing logic
     useEffect(() => {
       if (isFirstRender.current) {
         isFirstRender.current = false;
         return;
       }
       
       const timer = setTimeout(
         () => saveToStorage(key, storedValueRef.current),
         debounceMs
       );
       
       return () => clearTimeout(timer);
     }, [storedValue]);
   };
   ```

2. **Optimize Filter Handlers**
   ```jsx
   // src/components/TodoFilters/TodoFilters.jsx
   const createFilterHandler = (filterKey) =>
     React.useCallback((e) => {
       setFilters({ [filterKey]: e.target.value });
     }, [setFilters]);
   ```

3. **Add Memoization for Filtered Results**
   ```javascript
   // src/hooks/useTodoFilters.js
   const debouncedFilters = useDebounce(filters, 300);
   const filteredTodos = useMemo(() => {
     // ... filtering logic with debouncedFilters
   }, [todos, debouncedFilters]);
   ```

#### **Phase 5: Accessibility Improvements (MEDIUM PRIORITY)**
1. **Fix Toast Accessibility**
   ```jsx
   // src/context/ToastContext.jsx
   <div 
     style={{ /* ... */ }}
     role="region"
     aria-live="polite"
     aria-label="Notifications"
   >
   ```

2. **Add Missing Labels in Filters**
   ```jsx
   // src/components/TodoFilters/TodoFilters.jsx
   <label htmlFor="sortBy">Sort by:</label>
   <select id="sortBy">...</select>
   ```

### Relevant files
- `src/constants/config.js` — New constants file
- `src/utils/dateUtils.js` — Shared date utilities
- `src/utils/errorHandling.js` — Error handling utilities
- `src/utils/validation.js` — Input validation
- `src/hooks/useUndoStack.js` — Simplified undo logic
- `src/context/TodoContext.jsx` — Refactored for CRUD only
- `src/context/FilterContext.jsx` — New filter context
- `src/context/UndoContext.jsx` — New undo context
- `src/services/storageService.js` — Updated with retry logic
- `src/hooks/useLocalStorage.js` — Added debouncing
- `src/hooks/useTodoFilters.js` — Optimized with debouncing
- `src/components/TodoForm/TodoForm.jsx` — Added validation
- `src/components/TodoFilters/TodoFilters.jsx` — Fixed HTML, optimized handlers
- `src/components/TodoItem.jsx` — Updated for undo context
- `src/components/TodoList.jsx` — Updated contexts
- `src/context/ToastContext.jsx` — Improved accessibility

### Verification
1. **Critical Fixes**: HTML structure fixed, no layout breaks
2. **Constants**: All magic numbers extracted, consistent usage
3. **Context Splitting**: Components use appropriate contexts, no tight coupling
4. **Error Handling**: Test storage failures, network issues, validation errors
5. **Validation**: Invalid inputs rejected, XSS prevented
6. **Performance**: Reduced re-renders, debounced operations
7. **Accessibility**: Screen readers announce toasts, all labels present
8. **Functionality**: All features work (CRUD, filtering, undo, search)
9. **Build & Lint**: No errors, improved maintainability

### Decisions
- **Context Split**: TodoContext (CRUD), FilterContext (UI filters), UndoContext (undo stack) - clean separation of concerns
- **Constants First**: Extract magic numbers before refactoring to avoid inconsistencies
- **Error Strategy**: Categorize errors with retry mechanisms for storage/network issues
- **Validation**: Client-side with sanitization, ready for future API integration
- **Performance**: Debounce storage writes and filter computations for large datasets
- **Simplicity**: Extract convoluted logic (undo stack) into reusable hooks
- **Accessibility**: Ensure WCAG compliance for production readiness

### Success Criteria
- ✅ Separation of concerns achieved with context splitting
- ✅ Improved modularity and scalability for future features
- ✅ Enhanced code readability with extracted utilities and constants
- ✅ Simplified complex logic with custom hooks
- ✅ Better error handling and user feedback
- ✅ Optimized performance for large todo lists
- ✅ Production-ready validation and accessibility
- ✅ All existing functionality preserved