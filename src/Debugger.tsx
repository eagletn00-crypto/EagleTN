import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; errorInfo: ErrorInfo | null; }

export class EagleDebugger extends Component<Props, State> {
  public state: State = { hasError: false, error: null, errorInfo: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("🚨 EAGLE CRITICAL ERROR:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', backgroundColor: '#2e020d', color: '#fecaca', minHeight: '100vh', fontFamily: 'monospace', zIndex: 9999, position: 'relative' }}>
          <h1 style={{ color: '#ef4444', fontSize: '28px', fontWeight: '900', borderBottom: '2px solid #9f1239', paddingBottom: '15px' }}>
            ❌ تم اكتشاف معضلة في النظام
          </h1>
          <h2 style={{ color: '#fca5a5', marginTop: '20px', fontSize: '16px' }}>نوع الخطأ:</h2>
          <div style={{ backgroundColor: '#4c0519', padding: '15px', borderRadius: '8px', marginTop: '10px', fontWeight: 'bold' }}>
            {this.state.error?.toString()}
          </div>
          <h2 style={{ color: '#fca5a5', marginTop: '20px', fontSize: '16px' }}>موقع المعضلة (Stack Trace):</h2>
          <pre style={{ backgroundColor: '#000000', padding: '15px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', marginTop: '10px', border: '1px solid #7f1d1d' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '30px', padding: '15px 30px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>
            إعادة تشغيل النظام
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
