import React from 'react';

const Toggle = ({ checked, onChange, label, description, id }) => (
  <div className="flex items-center justify-between gap-4">
    {(label || description) && (
      <div className="min-w-0">
        {label && <p className="font-medium text-ink text-sm">{label}</p>}
        {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
      </div>
    )}
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? 'bg-brand' : 'bg-surface-hover border border-line'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-soft transition-transform duration-200 ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  </div>
);

export default Toggle;
