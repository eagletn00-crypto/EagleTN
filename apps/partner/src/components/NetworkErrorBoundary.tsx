import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class NetworkErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 [DIAGNOSTIC CATCH] Network or Fetch Error Captured:", error);
    console.error("Component Stack:", errorInfo.componentStack);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          backgroundColor: '#fee2e2',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          color: '#991b1b',
          fontFamily: 'monospace',
          direction: 'ltr',
          textAlign: 'left'
        }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>🛑 Diagnostic Error Boundary Triggered</h2>
          <p><strong>Error Message:</strong> {this.state.error?.message}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre style={{ 
            backgroundColor: '#fef2f2', 
            padding: '10px', 
            borderRadius: '6px', 
            overflowX: 'auto',
            fontSize: '12px'
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            إعادة محاولة (Reload Page)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
