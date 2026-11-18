import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#FAF8F5] p-6 flex flex-col items-center justify-center font-sans text-left">
          <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E70013]/20 p-6 flex flex-col gap-4 overflow-hidden">
            <div>
              <h1 className="text-[20px] font-black text-[#E70013] tracking-tight">Erreur d'Exécution</h1>
              <p className="text-[13px] font-bold text-[#141413] mt-1">{this.state.error?.message || "Une erreur inattendue s'est produite."}</p>
            </div>
            <div className="bg-[#1C1917]/5 p-4 rounded-xl overflow-x-auto w-full">
              <pre className="text-[10px] text-[#57534E] whitespace-pre-wrap font-mono leading-relaxed">
                {this.state.error?.stack}
              </pre>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-2 w-full h-12 bg-[#141413] text-[#FFFFFF] rounded-xl font-bold text-[14px] outline-none shadow-sm active:scale-95 transition-transform"
            >
              Recharger l'application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
