import React from 'react';

const PageHeader = ({ icon: Icon, title, subtitle, actions, children }) => (
  <div className="shrink-0 px-8 pt-7 pb-5 border-b border-line bg-surface/40 backdrop-blur-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-brand" />
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-ink truncate">{title}</h2>
          {subtitle && <p className="text-sm text-ink-muted mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

export default PageHeader;
