import React from 'react';

export const SecurityFooter: React.FC = () => {
  return (
    <footer className="pt-8 pb-12 text-center space-y-1.5 select-none">
      <div className="flex items-center justify-center gap-3 text-[11px] font-medium text-slate-400">
        <a href="#terms" className="hover:text-slate-600 transition-colors underline underline-offset-2">
          Conditions d'utilisation
        </a>
        <span>•</span>
        <a href="#privacy" className="hover:text-slate-600 transition-colors underline underline-offset-2">
          Confidentialité
        </a>
      </div>
      <p className="text-[10px] font-medium text-slate-300">
        EAGLE TN DIGYTAL SYSTEM © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default SecurityFooter;
