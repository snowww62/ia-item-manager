import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Spinner from './Spinner';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => {
    return new Promise((resolve) => {
      resolver.current = resolve;
      setState({
        title: opts.title || 'Confirm',
        message: opts.message || '',
        confirmLabel: opts.confirmLabel || 'Confirm',
        cancelLabel: opts.cancelLabel || 'Cancel',
        tone: opts.tone || 'danger',
        details: opts.details || null,
      });
    });
  }, []);

  const close = (result) => {
    setState(null);
    setBusy(false);
    resolver.current?.(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!state}
        onClose={() => !busy && close(false)}
        size="sm"
        closeOnBackdrop={!busy}
      >
        {state && (
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                state.tone === 'danger' ? 'bg-bad/12 text-bad' : 'bg-brand-soft text-brand'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-ink">{state.title}</h3>
            <p className="text-sm text-ink-muted mt-2 leading-relaxed whitespace-pre-line">
              {state.message}
            </p>
            {state.details && (
              <div className="mt-3 w-full text-left text-xs text-ink-muted bg-surface-raised border border-line rounded-sm p-3 max-h-40 overflow-y-auto whitespace-pre-line">
                {state.details}
              </div>
            )}
            <div className="flex gap-3 mt-6 w-full">
              <button
                className="btn-ghost flex-1"
                onClick={() => close(false)}
                disabled={busy}
              >
                {state.cancelLabel}
              </button>
              <button
                className={`flex-1 ${state.tone === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => {
                  setBusy(true);
                  close(true);
                }}
                disabled={busy}
              >
                {busy ? <Spinner size="sm" /> : state.confirmLabel}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
};
