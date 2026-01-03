import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { ToastState } from '../types';

interface Props {
  toast: ToastState;
  onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const styles = {
    error: 'bg-danger/10 border-danger/50 text-danger',
    success: 'bg-success/10 border-success/50 text-success',
    info: 'bg-accent/10 border-accent/50 text-accent',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl animate-in slide-in-from-top-4 fade-in duration-300 max-w-[90vw] ${styles[toast.type]}`}>
      {icons[toast.type]}
      <p className="text-sm font-medium pr-2">{toast.message}</p>
      <button onClick={onDismiss} className="p-1 hover:bg-white/10 rounded-full transition-colors">
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
};