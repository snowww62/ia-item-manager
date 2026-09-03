import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const config = {
  success: { icon: CheckCircle2, cls: 'text-ok', bar: 'bg-ok' },
  error: { icon: AlertCircle, cls: 'text-bad', bar: 'bg-bad' },
  warning: { icon: AlertTriangle, cls: 'text-warn', bar: 'bg-warn' },
  info: { icon: Info, cls: 'text-accent', bar: 'bg-accent' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idRef.current;
      const duration = opts.duration ?? (type === 'error' ? 7000 : 4000);
      setToasts((list) => [...list, { id, type, message, title: opts.title }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  const api = {
    success: (m, o) => push('success', m, o),
    error: (m, o) => push('error', m, o),
    warning: (m, o) => push('warning', m, o),
    info: (m, o) => push('info', m, o),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2.5 w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map((t) => {
          const c = config[t.type] || config.info;
          const Icon = c.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto relative overflow-hidden bg-surface border border-line-strong rounded-md shadow-pop animate-toast-in flex gap-3 p-3.5 pr-9"
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar}`} />
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${c.cls}`} />
              <div className="min-w-0 flex-1">
                {t.title && <p className="text-sm font-semibold text-ink">{t.title}</p>}
                <p className="text-sm text-ink-muted break-words leading-snug">{t.message}</p>
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute top-2.5 right-2.5 text-ink-faint hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
