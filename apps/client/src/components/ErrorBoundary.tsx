import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center text-center dir-ltr">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center text-2xl mb-4 border border-rose-500/30">
            ⚠️
          </div>
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-xs text-slate-400 mb-6 max-w-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 break-all">
            {this.state.error?.message || 'Erreur d\'affichage de la commande'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/30"
          >
            Recharger l'application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
