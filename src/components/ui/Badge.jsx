import React from 'react';

const tones = {
  neutral: 'bg-surface-raised border-line text-ink-muted',
  brand: 'bg-brand-soft border-brand/30 text-brand',
  ok: 'bg-ok/12 border-ok/30 text-ok',
  warn: 'bg-warn/12 border-warn/30 text-warn',
  bad: 'bg-bad/12 border-bad/30 text-bad',
  accent: 'bg-accent/12 border-accent/30 text-accent',
};

const Badge = ({ tone = 'neutral', icon: Icon, children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${tones[tone]} ${className}`}
  >
    {Icon && <Icon className="w-3.5 h-3.5" />}
    {children}
  </span>
);

export default Badge;
