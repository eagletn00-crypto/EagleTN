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
    console.error('Uncaught error in Livreur App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 text-center">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 max-w-sm space-y-3">
            <span className="text-4xl block">⚠️</span>
            <h2 className="text-base font-black text-gray-900">Une erreur est survenue</h2>
            <p className="text-xs text-gray-500">
              {this.state.error?.message || "Problème de connexion avec le serveur Supabase."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 text-white font-black text-xs py-3 rounded-xl shadow-xs active:scale-95 transition-all"
            >
              Recharger l'application 🔄
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
