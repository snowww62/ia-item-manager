import React from 'react';

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-line flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-ink-faint" />
      </div>
    )}
    <p className="text-lg font-semibold text-ink">{title}</p>
    {description && (
      <p className="text-ink-muted mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
