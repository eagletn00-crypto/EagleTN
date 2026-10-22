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
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-100">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-inner">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Une erreur technique est survenue</h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Le système a rencontré une anomalie lors du chargement des données. Veuillez actualiser la session ou vous reconnecter.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all shadow-sm"
              >
                Réessayer
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/partner/login';
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.renderChildren();
  }

  private renderChildren() {
    return this.props.children;
  }
}
