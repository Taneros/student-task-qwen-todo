import React from 'react';
import Toast from '../components/Toast/Toast';

/**
 * @typedef {Object} ToastItem
 * @property {string} id - Unique identifier
 * @property {string} message - Toast message
 * @property {string} actionText - Action button text
 * @property {Function} onAction - Action callback
 * @property {number} duration - Auto-dismiss duration
 */

const ToastContext = React.createContext(null);

/**
 * ToastProvider component for global toast management
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = React.useCallback((message, actionText, onAction, duration = 8000) => {
    const id = Date.now().toString();
    const toast = {
      id,
      message,
      actionText,
      onAction,
      duration
    };

    setToasts(prev => [...prev, toast]);

    // Auto-remove after duration + animation time
    setTimeout(() => {
      removeToast(id);
    }, duration + 300);

    return id;
  }, [removeToast]);

  const value = React.useMemo(() => ({
    addToast,
    removeToast
  }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div 
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, pointerEvents: 'none', zIndex: 1000 }}
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              position: 'absolute',
              bottom: `${2 + index * 4.5}rem`,
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'auto'
            }}
          >
            <Toast
              message={toast.message}
              actionText={toast.actionText}
              onAction={() => {
                toast.onAction();
                removeToast(toast.id);
              }}
              onDismiss={() => removeToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Custom hook to use ToastContext
 * @returns {{addToast: Function, removeToast: Function}}
 */
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};