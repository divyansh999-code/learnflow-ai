import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';

interface ErrorBoundaryProps {
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  public readonly props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          fontFamily: 'system-ui, sans-serif', 
          maxWidth: '600px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ef4444' }}>Something went wrong.</h1>
          <p style={{ color: '#374151', marginBottom: '1rem' }}>
            The application crashed. Here is the error message:
          </p>
          <pre style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            overflowX: 'auto',
            color: '#dc2626',
            fontSize: '0.875rem'
          }}>
            {this.state.error?.message || 'Unknown Error'}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);