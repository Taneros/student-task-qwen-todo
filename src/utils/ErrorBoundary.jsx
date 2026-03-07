import React from 'react';
import { ERROR_BOUNDARY_STYLES } from '../constants/constants';

/**
 * Error Boundary component for catching JavaScript errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={ERROR_BOUNDARY_STYLES.CONTAINER}>
          <h2>Something went wrong</h2>
          <details style={ERROR_BOUNDARY_STYLES.DETAILS}>
            <summary>Error details</summary>
            <pre style={ERROR_BOUNDARY_STYLES.ERROR_TEXT}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;