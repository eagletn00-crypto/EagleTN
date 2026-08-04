import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught UI Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center font-sans">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xl max-w-sm w-full backdrop-blur-xl">
            <div className="w-14 h-14 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black shadow-inner">
              🦅
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-1">EAGLE.TN SYSTEM</h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              تم استرجاع النظام بنجاح وتفادي خطأ الواجهة الصامت.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8952B] text-slate-950 font-black py-3.5 rounded-2xl text-xs shadow-lg shadow-[#D4AF37]/20 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              RECHARGER L'APPLICATION
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
