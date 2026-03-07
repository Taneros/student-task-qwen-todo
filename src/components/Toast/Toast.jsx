import React from 'react';
import { TOAST } from '../../constants/constants';
import styles from './Toast.module.css';

/* eslint-disable react-hooks/exhaustive-deps */

/**
 * Toast notification component with undo functionality
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.actionText - Text for the action button (e.g., "Undo")
 * @param {Function} props.onAction - Callback when action button is clicked
 * @param {Function} props.onDismiss - Callback when toast is dismissed
 * @param {number} props.duration - Auto-dismiss duration in milliseconds (default: 8000)
 * @returns {JSX.Element}
 */
const Toast = ({ message, actionText, onAction, onDismiss, duration = TOAST.DEFAULT_DURATION }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [progress, setProgress] = React.useState(100);
  const timeoutRef = React.useRef(null);
  const intervalRef = React.useRef(null);
  const dismissRef = React.useRef(null);

  const handleAction = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsVisible(false);
    setTimeout(() => {
      onAction();
    }, TOAST.ANIMATION_BUFFER); // Wait for exit animation
  }, [onAction]);

  const handleDismiss = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, TOAST.ANIMATION_BUFFER); // Wait for exit animation
  }, [onDismiss]);

  // Update ref when handleDismiss changes
  // eslint-disable-next-line
  React.useEffect(() => {
    dismissRef.current = handleDismiss;
  }, [handleDismiss]);

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleDismiss();
    }
  }, [handleAction, handleDismiss]);

  React.useEffect(() => {
    // Start visible
    setIsVisible(true);

    // Progress bar animation
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, ((duration - elapsed) / duration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 50);

    // Auto-dismiss timer
    timeoutRef.current = setTimeout(() => {
      if (dismissRef.current) {
        dismissRef.current();
      }
    }, duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [duration]);

  return (
    <div
      className={`${styles.toast} ${isVisible ? styles.visible : ''}`}
      role="alert"
      aria-live="assertive"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.actionButton}
          onClick={handleAction}
          aria-label={`${actionText} - Press Enter or Space`}
        >
          {actionText}
        </button>
      </div>
      <div
        className={styles.progressBar}
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
};

export default Toast;