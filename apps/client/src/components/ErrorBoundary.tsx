import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackRoute?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleResetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.fallbackRoute) {
      this.props.fallbackRoute();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <AlertTriangle size={32} />
          </div>

          <h1 className="text-xl font-black mb-2 text-white">حدث خطأ غير متوقع</h1>
          <p className="text-xs text-slate-400 mb-6 max-w-sm">
            تم اعتراض الخطأ بواسطة كاشف الأخطاء الشامل لمنع الشاشة البيضاء.
          </p>

          {this.state.error && (
            <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left font-mono text-xs text-red-400 overflow-x-auto mb-6 shadow-inner">
              <p className="font-bold border-b border-slate-800 pb-2 mb-2 text-red-300">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <pre className="text-[10px] text-slate-500 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={this.handleResetState}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all active:scale-95"
            >
              <Home size={16} />
              الرئيسية
            </button>
            <button
              onClick={this.handleReload}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-950/40"
            >
              <RefreshCw size={16} />
              تحديث
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
