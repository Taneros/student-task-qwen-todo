import React from 'react';

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
        <div role="alert" style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#721c24',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          margin: '2rem'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ marginTop: '1rem', textAlign: 'left' }}>
            <summary>Error details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
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